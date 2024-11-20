import {
  Component,
  app_default,
  apprun_default
} from "./dist/chunk-WTDSMSRU.js";

// pages/layout.tsx
var menuItems = [
  {
    path: "/",
    label: "Home",
    icon: /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" })
  },
  {
    path: "/prompts",
    label: "Prompts",
    icon: /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" })
  },
  {
    path: "/settings",
    label: "Settings",
    icon: /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
  }
];
var getSystemDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
var Layout = class extends Component {
  state = {
    sidebarOpen: false,
    darkMode: getSystemDarkMode()
  };
  update = {
    "//": (state) => ({ ...state, children: [] }),
    "toggle-sidebar": (state) => {
      const main = document.getElementById("main-app");
      const children = Array.from(main?.children || []);
      return { ...state, sidebarOpen: !state.sidebarOpen, children };
    },
    "toggle-dark-mode": (state) => {
      const main = document.getElementById("main-app");
      const children = Array.from(main?.children || []);
      return { ...state, darkMode: !state.darkMode, children };
    }
  };
  view = (state) => {
    const pathname = window.location.pathname;
    const isActive = (path) => {
      return path === "/" ? pathname === path : pathname.startsWith(path);
    };
    return /* @__PURE__ */ app_default.h("div", { class: `${state.darkMode ? "dark" : ""} min-h-screen font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif] dark:bg-gray-900 bg-gray-50 transition-colors duration-200` }, /* @__PURE__ */ app_default.h("div", { id: "sidebar", class: `fixed inset-y-0 left-0 ${state.sidebarOpen ? "w-64" : "w-14"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out z-10 flex flex-col` }, /* @__PURE__ */ app_default.h("div", { class: "flex items-center p-4 border-b border-gray-200 dark:border-gray-700 h-14 relative overflow-hidden" }, /* @__PURE__ */ app_default.h("div", { class: `absolute inset-0 p-4 flex items-center transition-all duration-200 ${state.sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}` }, /* @__PURE__ */ app_default.h("span", { class: "text-gray-900 dark:text-white whitespace-nowrap" }, "BA Assistant")), /* @__PURE__ */ app_default.h("div", { class: `absolute inset-0 p-4 flex items-center transition-all duration-200 ${state.sidebarOpen ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}` }, /* @__PURE__ */ app_default.h("span", { class: "text-gray-900 dark:text-white" }, "BA"))), /* @__PURE__ */ app_default.h("nav", { class: "flex-1 py-4" }, menuItems.map((item) => /* @__PURE__ */ app_default.h(
      "a",
      {
        href: item.path,
        class: `relative flex items-center mx-2 p-2 text-xs rounded-lg ${isActive(item.path) ? "text-white dark:text-blue-400 bg-black dark:bg-blue-900/50" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`
      },
      /* @__PURE__ */ app_default.h("div", { class: "w-6 h-6 flex items-center justify-center" }, /* @__PURE__ */ app_default.h("svg", { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, item.icon)),
      /* @__PURE__ */ app_default.h("span", { class: `menu-label ml-3 ${state.sidebarOpen ? "" : "hidden"}` }, item.label)
    ))), /* @__PURE__ */ app_default.h("div", { class: "py-2" }, /* @__PURE__ */ app_default.h(
      "a",
      {
        $onclick: "toggle-dark-mode",
        class: "relative flex items-center mx-2 p-2 text-xs rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      },
      /* @__PURE__ */ app_default.h("div", { class: "w-6 h-6 flex items-center justify-center" }, /* @__PURE__ */ app_default.h("svg", { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, state.darkMode ? /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) : /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }))),
      /* @__PURE__ */ app_default.h("span", { class: `menu-label ml-3 ${state.sidebarOpen ? "" : "hidden"}` }, "Toggle Theme")
    )), /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "toggle-sidebar",
        class: "flex items-center text-left text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-700"
      },
      /* @__PURE__ */ app_default.h("svg", { class: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, state.sidebarOpen ? /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M15 19l-7-7 7-7" }) : /* @__PURE__ */ app_default.h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 5l7 7-7 7" }))
    )), /* @__PURE__ */ app_default.h("div", { id: "main-content", class: `${state.sidebarOpen ? "ml-64" : "ml-14"} flex-1 h-screen overflow-y-auto transition-all duration-200 bg-gray-50 dark:bg-gray-900` }, /* @__PURE__ */ app_default.h("main", { id: "main-app" }, state.children)));
  };
};

// pages/main.tsx
document.addEventListener("click", (e) => {
  apprun_default.run("@document-click", e);
});
apprun_default.on("@document-click", (e) => {
});
var main_default = () => {
  apprun_default.render(document.getElementById("root"), /* @__PURE__ */ apprun_default.h(Layout, null));
};

// pages/_main.tsx
var main_default2 = main_default;
main_default();
var base_dir = "/ba-assistant";
var get_element = (path) => {
  const paths = path.split("/").filter((p) => !!p);
  paths.pop();
  let element_id = !paths.length ? "main" : paths.join("-");
  element_id += "-app";
  const el = document.getElementById(element_id);
  console.assert(!!el, `${element_id} not found, component will display`);
  return element_id;
};
var handlerPromises = /* @__PURE__ */ new Map();
var resolvePromise = (path) => {
  const deferred = handlerPromises.get(path);
  if (deferred) {
    deferred.resolve();
    handlerPromises.delete(path);
  }
};
var add_component = (path, base_dir2) => {
  const file = path === "/" ? "/index.js" : path + "/index.js";
  apprun_default.once(path, async () => {
    const timestamp = Date.now();
    const module = await import(`${base_dir2}${file}`);
    const exp = module.default;
    if (exp.prototype && exp.prototype.constructor.name === exp.name) {
      const component = new module.default();
      if (component.state instanceof Promise) {
        component.state = await component.state;
      }
      const rendered = component.rendered;
      component.rendered = (...p) => {
        rendered && rendered(...p);
        resolvePromise(path);
      };
      component.start(get_element(path), { route: path });
    } else {
      const start = async (...p) => {
        const vdom = await exp(...p);
        const element_id = get_element(path);
        const el = document.getElementById(element_id);
        apprun_default.render(el, vdom);
        resolvePromise(path);
      };
      await start();
      apprun_default.on(path, start);
    }
    resolvePromise(path);
  });
};
var components = ["/", "/prompts"];
var route = async (path) => {
  const normalizedPath = path.startsWith(base_dir) ? path.substring(base_dir.length) : path;
  if (normalizedPath === "/" || normalizedPath === "") {
    apprun_default.run("/");
    return;
  }
  const paths = normalizedPath.split("/").filter((p) => !!p);
  let routed = false;
  for (let i = 0; i < paths.length; i++) {
    const current = "/" + paths.slice(0, i + 1).join("/");
    const component = components.find((item) => item === current);
    if (component) {
      routed = component === normalizedPath;
      let resolveFn;
      const promise = new Promise((resolve) => {
        resolveFn = resolve;
      });
      handlerPromises.set(current, { resolve: resolveFn });
      apprun_default.run(current, ...paths.slice(i + 1));
      await promise;
    }
  }
  console.assert(!!routed, `${normalizedPath} can not be routed.`);
};
apprun_default.route = route;
window.onload = async () => {
  components.map((item) => add_component(item, "/ba-assistant"));
  apprun_default.route(location.pathname);
};
document.body.addEventListener("click", (e) => {
  const element = e.target;
  const menu = element.tagName === "A" ? element : element.closest("a");
  if (menu && menu.origin === location.origin) {
    e.preventDefault();
    history.pushState(null, "", menu.origin + base_dir + menu.pathname);
    apprun_default.run("//");
    apprun_default.route(menu.pathname);
  }
});
window.addEventListener("popstate", () => route(location.pathname));
export {
  main_default2 as default
};
//# sourceMappingURL=_main.js.map
