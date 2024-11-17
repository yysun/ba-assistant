import { app, Component } from 'apprun';

const TABS = ['User Story Map', 'Customer Journey Map', 'Pages and Navs', 'Page and Stories', 'Sprint Plan', '+'];

export default class Header extends Component {
  state = {
    darkMode: false,
    activeTabIndex: 0  // Changed from activeTab
  };

  view = ({ darkMode, activeTabIndex }) => {
    return (
      <header class="bg-white dark:bg-gray-800 shadow-sm text-xs">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 flex items-center gap-4">
            {TABS.map((tab, index) => (
              <a href={`#${tab}`} $onclick={['setTab', index]}
                class={`px-4 py-2 rounded-lg transition-colors ${activeTabIndex === index
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                {tab}
              </a>
            ))}
          </div>

          <div class="flex items-center space-x-4">
            <button
              $onclick="toggle-dark-mode"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {darkMode ? (
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
    );
  };

  update = {
    'toggle-dark-mode': state => {
      document.documentElement.classList.remove('dark');
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      }
    },
    'setTab': (state, index: number) => {
      app.run('#', TABS[index]);
      return {
        ...state,
        activeTabIndex: index
      };
    },
  };
}