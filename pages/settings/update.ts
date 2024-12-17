/**
 * Settings Update Module
 * 
 * Contains state update handlers and API interaction logic for the settings page.
 * Manages:
 * - Path updates and validation
 * - Repository analysis through SSE
 * - Feature extraction and processing
 * - Summary generation and saving to project.md
 * - Clipboard operations
 * - Error handling and state management
 */

import { Component } from 'apprun';
import { 
  State, 
  SSEEvent, 
  ErrorMessage, 
  API_ENDPOINTS, 
  ERROR_MESSAGES 
} from './types';
import { loadProject, saveProject } from '../_data/project';

// Utility Functions
const createErrorState = (state: State, error: ErrorMessage): State => ({
  ...state,
  loading: false,
  error
});

const processStreamResponse = async (
  response: Response,
  currentState: State,
  onEvent: (state: State, event: SSEEvent) => State,
  onUpdate: (state: State) => void
): Promise<State> => {
  if (!response.body) {
    throw new Error(ERROR_MESSAGES.NO_CONTENT);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          const events = parseSSEEvents(buffer);
          for (const event of events) {
            currentState = onEvent(currentState, event);
          }
        }
        return { ...currentState, loading: false };
      }

      buffer += decoder.decode(value, { stream: true });
      const events = parseSSEEvents(buffer);

      // Keep any incomplete event data in the buffer
      const lastNewline = buffer.lastIndexOf('\n\n');
      if (lastNewline !== -1) {
        buffer = buffer.substring(lastNewline + 2);
      }

      for (const event of events) {
        currentState = onEvent(currentState, event);
        onUpdate(currentState);
      }
    }
  } finally {
    reader.cancel().catch(console.error);
  }
};

const parseSSEEvents = (text: string): SSEEvent[] => {
  const events: SSEEvent[] = [];
  const eventStrings = text.split('\n\n').filter(str => str.trim());

  for (const eventString of eventStrings) {
    const dataMatch = eventString.match(/^data: (.+)$/m);
    if (dataMatch) {
      try {
        const eventData = JSON.parse(dataMatch[1]);
        if (eventData && typeof eventData === 'object' && 'event' in eventData) {
          events.push({
            event: eventData.event,
            data: eventData.data || {}
          });
        }
      } catch (error) {
        console.error('Failed to parse SSE data:', error);
      }
    }
  }

  return events;
};

const processEvents = (currentState: State, event: SSEEvent): State => {
  if (!event.event) {
    return createErrorState(currentState, ERROR_MESSAGES.INVALID_EVENT_FORMAT);
  }

  switch (event.event) {
    case 'commits':
      if (!Array.isArray(event.data?.content)) {
        return createErrorState(currentState, ERROR_MESSAGES.INVALID_COMMITS_DATA);
      }
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          commits: event.data.content
        }
      };

    case 'tags':
      if (!Array.isArray(event.data?.content)) {
        return createErrorState(currentState, ERROR_MESSAGES.INVALID_TAGS_DATA);
      }
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          tags: event.data.content
        }
      };

    case 'feature':
      return {
        ...currentState,
        features: {
          ...currentState.features,
          items: [...currentState.features.items, event.data.content]
        }
      };

    case 'summary':
      return {
        ...currentState,
        features: {
          ...currentState.features,
          summary: [...currentState.features.summary, event.data.content]
        }
      };

    case 'success':
      // Save summary to project.md when processing is complete
      if (currentState.features.summary.length > 0) {
        const project = loadProject();
        if (project) {
          project.files['project.md'] = currentState.features.summary.join('');
          saveProject(project).catch(console.error);
        }
      }
      return {
        ...currentState,
        loading: false
      };

    case 'error':
      return createErrorState(
        currentState,
        event.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR
      );

    default:
      return currentState;
  }
};

// Update handlers
const updatePath = (state: State, e: Event): State => ({
  ...state,
  folderPath: (e.target as HTMLInputElement).value,
  error: null
});

const handleKeyUp = (state: State, component: Component<State>, e: KeyboardEvent) => {
  if (e.key === 'Enter' && !state.loading) {
    component.run('analyzeRepo');
  }
};

const render = (_: any, state: State) => state;

const copyFeatures = async (state: State) => {
  const text = state.features.items.join('');
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
  return state;
};

const copySummary = async (state: State) => {
  const text = state.features.summary.join('\n');
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
  return state;
};

const getFeatures = async (state: State, component: Component<State>): Promise<State> => {
  if (state.loading) return state;

  if (!state.folderPath) {
    return createErrorState(state, ERROR_MESSAGES.NO_PATH);
  }

  const currentState = {
    ...state,
    loading: true,
    error: null,
    features: { items: [], summary: [] }
  };

  try {
    const response = await fetch(
      `${API_ENDPOINTS.FEATURES}?path=${encodeURIComponent(state.folderPath)}`
    );

    if (!response.ok) {
      let errorMessage: ErrorMessage = ERROR_MESSAGES.GENERIC_FEATURES;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `${ERROR_MESSAGES.GENERIC_FEATURES}: Server error ${response.status}`;
      } catch {
        errorMessage = `${ERROR_MESSAGES.GENERIC_FEATURES}: Server error ${response.status} ${response.statusText}`;
      }
      return createErrorState(state, errorMessage);
    }

    return await processStreamResponse(
      response,
      currentState,
      processEvents,
      (state) => component.run('render', state)
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unexpected error occurred';
    return createErrorState(
      state,
      `${ERROR_MESSAGES.GENERIC_FEATURES}: ${errorMessage}`
    );
  }
};

const analyzeRepo = async (state: State, component: Component<State>): Promise<State> => {
  if (state.loading) return state;

  if (!state.folderPath?.trim()) {
    return createErrorState(
      state,
      !state.folderPath ? ERROR_MESSAGES.NO_PATH : ERROR_MESSAGES.EMPTY_PATH
    );
  }

  const currentState = {
    ...state,
    loading: true,
    error: null,
    stats: { commits: [], tags: [] }
  };

  try {
    const response = await fetch(
      `${API_ENDPOINTS.STATS}?path=${encodeURIComponent(state.folderPath)}`
    );

    if (!response.ok) {
      let errorMessage: ErrorMessage = ERROR_MESSAGES.GENERIC_STATS;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `${ERROR_MESSAGES.GENERIC_STATS}: Server error ${response.status}`;
      } catch {
        errorMessage = `${ERROR_MESSAGES.GENERIC_STATS}: Server error ${response.status} ${response.statusText}`;
      }
      return createErrorState(state, errorMessage);
    }

    return await processStreamResponse(
      response,
      currentState,
      processEvents,
      (state) => component.run('render', state)
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unexpected error occurred';
    return createErrorState(
      state,
      `${ERROR_MESSAGES.GENERIC_STATS}: ${errorMessage}`
    );
  }
};

export default {
  updatePath,
  handleKeyUp,
  render,
  copyFeatures,
  copySummary,
  getFeatures,
  analyzeRepo
};
