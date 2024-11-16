import { app, Component } from 'apprun';

export default class Layout extends Component {
  state = {
    sidebarOpen: true,
    darkMode: false
  };

  update = {
    '#toggle-sidebar': state => ({ ...state, sidebarOpen: !state.sidebarOpen }),
    '#toggle-dark-mode': state => {
      const newDarkMode = !state.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...state, darkMode: newDarkMode };
    }
  };

  view = (state) => {
    return (
      <div class={`min-h-screen ${state.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        {/* Toggle Button */}
        <button 
          $onclick="#toggle-sidebar"
          class="fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h12M3 17h6"/>
          </svg>
        </button>

        {/* Sidebar */}
        <div class={`fixed inset-y-0 left-0 ${state.sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out z-10`}>
          <div class="flex flex-col h-full">
            {/* App Logo */}
            <div class={`flex items-center ${state.sidebarOpen ? 'justify-center' : 'justify-center'} p-6`}>
              <div class={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${state.sidebarOpen ? '' : 'hidden'}`}>My App</div>
              <div class={`text-xl font-bold text-blue-600 dark:text-blue-400 ${state.sidebarOpen ? 'hidden' : ''}`}>M</div>
            </div>
            
            {/* Navigation Links */}
            <nav class="flex-1 px-2 py-4 space-y-1">
              <a href="/" class="nav-link active flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10l8-6 8 6v10a2 2 0 01-2 2h-4v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4H6a2 2 0 01-2-2V10z"/>
                </svg>
                <span class={`ml-3 ${state.sidebarOpen ? '' : 'hidden'}`}>Home</span>
              </a>
              <a href="/contact" class="nav-link flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-width="2" d="M8 2v4M16 2v4M3 10h18"/>
                </svg>
                <span class={`ml-3 ${state.sidebarOpen ? '' : 'hidden'}`}>Contact</span>
              </a>
              <a href="/about" class="nav-link flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V8.342a2 2 0 00-.602-1.43l-4.44-4.342A2 2 0 0013.56 2H6a2 2 0 00-2 2z"/>
                </svg>
                <span class={`ml-3 ${state.sidebarOpen ? '' : 'hidden'}`}>About</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div class={`${state.sidebarOpen ? 'ml-64' : 'ml-16'} flex-1 min-h-screen transition-all duration-200 bg-gray-50 dark:bg-gray-900`}>
          {/* Header */}
          <header class="bg-white dark:bg-gray-800 shadow-sm">
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex-1 flex items-center gap-4">
                {/* Search */}
                <div class="max-w-lg w-full">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="Search"/>
                  </div>
                </div>

                {/* Filter Button */}
                <button class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  FILTER
                </button>
              </div>

              {/* Right side controls */}
              <div class="flex items-center space-x-4">
                {/* Dark mode toggle */}
                <button 
                  $onclick="#toggle-dark-mode"
                  class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {state.darkMode ? (
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  ) : (
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                  )}
                </button>

                {/* User info */}
                {/* <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Hi, Tom</span>
                </div> */}
              </div>
            </div>
          </header>

          <main class="p-6 text-gray-900 dark:text-gray-100" id="main-app">
          </main>
        </div>
      </div>
    );
  };
}
