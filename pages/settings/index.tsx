import { app, Component } from 'apprun';

interface Stats {
  commits: any[];
  tags: any[];
  loading: boolean;
  progress: {
    commits: number;
  };
  error: string | null;
}

interface State {
  folderPath: string;
  fileHandle: any;
  stats: Stats;
}

export default class extends Component<State> {
  state = {
    folderPath: '',
    fileHandle: null,
    stats: {
      commits: [],
      tags: [],
      loading: false,
      progress: {
        commits: 0
      },
      error: null
    }
  }

  view = (state: State) => <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
    <h1>Settings</h1>
    <div>
      <label class="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
        Repository Location
      </label>
      <div class="flex gap-2 items-center">
        <input
          type="text"
          readonly
          value={state.folderPath}
          placeholder="Select a repository folder..."
          class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
        />
        <button
          $onclick="openFolder"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
        >
          Open Repo
        </button>
      </div>

      {state.stats.loading &&
        <div class="mt-4">
          <div class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              Analyzing repository... {state.stats.progress.commits} commits processed
            </span>
          </div>
        </div>
      }

      {state.stats.error &&
        <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
          {state.stats.error}
        </div>
      }

      {!state.stats.loading && state.stats.commits.length > 0 &&
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
            </dl>
          </div>
        </div>
      }
    </div>
  </div>

  update = {
    openFolder: async (state: State): Promise<State> => {
      try {
        const dirHandle = await window.showDirectoryPicker();

        // Get the path from the directory handle
        const pathString = dirHandle.name;

        // Start loading stats
        const newState = {
          ...state,
          folderPath: pathString,
          fileHandle: dirHandle,
          stats: {
            ...state.stats,
            loading: true,
            error: null,
            commits: [],
            tags: [],
            progress: {
              commits: 0
            }
          }
        };

        // Start EventSource connection
        const eventSource = new EventSource(`/api/repo/stats?path=${encodeURIComponent(pathString)}`);

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'commit-progress':
              app.run('updateProgress', data.data);
              break;
            case 'commits':
              app.run('updateCommits', data.data.commits);
              break;
            case 'tags':
              app.run('updateTags', data.data.tags);
              eventSource.close(); // Close connection after receiving tags
              break;
            case 'error':
              app.run('updateError', data.data.message);
              eventSource.close();
              break;
          }
        };

        eventSource.onerror = () => {
          app.run('updateError', 'Failed to connect to stats API');
          eventSource.close();
        };

        return newState;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to open folder:', err);
          return {
            ...state,
            stats: {
              ...state.stats,
              error: err.message,
              loading: false
            }
          };
        }
        return state;
      }
    },

    updateProgress: (state: State, progress: { current: number }): State => ({
      ...state,
      stats: {
        ...state.stats,
        progress: {
          commits: progress.current
        }
      }
    }),

    updateCommits: (state: State, commits: any[]): State => ({
      ...state,
      stats: {
        ...state.stats,
        commits
      }
    }),

    updateTags: (state: State, tags: any[]): State => ({
      ...state,
      stats: {
        ...state.stats,
        tags,
        loading: false
      }
    }),

    updateError: (state: State, error: string): State => ({
      ...state,
      stats: {
        ...state.stats,
        error,
        loading: false
      }
    })
  }
}
