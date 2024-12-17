import { app, Component } from 'apprun';

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
}

interface SSEEvent {
  event: string;
  data: any;
}

const createErrorState = (state: State, error: string): State => {
  return {
    ...state,
    loading: false,
    error
  };
}

const processEvents = (currentState: State, eventText: string): State => {
  console.log('Processing event text:', eventText);

  let event: SSEEvent;
  try {
    event = JSON.parse(eventText);
    console.log('Parsed event:', event);
  } catch (error) {
    console.error('Failed to parse event:', error);
    return createErrorState(currentState, 'Invalid event data received');
  }

  if (!event.event) {
    return createErrorState(currentState, 'Invalid event format - missing event');
  }

  switch (event.event) {
    case 'commits':
      if (!Array.isArray(event.data?.commits)) {
        console.error('Invalid commits data:', event.data);
        return createErrorState(currentState, 'Invalid commits data received');
      }
      console.log('Updating commits:', event.data.commits.length);
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          commits: event.data.commits
        }
      };
    case 'tags':
      if (!Array.isArray(event.data?.tags)) {
        console.error('Invalid tags data:', event.data);
        return createErrorState(currentState, 'Invalid tags data received');
      }
      console.log('Updating tags:', event.data.tags.length);
      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          tags: event.data.tags
        }
      };
    case 'success':
      console.log('Success event received');
      return {
        ...currentState,
        loading: false
      };
    case 'error':
      console.error('Error event received:', event.data?.message);
      return createErrorState(currentState, event.data?.message || 'Unknown error occurred');
    default:
      return currentState;
  }
}

export default class extends Component<State> {
  state = {
    folderPath: '',
    loading: false,
    error: null,
    stats: {
      commits: [],
      tags: []
    }
  }

  view = (state: State) => {
    return <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
      <h1>Settings</h1>
      <div>
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
        </div>

        {state.loading &&
          <div class="mt-4">
            <div class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">
                Analyzing repository...
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
          <div class="mt-4 space-y-4">
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
      </div>
    </div>
  }

  update = {
    updatePath: (state: State, e: Event): State => {
      const input = e.target as HTMLInputElement;
      return {
        ...state,
        folderPath: input.value,
        error: null // Clear any previous errors when path changes
      };
    },

    handleKeyUp: (state: State, e: KeyboardEvent) => {
      if (e.key === 'Enter' && !state.loading) {
        this.run('analyzeRepo');
      }
    },

    analyzeRepo: async (state: State): Promise<State> => {
      if (state.loading) {
        return state; // Prevent multiple simultaneous requests
      }

      console.log('Starting repository analysis...');

      if (!state.folderPath) {
        console.log('No repository path provided');
        return createErrorState(state, 'Please enter a repository path');
      }

      if (!state.folderPath.trim()) {
        console.log('Empty repository path provided');
        return createErrorState(state, 'Repository path cannot be empty');
      }

      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
      let currentState = {
        ...state,
        loading: true,
        error: null,
        stats: { commits: [], tags: [] } // Reset stats for new analysis
      };

      try {
        console.log('Fetching repository stats...');
        const response = await fetch(`/api/repo/stats?path=${encodeURIComponent(state.folderPath)}`);

        if (!response.ok) {
          console.error('Server response not OK:', response.status, response.statusText);
          let errorMessage = 'Failed to analyze repository';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          return createErrorState(state, errorMessage);
        }

        if (!response.body) {
          console.error('No response body received');
          return createErrorState(state, 'Server response has no content');
        }

        console.log('Starting stream reading...');
        reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            console.log('Stream reading complete');
            if (buffer.trim()) {
              console.log('Processing remaining buffer:', buffer);
              currentState = processEvents(currentState, buffer);
            }
            return {
              ...currentState,
              loading: false
            };
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log('Received chunk:', chunk);

          buffer += chunk;
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          console.log('Processing events:', events.length);
          for (const event of events) {
            const dataLine = event.split('\n').find(line => line.startsWith('data: '));
            if (dataLine) {
              const eventData = dataLine.replace('data: ', '');
              if (eventData.trim()) {
                currentState = processEvents(currentState, eventData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : 'An unexpected error occurred';
        return createErrorState(state, `Failed to analyze repository: ${errorMessage}`);
      } finally {
        console.log('Cleaning up...');
        if (reader) {
          try {
            await reader.cancel();
            console.log('Reader cancelled successfully');
          } catch (error) {
            console.error('Error cancelling reader:', error);
          }
        }
        console.log('Analysis complete');
      }
    }
  }
}
