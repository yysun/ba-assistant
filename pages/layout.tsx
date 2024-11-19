/**
 * App Layout Component
 * -------------------
 * Main application shell providing:
 * - Collapsible sidebar navigation
 * - Dark/light theme toggle
 * - Responsive layout structure
 * 
 * Core Features:
 * - Dynamic navigation menu
 * - System-aware dark mode
 * - Content area with dynamic width
 * 
 * Dependencies: 
 * - AppRun for component lifecycle
 * - Tailwind CSS for styling
 */

import { app, Component } from 'apprun';

const menuItems = [
  {
    path: '/',
    label: 'Home',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  },
  {
    path: '/prompts',
    label: 'Prompts',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  }
];

const getSystemDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;


export default class Layout extends Component {
  state = {
    sidebarOpen: false,
    darkMode: getSystemDarkMode(),
  };

  update = {
    '//': state => ({ ...state, children: [] }),
    'toggle-sidebar': state => {
      const main = document.getElementById('main-app') as HTMLElement;
      const children = Array.from(main?.children || []);
      return { ...state, sidebarOpen: !state.sidebarOpen, children };
    },

    'toggle-dark-mode': state => {
      const main = document.getElementById('main-app') as HTMLElement;
      const children = Array.from(main?.children || []);
      return { ...state, darkMode: !state.darkMode, children };
    },
  };

  view = (state) => {
    const pathname = window.location.pathname;
    const isActive = (path) => {
      return (path === '/') ? pathname === path : pathname.startsWith(path);
    };
    return (
      <div class={`${state.darkMode ? 'dark': '' } min-h-screen font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif] dark:bg-gray-900 bg-gray-50 transition-colors duration-200`}>
        {/* Sidebar */}
        <div id="sidebar" class={`fixed inset-y-0 left-0 ${state.sidebarOpen ? 'w-64' : 'w-14'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out z-10 flex flex-col`}>
          {/* App Logo */}
          <div class="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 h-14 relative overflow-hidden">
            <div class={`absolute inset-0 p-4 flex items-center transition-all duration-200 ${state.sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span class="text-gray-900 dark:text-white whitespace-nowrap">BA Assistant</span>
            </div>
            <div class={`absolute inset-0 p-4 flex items-center transition-all duration-200 ${state.sidebarOpen ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <span class="text-gray-900 dark:text-white">BA</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav class="flex-1 py-4">
            {menuItems.map(item => (
              <a
                href={item.path}
                class={`relative flex items-center mx-2 p-2 text-xs rounded-lg ${
                  isActive(item.path)
                    ? 'text-white dark:text-blue-400 bg-black dark:bg-blue-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div class="w-6 h-6 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <span class={`menu-label ml-3 ${state.sidebarOpen ? '' : 'hidden'}`}>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Dark Mode Toggle */}
          <div class="py-2">
            <a
              $onclick="toggle-dark-mode"
              class="relative flex items-center mx-2 p-2 text-xs rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div class="w-6 h-6 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {state.darkMode ? (
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </div>
              <span class={`menu-label ml-3 ${state.sidebarOpen ? '' : 'hidden'}`}>Toggle Theme</span>
            </a>
          </div>

          {/* Toggle Button */}
          <button
            $onclick="toggle-sidebar"
            class="flex items-center text-left text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {state.sidebarOpen ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div id="main-content" class={`${state.sidebarOpen ? 'ml-64' : 'ml-14'} flex-1 h-screen overflow-y-auto transition-all duration-200 bg-gray-50 dark:bg-gray-900`}>
          <main id="main-app">
            {state.children}
          </main>
        </div>
      </div>
    );
  };
}
