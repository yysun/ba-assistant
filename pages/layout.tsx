import { app, Component } from 'apprun';
import Header from './header';

const menuItems = [
  {
    path: '/',
    label: 'Home',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  },
  {
    path: '/about',
    label: 'Statistics',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  },
  // { 
  //   path: '/contact', 
  //   label: 'Products',
  //   icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
  // },
  // { 
  //   path: '/users', 
  //   label: 'Users',
  //   icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  // },
  {
    path: '/settings',
    label: 'Settings',
    icon: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  }
];


export default class Layout extends Component {
  state = {
    sidebarOpen: false,  
  };

  update = {
    '//': state => ({ ...state, children: [] }),
    '#toggle-sidebar': state => {
      const main = document.getElementById('main-app') as HTMLElement;
      const children = Array.from(main?.children || []);
      return { ...state, sidebarOpen: !state.sidebarOpen, children };
    },
  };

  view = (state) => {
    const pathname = window.location.pathname;
    const isActive = (path) => {
      return (path === '/') ? pathname === path : pathname.startsWith(path);
    };
    return (
      <div class="min-h-screen font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif] dark:bg-gray-900 bg-gray-50 transition-colors duration-200">
        {/* Sidebar */}
        <div id="sidebar" class={`fixed inset-y-0 left-0 ${state.sidebarOpen ? 'w-64' : 'w-14'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out z-10 flex flex-col`}>
          {/* App Logo */}
          <div class="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div class={`text-xs font-medium text-gray-900 dark:text-white ${state.sidebarOpen ? '' : 'hidden'}`}>X1</div>
            <div class={`text-xs font-medium text-gray-900 dark:text-white ${state.sidebarOpen ? 'hidden' : ''}`}>X1</div>
          </div>

          {/* Navigation Links */}
          <nav class="flex-1 py-4">
            {menuItems.map(item => (
              <a
                href={item.path}
                class={`relative flex items-center mx-2 p-2 text-xs rounded-lg ${isActive(item.path)
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

          {/* Toggle Button */}
          <button
            $onclick="#toggle-sidebar"
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
        <div id="main-content" class={`${state.sidebarOpen ? 'ml-64' : 'ml-16'} flex-1 min-h-screen transition-all duration-200 bg-gray-50 dark:bg-gray-900`}>
          <Header />
          <main class="p-6 text-gray-600 dark:text-gray-300 text-xs" id="main-app">
            {state.children}
          </main>
        </div>
      </div>
    );
  };
}
