/**
 * Settings Update Module
 * 
 * Contains state update handlers and API interaction logic for the settings page.
 * Manages:
 * - Path updates and validation
 * - Repository analysis through SSE
 * - Feature extraction and processing
 * - Summary generation and saving to project.md
 * - Project creation if none exists
 * - Clipboard operations
 * - Error handling and state management
 */

import { app, Component } from 'apprun';
import {
  State,
  SSEEvent,
  ErrorMessage,
  API_ENDPOINTS,
  ERROR_MESSAGES,
} from './types';
import { loadProject, saveProject, createProject } from '../_services/project';
import { processStreamResponse, SSEEvent as ServiceSSEEvent, ErrorEventData } from '../_services/sse';

// Utility Functions
const createErrorState = (state: State, error: ErrorMessage): State => ({
  ...state,
  loading: false,
  error
});

// Type guard to convert service SSE event to our typed SSE event
const convertServiceEvent = (event: ServiceSSEEvent<any>): SSEEvent => {
  switch (event.event) {
    case 'commits':
      return {
        event: 'commits',
        data: { content: event.data.content }
      };
    case 'tags':
      return {
        event: 'tags',
        data: { content: event.data.content }
      };
    case 'feature':
      return {
        event: 'feature',
        data: { content: event.data.content }
      };
    case 'summary':
      return {
        event: 'summary',
        data: { content: event.data.content }
      };
    case 'success':
      return {
        event: 'success',
        data: { message: event.data.message }
      };
    case 'error':
      return {
        event: 'error',
        data: { message: (event.data as ErrorEventData).message }
      };
    default:
      throw new Error(`Unknown event type: ${event.event}`);
  }
};

const processEvents = (currentState: State, event: SSEEvent): State => {
  switch (event.event) {
    case 'commits':
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          commits: [...currentState.stats.commits, event.data.content]
        },
        error: null
      };

    case 'tags':
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          tags: [...currentState.stats.tags, event.data.content]
        },
        error: null
      };

    case 'feature':
      return {
        ...currentState,
        features: {
          ...currentState.features,
          items: [...currentState.features.items, event.data.content]
        },
        error: null
      };

    case 'summary':
      return {
        ...currentState,
        features: {
          ...currentState.features,
          summary: [...currentState.features.summary, event.data.content]
        },
        error: null
      };

    case 'success':
      // Save summary to project.md when processing is complete
      if (currentState.features.summary.length > 0) {
        let project = loadProject();
        if (!project) {
          // Create new project using the repo path as name
          const pathParts = currentState.folderPath.split('/');
          const repoName = pathParts[pathParts.length - 1];
          project = createProject(repoName);
        }
        project.files['project.md'] = currentState.features.summary.join('');
        saveProject(project).catch(console.error);
        app.run('@project', project);
      }
      return {
        ...currentState,
        loading: false,
        error: null
      };

    case 'error':
      return createErrorState(
        currentState,
        event.data.message || ERROR_MESSAGES.UNKNOWN_ERROR
      );
  }
};

// Update handlers
const updatePath = (state: State, e: Event): State => ({
  ...state,
  folderPath: (e.target as HTMLInputElement).value,
  error: null
});

const handleKeyUp = async (state: State, component: Component<State>, e: KeyboardEvent): Promise<void> => {
  if (e.key === 'Enter' && !state.loading) {
    await component.run('analyzeRepo');
  }
};

const render = (_: any, state: State): State => state;

const copyFeatures = async (state: State): Promise<State> => {
  const text = state.features.items.join('');
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text:', error);
    return {
      ...state,
      error: 'Failed to copy features to clipboard'
    };
  }
  return {
    ...state,
    error: null
  };
};

const copySummary = async (state: State): Promise<State> => {
  const text = state.features.summary.join('\n');
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text:', error);
    return {
      ...state,
      error: 'Failed to copy summary to clipboard'
    };
  }
  return {
    ...state,
    error: null
  };
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

  component.run('render', currentState);
  
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
