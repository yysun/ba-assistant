/**
 * Settings Page Component
 * 
 * Handles repository analysis and feature extraction through server-sent events (SSE).
 * Features and summaries are streamed and displayed in real-time.
 * Provides UI for:
 * - Setting repository path
 * - Analyzing repository stats (commits, tags)
 * - Extracting and displaying repository features with live updates
 * - Displaying incremental summary and feature updates in scrollable cards
 * - Copying feature and summary text to clipboard
 */

import { app, Component } from 'apprun';

// Types
interface Commit {
  hash: string;
  date: string;
}

interface Tag {
  name: string;
}

interface Stats {
  commits: Commit[];
  tags: Tag[];
}

interface State {
  folderPath: string;
  loading: boolean;
  error: string | null;
  stats: Stats;
  features: {
    items: string[];
    summary: string[];
  };
}

interface SSEEvent {
  event: string;
  data: {
    content?: any;
    message?: string;
  };
}

// Constants
const DEFAULT_PATH = '/Users/esun/Documents/Projects/code-doc-mcp/';
const API_ENDPOINTS = {
  STATS: '/api/repo/stats',
  FEATURES: '/api/repo/features'
} as const;

const ERROR_MESSAGES = {
  EMPTY_PATH: 'Repository path cannot be empty',
  NO_PATH: 'Please enter a repository path',
  NO_CONTENT: 'Server response has no content',
  GENERIC_STATS: 'Failed to analyze repository',
  GENERIC_FEATURES: 'Failed to analyze features',
  INVALID_EVENT_DATA: 'Invalid event data received',
  INVALID_EVENT_FORMAT: 'Invalid event format - missing event',
  INVALID_COMMITS_DATA: 'Invalid commits data received',
  INVALID_TAGS_DATA: 'Invalid tags data received',
  UNKNOWN_ERROR: 'Unknown error occurred'
} as const;

type ErrorMessage = string;

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

export default class extends Component<State> {
  state = {
    folderPath: DEFAULT_PATH,
    loading: false,
    error: null,
    stats: {
      commits: [],
      tags: []
    },
    features: {
      items: [],
      summary: []
    }
  }

  view = (state: State) => {
    return <div class="h-screen flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
      <h1>Settings</h1>
      <div class="flex-1 flex flex-col min-h-0">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
          Repository Location
        </label>
        <div class="flex gap-2 items-center">
          <input
            type="text"
            value={state.folderPath}
            placeholder="Enter repository path..."
            $oninput="updatePath"
            $onkeyup="handleKeyUp"
            class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
          />
          <button
            $onclick="analyzeRepo"
            disabled={state.loading}
            class={`px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white ${state.loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} whitespace-nowrap`}
          >
            Analyze Repo
          </button>
          <button
            $onclick="getFeatures"
            disabled={state.loading}
            class={`px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white ${state.loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} whitespace-nowrap`}
          >
            Get Features
          </button>
        </div>

        {state.loading &&
          <div class="mt-4">
            <div class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {state.features.items.length > 0 ? 'Analyzing features...' : 'Analyzing repository...'}
              </span>
            </div>
          </div>
        }

        {state.error &&
          <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
            {state.error}
          </div>
        }

        {state.stats.commits.length > 0 &&
          <div class="mt-4 space-y-4 flex-1 min-h-0">
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Repository Stats</h3>
              <dl class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Commits</dt>
                  <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{state.stats.commits.length}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tags</dt>
                  <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{state.stats.tags.length}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">First Commit</dt>
                  <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(state.stats.commits[state.stats.commits.length - 1]?.date).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">Latest Commit</dt>
                  <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(state.stats.commits[0]?.date).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        }

        {state.features.items.length > 0 &&
          <div class="mt-4 flex-1 min-h-0">
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md h-full">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Features</h3>
              <div class="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
                {state.features.summary.length > 0 &&
                  <div class="p-4 bg-white dark:bg-gray-800 rounded-md overflow-y-auto">
                    <div class="flex justify-between items-center mb-2 sticky top-0 bg-white dark:bg-gray-800">
                      <h4 class="text-xs font-medium text-gray-700 dark:text-gray-300">Summary</h4>
                      <button
                        $onclick="copySummary"
                        class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Copy summary to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      </button>
                    </div>
                    <pre class="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {state.features.summary.join('')}
                    </pre>
                  </div>
                }
                <div class="p-4 bg-white dark:bg-gray-800 rounded-md overflow-y-auto">
                  <div class="flex justify-between items-center mb-2 sticky top-0 bg-white dark:bg-gray-800">
                    <h4 class="text-xs font-medium text-gray-700 dark:text-gray-300">Details</h4>
                    <button
                      $onclick="copyFeatures"
                      class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Copy features to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    </button>
                  </div>
                  <pre class="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {state.features.items.join('')}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  }

  update = {
    updatePath: (state: State, e: Event): State => ({
      ...state,
      folderPath: (e.target as HTMLInputElement).value,
      error: null
    }),

    handleKeyUp: (state: State, e: KeyboardEvent) => {
      if (e.key === 'Enter' && !state.loading) {
        this.run('analyzeRepo');
      }
    },

    render: (_, state: State) => state,

    copyFeatures: async (state: State) => {
      const text = state.features.items.join('');
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
      return state;
    },

    copySummary: async (state: State) => {
      const text = state.features.summary.join('\n');
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
      return state;
    },

    getFeatures: async (state: State): Promise<State> => {
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
          (state) => this.run('render', state)
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
    },

    analyzeRepo: async (state: State): Promise<State> => {
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
          (state) => this.run('render', state)
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
    }
  }
}
