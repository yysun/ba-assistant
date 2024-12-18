/**
 * Home Update Module
 * 
 * Contains state update handlers and event processing logic for the home page.
 * Manages:
 * - Drag and resize operations for split panes
 * - Content updates and file management
 * - Tab selection and file operations
 * - AI prompt generation and streaming
 * - Clipboard operations
 * - Project saving and loading
 */

import { Component } from 'apprun';
import {
  State,
  DragEvent,
  InputEvent,
  ERROR_MESSAGES,
  ParsedEvent,
} from './types';
import { saveProject } from '../_services/project';
import { processStreamResponse, SSEEvent as ServiceSSEEvent } from '../_services/sse';

// Type guard to convert service SSE event to our ParsedEvent
const convertServiceEvent = (event: ServiceSSEEvent<any>): ParsedEvent => {
  switch (event.event) {
    case 'content':
    case 'success':
    case 'error':
      return event as ParsedEvent;
    default:
      throw new Error(`Unknown event type: ${event.event}`);
  }
};

// Utility Functions
const beautifyLabel = (filename: string) => {
  return filename
    .replace('.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const verifyPermission = async (dirHandle: FileSystemDirectoryHandle) => {
  const options: FileSystemPermissionMode = 'readwrite';
  // Check if we already have permission, if so, return true
  if ((await dirHandle.queryPermission({ mode: options })) === 'granted') return true;
  // Request permission if we don't have it
  if ((await dirHandle.requestPermission({ mode: options })) === 'granted') return true;
  return false;
};

// Update handlers
const drag = (state: State, e: DragEvent) => {
  const target = e.target;
  target.setPointerCapture(e.pointerId);
  document.body.style.cursor = 'col-resize';

  return {
    ...state,
    dragging: true,
    start: {
      x: e.pageX,
      width: state.leftWidth
    }
  };
};

const move = (state: State, e: PointerEvent) => {
  if (!state.dragging || !state.container) return;

  const dx = e.pageX - state.start.x;
  const containerWidth = state.container.offsetWidth;
  const deltaPercentage = (dx / containerWidth) * 100;
  const newLeftWidth = Math.max(20, Math.min(80,
    state.start.width + deltaPercentage
  ));

  return { ...state, leftWidth: newLeftWidth };
};

const drop = (state: State, e: PointerEvent) => {
  if (!state.dragging) return;

  const target = e.target as HTMLElement;
  target.releasePointerCapture(e.pointerId);
  document.body.style.cursor = '';

  return {
    ...state,
    dragging: false
  };
};

const updateLeft = (state: State, e: InputEvent) => {
  const newContent = e.target.value;
  if (state.project) {
    state.project.files['project.md'] = newContent;
    saveProject(state.project);
  }
  return {
    ...state,
    leftContent: newContent,
    promptContent: '' // Reset prompt content to trigger regeneration
  };
};

const updateRight = (state: State, e: InputEvent) => {
  const newContent = e.target.value;
  if (state.project && state.activeTab) {
    state.project.files[state.activeTab] = newContent;
    saveProject(state.project);
  }
  state.rightContent = newContent;
};

const setTab = (state: State, filename: string) => {
  if (state.project) {
    state.project.files[state.activeTab] = state.rightContent;
    saveProject(state.project);
  }

  return {
    ...state,
    activeTab: filename,
    rightTitle: beautifyLabel(filename),
    rightContent: state.project?.files[filename] || '',
    promptContent: '' // Reset prompt content to trigger regeneration
  };
};

const toggleFileSelection = (state: State, file: string) => {
  const newSelectedFiles = state.selectedFiles.includes(file)
    ? state.selectedFiles.filter(f => f !== file)
    : [...state.selectedFiles, file];

  return {
    ...state,
    selectedFiles: newSelectedFiles,
    promptContent: '' // Reset prompt content to trigger regeneration
  };
};

const updatePrompt = (state: State, e: InputEvent) => {
  const newContent = e.target.value;
  state.promptContent = newContent;
};

const copyContent = async (state: State, e: MouseEvent) => {
  try {
    await navigator.clipboard.writeText(state.promptContent);

    const tooltip = document.createElement('div');
    tooltip.textContent = 'Copied!';
    tooltip.className = 'absolute top-8 -left-6 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded shadow pointer-events-none z-50 whitespace-nowrap';

    const buttonContainer = (e.target as HTMLElement).closest('.relative');
    if (buttonContainer) {
      buttonContainer.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 2000);
    }
  } catch (err) {
    console.error(ERROR_MESSAGES.COPY_ERROR, err);
  }
};

const toggleFileSelector = (state: State) => ({
  ...state,
  showFileSelector: !state.showFileSelector
});

const selectFolderAndSave = async (state: State) => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const hasPermission = await verifyPermission(dirHandle);

    if (!hasPermission) {
      alert(ERROR_MESSAGES.PERMISSION_DENIED);
      return state;
    }

    if (state.project) {
      // Save current content before saving to files
      state.project.files['project.md'] = state.leftContent;
      state.project.files[state.activeTab] = state.rightContent;
      state.project.folder = dirHandle.name;
      await saveProject(state.project, dirHandle);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      // User cancelled the folder picker
      return state;
    }
    console.error(ERROR_MESSAGES.SAVE_ERROR, err);
    alert(ERROR_MESSAGES.SAVE_ERROR + ' ' + err.message);
  }
  return state;
};

const save = (state: State) => {
  if (state.project) {
    // Save both left and right content before saving project
    state.project.files['project.md'] = state.leftContent;
    state.project.files[state.activeTab] = state.rightContent;
    saveProject(state.project);
  }
};

const render = (_: any, state: State) => state;

const processEvents = (state: State, event: ParsedEvent): State => {
  switch (event.event) {
    case 'content':
      return {
        ...state,
        rightContent: state.rightContent + event.data.content,
        generating: true
      };
    case 'success':
      // Save the generated content
      if (state.project && state.activeTab) {
        state.project.files[state.activeTab] = state.rightContent;
        saveProject(state.project);
      }
      return {
        ...state,
        generating: false
      };
    case 'error':
      alert(event.data.message);
      return {
        ...state,
        generating: false
      };
    default:
      return state;
  }
};

const generate = async (state: State, component: Component<State>) => {
  if (!state.promptContent) return state;

  // Set initial generating state
  let currentState = { ...state, generating: true, rightContent: '' };
  component.run('render', currentState);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a business analyst that write professional docment as per user\'s request' },
          { role: 'user', content: state.promptContent }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`${ERROR_MESSAGES.HTTP_ERROR} ${response.status}`);
    }

    let updatedState = currentState;
    await processStreamResponse<any>(
      response,
      (event) => {
        updatedState = processEvents(updatedState, convertServiceEvent(event));
        component.run('render', updatedState);
      }
    );

    return updatedState;

  } catch (error) {
    console.error('Generation error:', error);
    alert(`${ERROR_MESSAGES.GENERATION_ERROR} ${error.message}`);
    return { ...currentState, generating: false };
  }
};

const documentClick = (state: State, e: MouseEvent) => {
  if (!state.showFileSelector) return;

  const target = e.target as HTMLElement;
  const isInsideSelector = target.closest('#file-selector, button[class*="bg-gray-500"]');

  if (!isInsideSelector) {
    return {
      ...state,
      showFileSelector: false
    };
  }
};

export default {
  drag,
  move,
  drop,
  updateLeft,
  updateRight,
  setTab,
  toggleFileSelection,
  updatePrompt,
  copyContent,
  toggleFileSelector,
  selectFolderAndSave,
  save,
  render,
  generate,
  '@document-click': documentClick,
  '@project': (state: State, project: State['project']) => {
    state.leftContent = project?.files['project.md'] || '';
  }
};
