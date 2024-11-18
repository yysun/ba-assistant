// node_modules/apprun/esm/app.js
var App = class {
  constructor() {
    this._events = {};
  }
  on(name, fn, options = {}) {
    this._events[name] = this._events[name] || [];
    this._events[name].push({ fn, options });
  }
  off(name, fn) {
    const subscribers = this._events[name] || [];
    this._events[name] = subscribers.filter((sub) => sub.fn !== fn);
  }
  find(name) {
    return this._events[name];
  }
  run(name, ...args) {
    const subscribers = this.getSubscribers(name, this._events);
    console.assert(subscribers && subscribers.length > 0, "No subscriber for event: " + name);
    subscribers.forEach((sub) => {
      const { fn, options } = sub;
      if (options.delay) {
        this.delay(name, fn, args, options);
      } else {
        Object.keys(options).length > 0 ? fn.apply(this, [...args, options]) : fn.apply(this, args);
      }
      return !sub.options.once;
    });
    return subscribers.length;
  }
  once(name, fn, options = {}) {
    this.on(name, fn, Object.assign(Object.assign({}, options), { once: true }));
  }
  delay(name, fn, args, options) {
    if (options._t)
      clearTimeout(options._t);
    options._t = setTimeout(() => {
      clearTimeout(options._t);
      Object.keys(options).length > 0 ? fn.apply(this, [...args, options]) : fn.apply(this, args);
    }, options.delay);
  }
  runAsync(name, ...args) {
    const subscribers = this.getSubscribers(name, this._events);
    console.assert(subscribers && subscribers.length > 0, "No subscriber for event: " + name);
    const promises = subscribers.map((sub) => {
      const { fn, options } = sub;
      return Object.keys(options).length > 0 ? fn.apply(this, [...args, options]) : fn.apply(this, args);
    });
    return Promise.all(promises);
  }
  query(name, ...args) {
    return this.runAsync(name, ...args);
  }
  getSubscribers(name, events) {
    const subscribers = events[name] || [];
    events[name] = subscribers.filter((sub) => {
      return !sub.options.once;
    });
    Object.keys(events).filter((evt) => evt.endsWith("*") && name.startsWith(evt.replace("*", ""))).sort((a, b) => b.length - a.length).forEach((evt) => subscribers.push(...events[evt].map((sub) => Object.assign(Object.assign({}, sub), { options: Object.assign(Object.assign({}, sub.options), { event: name }) }))));
    return subscribers;
  }
};
var AppRunVersions = "AppRun-3";
var app;
var root = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global;
if (root["app"] && root["_AppRunVersions"]) {
  app = root["app"];
} else {
  app = new App();
  root["app"] = app;
  root["_AppRunVersions"] = AppRunVersions;
}
var app_default = app;

// node_modules/apprun/esm/web-component.js
var customElement = (componentClass, options = {}) => class CustomElement extends HTMLElement {
  constructor() {
    super();
  }
  get component() {
    return this._component;
  }
  get state() {
    return this._component.state;
  }
  static get observedAttributes() {
    return (options.observedAttributes || []).map((attr) => attr.toLowerCase());
  }
  connectedCallback() {
    if (this.isConnected && !this._component) {
      const opts = options || {};
      this._shadowRoot = opts.shadow ? this.attachShadow({ mode: "open" }) : this;
      const observedAttributes = opts.observedAttributes || [];
      const attrMap = observedAttributes.reduce((map, name) => {
        const lc = name.toLowerCase();
        if (lc !== name) {
          map[lc] = name;
        }
        return map;
      }, {});
      this._attrMap = (name) => attrMap[name] || name;
      const props = {};
      Array.from(this.attributes).forEach((item) => props[this._attrMap(item.name)] = item.value);
      observedAttributes.forEach((name) => {
        if (this[name] !== void 0)
          props[name] = this[name];
        Object.defineProperty(this, name, {
          get() {
            return props[name];
          },
          set(value) {
            this.attributeChangedCallback(name, props[name], value);
          },
          configurable: true,
          enumerable: true
        });
      });
      requestAnimationFrame(() => {
        const children = this.children ? Array.from(this.children) : [];
        this._component = new componentClass(Object.assign(Object.assign({}, props), { children })).mount(this._shadowRoot, opts);
        this._component._props = props;
        this._component.dispatchEvent = this.dispatchEvent.bind(this);
        if (this._component.mounted) {
          const new_state = this._component.mounted(props, children, this._component.state);
          if (typeof new_state !== "undefined")
            this._component.state = new_state;
        }
        this.on = this._component.on.bind(this._component);
        this.run = this._component.run.bind(this._component);
        if (!(opts.render === false))
          this._component.run(".");
      });
    }
  }
  disconnectedCallback() {
    var _a, _b, _c, _d;
    (_b = (_a = this._component) === null || _a === void 0 ? void 0 : _a.unload) === null || _b === void 0 ? void 0 : _b.call(_a);
    (_d = (_c = this._component) === null || _c === void 0 ? void 0 : _c.unmount) === null || _d === void 0 ? void 0 : _d.call(_c);
    this._component = null;
  }
  attributeChangedCallback(name, oldValue, value) {
    if (this._component) {
      const mappedName = this._attrMap(name);
      this._component._props[mappedName] = value;
      this._component.run("attributeChanged", mappedName, oldValue, value);
      if (value !== oldValue && !(options.render === false)) {
        window.requestAnimationFrame(() => {
          this._component.run(".");
        });
      }
    }
  }
};
var web_component_default = (name, componentClass, options) => {
  typeof customElements !== "undefined" && customElements.define(name, customElement(componentClass, options));
};

// node_modules/apprun/esm/decorator.js
var Reflect = {
  meta: /* @__PURE__ */ new WeakMap(),
  defineMetadata(metadataKey, metadataValue, target) {
    if (!this.meta.has(target))
      this.meta.set(target, {});
    this.meta.get(target)[metadataKey] = metadataValue;
  },
  getMetadataKeys(target) {
    target = Object.getPrototypeOf(target);
    return this.meta.get(target) ? Object.keys(this.meta.get(target)) : [];
  },
  getMetadata(metadataKey, target) {
    target = Object.getPrototypeOf(target);
    return this.meta.get(target) ? this.meta.get(target)[metadataKey] : null;
  }
};
function on(events, options = {}) {
  return function(target, key) {
    const name = events ? events.toString() : key;
    Reflect.defineMetadata(`apprun-update:${name}`, { name, key, options }, target);
  };
}
function customElement2(name, options) {
  return function _customElement(constructor) {
    web_component_default(name, constructor, options);
    return constructor;
  };
}

// node_modules/apprun/esm/directive.js
var getStateValue = (component, name) => {
  return (name ? component["state"][name] : component["state"]) || "";
};
var setStateValue = (component, name, value) => {
  if (name) {
    const state = component["state"] || {};
    state[name] = value;
    component.setState(state);
  } else {
    component.setState(value);
  }
};
var apply_directive = (key, props, tag, component) => {
  if (key.startsWith("$on")) {
    const event = props[key];
    key = key.substring(1);
    if (typeof event === "boolean") {
      props[key] = (e) => component.run ? component.run(key, e) : app_default.run(key, e);
    } else if (typeof event === "string") {
      props[key] = (e) => component.run ? component.run(event, e) : app_default.run(event, e);
    } else if (typeof event === "function") {
      props[key] = (e) => component.setState(event(component.state, e));
    } else if (Array.isArray(event)) {
      const [handler, ...p] = event;
      if (typeof handler === "string") {
        props[key] = (e) => component.run ? component.run(handler, ...p, e) : app_default.run(handler, ...p, e);
      } else if (typeof handler === "function") {
        props[key] = (e) => component.setState(handler(component.state, ...p, e));
      }
    }
  } else if (key === "$bind") {
    const type = props["type"] || "text";
    const name = typeof props[key] === "string" ? props[key] : props["name"];
    if (tag === "input") {
      switch (type) {
        case "checkbox":
          props["checked"] = getStateValue(component, name);
          props["onclick"] = (e) => setStateValue(component, name || e.target.name, e.target.checked);
          break;
        case "radio":
          props["checked"] = getStateValue(component, name) === props["value"];
          props["onclick"] = (e) => setStateValue(component, name || e.target.name, e.target.value);
          break;
        case "number":
        case "range":
          props["value"] = getStateValue(component, name);
          props["oninput"] = (e) => setStateValue(component, name || e.target.name, Number(e.target.value));
          break;
        default:
          props["value"] = getStateValue(component, name);
          props["oninput"] = (e) => setStateValue(component, name || e.target.name, e.target.value);
      }
    } else if (tag === "select") {
      props["value"] = getStateValue(component, name);
      props["onchange"] = (e) => {
        if (!e.target.multiple) {
          setStateValue(component, name || e.target.name, e.target.value);
        }
      };
    } else if (tag === "option") {
      props["selected"] = getStateValue(component, name);
      props["onclick"] = (e) => setStateValue(component, name || e.target.name, e.target.selected);
    } else if (tag === "textarea") {
      props["innerHTML"] = getStateValue(component, name);
      props["oninput"] = (e) => setStateValue(component, name || e.target.name, e.target.value);
    }
  } else {
    app_default.run("$", { key, tag, props, component });
  }
};
var directive = (vdom, component) => {
  if (Array.isArray(vdom)) {
    return vdom.map((element) => directive(element, component));
  } else {
    let { type, tag, props, children } = vdom;
    tag = tag || type;
    children = children || (props === null || props === void 0 ? void 0 : props.children);
    if (props)
      Object.keys(props).forEach((key) => {
        if (key.startsWith("$")) {
          apply_directive(key, props, tag, component);
          delete props[key];
        }
      });
    if (children)
      directive(children, component);
    return vdom;
  }
};
var directive_default = directive;

// node_modules/apprun/esm/component.js
var componentCache = /* @__PURE__ */ new Map();
if (!app_default.find("get-components"))
  app_default.on("get-components", (o) => o.components = componentCache);
var REFRESH = (state) => state;
var Component = class {
  renderState(state, vdom = null) {
    if (!this.view)
      return;
    let html = vdom || this.view(state);
    app_default["debug"] && app_default.run("debug", {
      component: this,
      _: html ? "." : "-",
      state,
      vdom: html,
      el: this.element
    });
    if (typeof document !== "object")
      return;
    const el = typeof this.element === "string" && this.element ? document.getElementById(this.element) || document.querySelector(this.element) : this.element;
    if (!el)
      return;
    const tracking_attr = "_c";
    if (!this.unload) {
      el.removeAttribute && el.removeAttribute(tracking_attr);
    } else if (el["_component"] !== this || el.getAttribute(tracking_attr) !== this.tracking_id) {
      this.tracking_id = (/* @__PURE__ */ new Date()).valueOf().toString();
      el.setAttribute(tracking_attr, this.tracking_id);
      if (typeof MutationObserver !== "undefined") {
        if (!this.observer)
          this.observer = new MutationObserver((changes) => {
            if (changes[0].oldValue === this.tracking_id || !document.body.contains(el)) {
              this.unload(this.state);
              this.observer.disconnect();
              this.observer = null;
            }
          });
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true,
          attributeFilter: [tracking_attr]
        });
      }
    }
    el["_component"] = this;
    if (!vdom && html) {
      html = directive_default(html, this);
      if (this.options.transition && document && document["startViewTransition"]) {
        document["startViewTransition"](() => app_default.render(el, html, this));
      } else {
        app_default.render(el, html, this);
      }
    }
    this.rendered && this.rendered(this.state);
  }
  setState(state, options = { render: true, history: false }) {
    if (state instanceof Promise) {
      Promise.resolve(state).then((v) => {
        this.setState(v, options);
        this._state = state;
      });
    } else {
      this._state = state;
      if (state == null)
        return;
      this.state = state;
      if (options.render !== false) {
        if (options.transition && document && document["startViewTransition"]) {
          document["startViewTransition"](() => this.renderState(state));
        } else {
          this.renderState(state);
        }
      }
      if (options.history !== false && this.enable_history) {
        this._history = [...this._history, state];
        this._history_idx = this._history.length - 1;
      }
      if (typeof options.callback === "function")
        options.callback(this.state);
    }
  }
  constructor(state, view, update3, options) {
    this.state = state;
    this.view = view;
    this.update = update3;
    this.options = options;
    this._app = new App();
    this._actions = [];
    this._global_events = [];
    this._history = [];
    this._history_idx = -1;
    this._history_prev = () => {
      this._history_idx--;
      if (this._history_idx >= 0) {
        this.setState(this._history[this._history_idx], { render: true, history: false });
      } else {
        this._history_idx = 0;
      }
    };
    this._history_next = () => {
      this._history_idx++;
      if (this._history_idx < this._history.length) {
        this.setState(this._history[this._history_idx], { render: true, history: false });
      } else {
        this._history_idx = this._history.length - 1;
      }
    };
    this.start = (element = null, options2) => {
      this.mount(element, Object.assign({ render: true }, options2));
      if (this.mounted && typeof this.mounted === "function") {
        const new_state = this.mounted({}, [], this.state);
        typeof new_state !== "undefined" && this.setState(new_state);
      }
      return this;
    };
  }
  mount(element = null, options) {
    var _a, _b;
    console.assert(!this.element, "Component already mounted.");
    this.options = options = Object.assign(Object.assign({}, this.options), options);
    this.element = element;
    this.global_event = options.global_event;
    this.enable_history = !!options.history;
    if (this.enable_history) {
      this.on(options.history.prev || "history-prev", this._history_prev);
      this.on(options.history.next || "history-next", this._history_next);
    }
    if (options.route) {
      this.update = this.update || {};
      if (!this.update[options.route])
        this.update[options.route] = REFRESH;
    }
    this.add_actions();
    this.state = (_b = (_a = this.state) !== null && _a !== void 0 ? _a : this["model"]) !== null && _b !== void 0 ? _b : {};
    if (typeof this.state === "function")
      this.state = this.state();
    this.setState(this.state, { render: !!options.render, history: true });
    if (app_default["debug"]) {
      if (componentCache.get(element)) {
        componentCache.get(element).push(this);
      } else {
        componentCache.set(element, [this]);
      }
    }
    return this;
  }
  is_global_event(name) {
    return name && (this.global_event || this._global_events.indexOf(name) >= 0 || name.startsWith("#") || name.startsWith("/") || name.startsWith("@"));
  }
  add_action(name, action, options = {}) {
    if (!action || typeof action !== "function")
      return;
    if (options.global)
      this._global_events.push(name);
    this.on(name, (...p) => {
      app_default["debug"] && app_default.run("debug", {
        component: this,
        _: ">",
        event: name,
        p,
        current_state: this.state,
        options
      });
      const newState = action(this.state, ...p);
      app_default["debug"] && app_default.run("debug", {
        component: this,
        _: "<",
        event: name,
        p,
        newState,
        state: this.state,
        options
      });
      this.setState(newState, options);
    }, options);
  }
  add_actions() {
    const actions = this.update || {};
    Reflect.getMetadataKeys(this).forEach((key) => {
      if (key.startsWith("apprun-update:")) {
        const meta = Reflect.getMetadata(key, this);
        actions[meta.name] = [this[meta.key].bind(this), meta.options];
      }
    });
    const all = {};
    if (Array.isArray(actions)) {
      actions.forEach((act) => {
        const [name, action, opts] = act;
        const names = name.toString();
        names.split(",").forEach((n) => all[n.trim()] = [action, opts]);
      });
    } else {
      Object.keys(actions).forEach((name) => {
        const action = actions[name];
        if (typeof action === "function" || Array.isArray(action)) {
          name.split(",").forEach((n) => all[n.trim()] = action);
        }
      });
    }
    if (!all["."])
      all["."] = REFRESH;
    Object.keys(all).forEach((name) => {
      const action = all[name];
      if (typeof action === "function") {
        this.add_action(name, action);
      } else if (Array.isArray(action)) {
        this.add_action(name, action[0], action[1]);
      }
    });
  }
  run(event, ...args) {
    if (this.state instanceof Promise) {
      return Promise.resolve(this.state).then((state) => {
        this.state = state;
        this.run(event, ...args);
      });
    } else {
      const name = event.toString();
      return this.is_global_event(name) ? app_default.run(name, ...args) : this._app.run(name, ...args);
    }
  }
  on(event, fn, options) {
    const name = event.toString();
    this._actions.push({ name, fn });
    return this.is_global_event(name) ? app_default.on(name, fn, options) : this._app.on(name, fn, options);
  }
  runAsync(event, ...args) {
    const name = event.toString();
    return this.is_global_event(name) ? app_default.runAsync(name, ...args) : this._app.runAsync(name, ...args);
  }
  // obsolete
  query(event, ...args) {
    return this.runAsync(event, ...args);
  }
  unmount() {
    var _a;
    (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
    this._actions.forEach((action) => {
      const { name, fn } = action;
      this.is_global_event(name) ? app_default.off(name, fn) : this._app.off(name, fn);
    });
  }
};
Component.__isAppRunComponent = true;

// node_modules/apprun/esm/vdom-my.js
function Fragment(props, ...children) {
  return collect(children);
}
var ATTR_PROPS = "_props";
function collect(children) {
  const ch = [];
  const push = (c) => {
    if (c !== null && c !== void 0 && c !== "" && c !== false) {
      ch.push(typeof c === "function" || typeof c === "object" ? c : `${c}`);
    }
  };
  children && children.forEach((c) => {
    if (Array.isArray(c)) {
      c.forEach((i) => push(i));
    } else {
      push(c);
    }
  });
  return ch;
}
function createElement(tag, props, ...children) {
  const ch = collect(children);
  if (typeof tag === "string")
    return { tag, props, children: ch };
  else if (Array.isArray(tag))
    return tag;
  else if (tag === void 0 && children)
    return ch;
  else if (Object.getPrototypeOf(tag).__isAppRunComponent)
    return { tag, props, children: ch };
  else if (typeof tag === "function")
    return tag(props, ch);
  else
    throw new Error(`Unknown tag in vdom ${tag}`);
}
var keyCache = /* @__PURE__ */ new WeakMap();
var updateElement = (element, nodes, component = {}) => {
  if (nodes == null || nodes === false)
    return;
  const el = typeof element === "string" && element ? document.getElementById(element) || document.querySelector(element) : element;
  nodes = directive_default(nodes, component);
  render(el, nodes, component);
};
function render(element, nodes, parent = {}) {
  if (nodes == null || nodes === false)
    return;
  nodes = createComponent(nodes, parent);
  if (!element)
    return;
  const isSvg = element.nodeName === "SVG";
  if (Array.isArray(nodes)) {
    updateChildren(element, nodes, isSvg);
  } else {
    updateChildren(element, [nodes], isSvg);
  }
}
function same(el, node) {
  const key1 = el.nodeName;
  const key2 = `${node.tag || ""}`;
  return key1.toUpperCase() === key2.toUpperCase();
}
function update(element, node, isSvg) {
  if (node["_op"] === 3)
    return;
  isSvg = isSvg || node.tag === "svg";
  if (!same(element, node)) {
    element.parentNode.replaceChild(create(node, isSvg), element);
    return;
  }
  !(node["_op"] & 2) && updateChildren(element, node.children, isSvg);
  !(node["_op"] & 1) && updateProps(element, node.props, isSvg);
}
function updateChildren(element, children, isSvg) {
  var _a, _b;
  const old_len = ((_a = element.childNodes) === null || _a === void 0 ? void 0 : _a.length) || 0;
  const new_len = (children === null || children === void 0 ? void 0 : children.length) || 0;
  const len = Math.min(old_len, new_len);
  for (let i = 0; i < len; i++) {
    const child = children[i];
    if (child["_op"] === 3)
      continue;
    const el = element.childNodes[i];
    if (typeof child === "string") {
      if (el.textContent !== child) {
        if (el.nodeType === 3) {
          el.nodeValue = child;
        } else {
          element.replaceChild(createText(child), el);
        }
      }
    } else if (child instanceof HTMLElement || child instanceof SVGElement) {
      element.insertBefore(child, el);
    } else {
      const key = child.props && child.props["key"];
      if (key) {
        if (el.key === key) {
          update(element.childNodes[i], child, isSvg);
        } else {
          const old = keyCache[key];
          if (old) {
            const temp = old.nextSibling;
            element.insertBefore(old, el);
            temp ? element.insertBefore(el, temp) : element.appendChild(el);
            update(element.childNodes[i], child, isSvg);
          } else {
            element.replaceChild(create(child, isSvg), el);
          }
        }
      } else {
        update(element.childNodes[i], child, isSvg);
      }
    }
  }
  let n = ((_b = element.childNodes) === null || _b === void 0 ? void 0 : _b.length) || 0;
  while (n > len) {
    element.removeChild(element.lastChild);
    n--;
  }
  if (new_len > len) {
    const d = document.createDocumentFragment();
    for (let i = len; i < children.length; i++) {
      d.appendChild(create(children[i], isSvg));
    }
    element.appendChild(d);
  }
}
var safeHTML = (html) => {
  const div = document.createElement("section");
  div.insertAdjacentHTML("afterbegin", html);
  return Array.from(div.children);
};
function createText(node) {
  if ((node === null || node === void 0 ? void 0 : node.indexOf("_html:")) === 0) {
    const div = document.createElement("div");
    div.insertAdjacentHTML("afterbegin", node.substring(6));
    return div;
  } else {
    return document.createTextNode(node !== null && node !== void 0 ? node : "");
  }
}
function create(node, isSvg) {
  if (node instanceof HTMLElement || node instanceof SVGElement)
    return node;
  if (typeof node === "string")
    return createText(node);
  if (!node.tag || typeof node.tag === "function")
    return createText(JSON.stringify(node));
  isSvg = isSvg || node.tag === "svg";
  const element = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", node.tag) : document.createElement(node.tag);
  updateProps(element, node.props, isSvg);
  if (node.children)
    node.children.forEach((child) => element.appendChild(create(child, isSvg)));
  return element;
}
function mergeProps(oldProps, newProps) {
  newProps["class"] = newProps["class"] || newProps["className"];
  delete newProps["className"];
  const props = {};
  if (oldProps)
    Object.keys(oldProps).forEach((p) => props[p] = null);
  if (newProps)
    Object.keys(newProps).forEach((p) => props[p] = newProps[p]);
  return props;
}
function updateProps(element, props, isSvg) {
  const cached = element[ATTR_PROPS] || {};
  props = mergeProps(cached, props || {});
  element[ATTR_PROPS] = props;
  for (const name in props) {
    const value = props[name];
    if (name.startsWith("data-")) {
      const dname = name.substring(5);
      const cname = dname.replace(/-(\w)/g, (match) => match[1].toUpperCase());
      if (element.dataset[cname] !== value) {
        if (value || value === "")
          element.dataset[cname] = value;
        else
          delete element.dataset[cname];
      }
    } else if (name === "style") {
      if (element.style.cssText)
        element.style.cssText = "";
      if (typeof value === "string")
        element.style.cssText = value;
      else {
        for (const s in value) {
          if (element.style[s] !== value[s])
            element.style[s] = value[s];
        }
      }
    } else if (name.startsWith("xlink")) {
      const xname = name.replace("xlink", "").toLowerCase();
      if (value == null || value === false) {
        element.removeAttributeNS("http://www.w3.org/1999/xlink", xname);
      } else {
        element.setAttributeNS("http://www.w3.org/1999/xlink", xname, value);
      }
    } else if (name.startsWith("on")) {
      if (!value || typeof value === "function") {
        element[name] = value;
      } else if (typeof value === "string") {
        if (value)
          element.setAttribute(name, value);
        else
          element.removeAttribute(name);
      }
    } else if (/^id$|^class$|^list$|^readonly$|^contenteditable$|^role|-|^for$/g.test(name) || isSvg) {
      if (element.getAttribute(name) !== value) {
        if (value)
          element.setAttribute(name, value);
        else
          element.removeAttribute(name);
      }
    } else if (element[name] !== value) {
      element[name] = value;
    }
    if (name === "key" && value)
      keyCache[value] = element;
  }
  if (props && typeof props["ref"] === "function") {
    window.requestAnimationFrame(() => props["ref"](element));
  }
}
function render_component(node, parent, idx) {
  const { tag, props, children } = node;
  let key = `_${idx}`;
  let id = props && props["id"];
  if (!id)
    id = `_${idx}${Date.now()}`;
  else
    key = id;
  let asTag = "section";
  if (props && props["as"]) {
    asTag = props["as"];
    delete props["as"];
  }
  if (!parent.__componentCache)
    parent.__componentCache = {};
  let component = parent.__componentCache[key];
  if (!component || !(component instanceof tag) || !component.element) {
    const element = document.createElement(asTag);
    component = parent.__componentCache[key] = new tag(Object.assign(Object.assign({}, props), { children })).mount(element, { render: true });
  } else {
    component.renderState(component.state);
  }
  if (component.mounted) {
    const new_state = component.mounted(props, children, component.state);
    typeof new_state !== "undefined" && component.setState(new_state);
  }
  updateProps(component.element, props, false);
  return component.element;
}
function createComponent(node, parent, idx = 0) {
  var _a;
  if (typeof node === "string")
    return node;
  if (Array.isArray(node))
    return node.map((child) => createComponent(child, parent, idx++));
  let vdom = node;
  if (node && typeof node.tag === "function" && Object.getPrototypeOf(node.tag).__isAppRunComponent) {
    vdom = render_component(node, parent, idx);
  }
  if (vdom && Array.isArray(vdom.children)) {
    const new_parent = (_a = vdom.props) === null || _a === void 0 ? void 0 : _a._component;
    if (new_parent) {
      let i = 0;
      vdom.children = vdom.children.map((child) => createComponent(child, new_parent, i++));
    } else {
      vdom.children = vdom.children.map((child) => createComponent(child, parent, idx++));
    }
  }
  return vdom;
}

// node_modules/apprun/esm/router.js
var ROUTER_EVENT = "//";
var ROUTER_404_EVENT = "///";
var route = (url) => {
  if (!url)
    url = "#";
  if (url.startsWith("#")) {
    const [name, ...rest] = url.split("/");
    app_default.run(name, ...rest) || app_default.run(ROUTER_404_EVENT, name, ...rest);
    app_default.run(ROUTER_EVENT, name, ...rest);
  } else if (url.startsWith("/")) {
    const [_, name, ...rest] = url.split("/");
    app_default.run("/" + name, ...rest) || app_default.run(ROUTER_404_EVENT, "/" + name, ...rest);
    app_default.run(ROUTER_EVENT, "/" + name, ...rest);
  } else {
    app_default.run(url) || app_default.run(ROUTER_404_EVENT, url);
    app_default.run(ROUTER_EVENT, url);
  }
};

// node_modules/apprun/esm/apprun.js
var apprun_default = app_default;
if (!app_default.start) {
  app_default.h = app_default.createElement = createElement;
  app_default.render = updateElement;
  app_default.Fragment = Fragment;
  app_default.webComponent = web_component_default;
  app_default.safeHTML = safeHTML;
  app_default.start = (element, model, view, update3, options) => {
    const opts = Object.assign({ render: true, global_event: true }, options);
    const component = new Component(model, view, update3);
    if (options && options.rendered)
      component.rendered = options.rendered;
    if (options && options.mounted)
      component.mounted = options.mounted;
    component.start(element, opts);
    return component;
  };
  const NOOP = (_) => {
  };
  app_default.on("$", NOOP);
  app_default.on("debug", (_) => NOOP);
  app_default.on(ROUTER_EVENT, NOOP);
  app_default.on("#", NOOP);
  app_default["route"] = route;
  app_default.on("route", (url) => app_default["route"] && app_default["route"](url));
  if (typeof document === "object") {
    document.addEventListener("DOMContentLoaded", () => {
      if (app_default["route"] === route) {
        window.onpopstate = () => route(location.hash);
        document.body.hasAttribute("apprun-no-init") || app_default["no-init-route"] || route(location.hash);
      }
    });
  }
  if (typeof window === "object") {
    window["Component"] = Component;
    window["_React"] = window["React"];
    window["React"] = app_default;
    window["on"] = on;
    window["customElement"] = customElement2;
    window["safeHTML"] = safeHTML;
  }
  app_default.use_render = (render2, mode = 0) => mode === 0 ? app_default.render = (el, vdom) => render2(vdom, el) : (
    // react style
    app_default.render = (el, vdom) => render2(el, vdom)
  );
  app_default.use_react = (React, ReactDOM) => {
    app_default.h = app_default.createElement = React.createElement;
    app_default.Fragment = React.Fragment;
    app_default.render = (el, vdom) => ReactDOM.render(vdom, el);
    if (React.version && React.version.startsWith("18")) {
      app_default.render = (el, vdom) => {
        if (!el || !vdom)
          return;
        if (!el._root)
          el._root = ReactDOM.createRoot(el);
        el._root.render(vdom);
      };
    }
  };
}

export {
  app_default,
  Component,
  apprun_default
};
//# sourceMappingURL=chunk-WTDSMSRU.js.map
