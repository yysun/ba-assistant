/**
 * Prompt Management Page
 * =====================
 * Handles CRUD operations for AI prompts with an inline modal editor.
 * 
 * Features:
 * - Grid-based prompt listing 
 * - Inline modal for create/edit
 * - Direct state mutation pattern for form inputs
 * - Dark mode compatible UI
 * 
 * Technical:
 * - AppRun component with async state initialization
 * - Uses promptService for data persistence
 * - Local event handling for all CRUD operations
 */

import { app, Component } from 'apprun';
import { Prompt, promptService } from '../_data/prompts';

type State = {
  prompts: Prompt[];
  editing?: Prompt;
}

export default class Prompts extends Component<State> {
  state = async () => {
    const prompts = await promptService.loadPrompts();
    return { prompts, editing: undefined };
  }

  update = {
    'new-prompt': async (state: State) => ({
      ...state,
      editing: { id: '', name: '', text: '' }
    }),

    'save-prompt': async (state: State, prompt: Prompt) => {
      if (!prompt.id) {
        await promptService.createPrompt(prompt.name, prompt.text);
      } else {
        await promptService.updatePrompt(prompt);
      }
      const prompts = await promptService.loadPrompts();
      return { prompts, editing: undefined };
    },

    'edit-prompt': async (state: State, prompt: Prompt) => ({
      ...state,
      editing: { ...prompt }
    }),

    'delete-prompt': async (state: State, id: string) => {
      await promptService.deletePrompt(id);
      const prompts = await promptService.loadPrompts();
      return { prompts };
    },

    'cancel-edit': (state: State) => ({
      ...state,
      editing: undefined
    })
  }

  view = (state: State) => {
    return <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1>Prompts</h1>
        <button
          $onclick="new-prompt"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          New Prompt
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.prompts.map(prompt => <div key={prompt.id}
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900 dark:text-white">{prompt.name}</h4>
            <div class="flex gap-2">
              <button
                $onclick={['edit-prompt', prompt]}
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Edit
              </button>
              <button
                $onclick={['delete-prompt', prompt.id]}
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-red-700 dark:text-red-200 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-xs whitespace-pre-wrap">{prompt.text}</p>
        </div>)}
      </div>

      {state.editing && <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 z-40">
        <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700 mx-4">
            <h3 class="text-xs font-medium text-gray-900 dark:text-white mb-4">
              {state.editing.id ? 'Edit Prompt' : 'New Prompt'}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Prompt Name
                </label>
                <input
                  type="text"
                  placeholder="Enter prompt name"
                  value={state.editing.name}
                  onchange={(e) => state.editing.name = e.target.value}
                  class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Prompt Text
                </label>
                <textarea
                  placeholder="Enter prompt text"
                  value={state.editing.text}
                  onchange={e => state.editing.text = e.target.value}
                  class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium h-96 resize-none"
                />
              </div>
              <div class="flex gap-2 justify-end mt-4">
                <button
                  $onclick={['save-prompt', state.editing]}
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  $onclick="cancel-edit"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>}

    </div>
  }
}