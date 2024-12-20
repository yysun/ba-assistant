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
import update from './update';
import { State } from './types';
import Card from './card';

// Constants
const DEFAULT_PATH = '/Users/esun/Documents/Projects/code-doc-mcp/';

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

  update = update

  view = (state: State) => {
    return <div class="h-screen flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
      <h1>Project Settings</h1>
      <div class="flex-1 flex flex-col min-h-0">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
          Repository Location
        </label>
        <div class="flex gap-2 items-center">
          <input
            type="text"
            value={state.folderPath}
            placeholder="Enter repository path..."
            $oninput={["updatePath", this]}
            $onkeyup={["handleKeyUp", this]}
            class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
          />
          <button
            $onclick={["getFeatures", this]}
            disabled={state.loading}
            class={`px-4 py-2 text-xs text-white rounded-lg transition-colors ${state.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} whitespace-nowrap flex items-center gap-2`}
          >
            {state.loading ? (
              <>
                <div class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                <span>Get Features...</span>
              </>
            ) : (
              'Get Features'
            )}
          </button>
        </div>

        {state.error &&
          <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
            {state.error}
          </div>
        }

        {state.features.items.length > 0 &&
          <div class="flex-1 flex min-h-0">
            <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50 rounded-md min-h-0">
              <div class="flex-1 grid grid-cols-2 gap-4">
                <Card
                  title="Details"
                  content={state.features.items.join('')}
                  copyTitle="Copy features to clipboard"
                />
                <Card
                  title="Summary"
                  content={state.features.summary.join('')}
                  copyTitle="Copy summary to clipboard"
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  }
}
