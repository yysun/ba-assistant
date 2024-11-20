import {
  promptService
} from "../dist/chunk-HVPWHXXK.js";
import {
  Component,
  app_default
} from "../dist/chunk-WTDSMSRU.js";

// pages/prompts/index.tsx
var Prompts = class extends Component {
  state = async () => {
    const prompts = await promptService.loadPrompts();
    return { prompts, editing: void 0 };
  };
  update = {
    "new-prompt": async (state) => ({
      ...state,
      editing: { id: "", name: "", text: "" }
    }),
    "save-prompt": async (state, prompt) => {
      if (!prompt.id) {
        await promptService.createPrompt(prompt.name, prompt.text);
      } else {
        await promptService.updatePrompt(prompt);
      }
      const prompts = await promptService.loadPrompts();
      return { prompts, editing: void 0 };
    },
    "edit-prompt": async (state, prompt) => ({
      ...state,
      editing: { ...prompt }
    }),
    "delete-prompt": async (state, id) => {
      await promptService.deletePrompt(id);
      const prompts = await promptService.loadPrompts();
      return { prompts };
    },
    "cancel-edit": (state) => ({
      ...state,
      editing: void 0
    })
  };
  view = (state) => {
    return /* @__PURE__ */ app_default.h("div", { class: "p-6" }, /* @__PURE__ */ app_default.h("div", { class: "flex items-center justify-between mb-6" }, /* @__PURE__ */ app_default.h("h1", null, "Prompts"), /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "new-prompt",
        class: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
      },
      "New Prompt"
    )), /* @__PURE__ */ app_default.h("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, state.prompts.map((prompt) => /* @__PURE__ */ app_default.h(
      "div",
      {
        key: prompt.id,
        class: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700"
      },
      /* @__PURE__ */ app_default.h("div", { class: "flex items-center justify-between mb-2" }, /* @__PURE__ */ app_default.h("h4", { class: "font-medium text-gray-900 dark:text-white" }, prompt.name), /* @__PURE__ */ app_default.h("div", { class: "flex gap-2" }, /* @__PURE__ */ app_default.h(
        "button",
        {
          $onclick: ["edit-prompt", prompt],
          class: "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        },
        "Edit"
      ), /* @__PURE__ */ app_default.h(
        "button",
        {
          $onclick: ["delete-prompt", prompt.id],
          class: "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-red-700 dark:text-red-200 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        },
        "Delete"
      ))),
      /* @__PURE__ */ app_default.h("p", { class: "text-gray-600 dark:text-gray-300 text-xs whitespace-pre-wrap" }, prompt.text)
    ))), state.editing && /* @__PURE__ */ app_default.h("div", { class: "fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 z-40" }, /* @__PURE__ */ app_default.h("div", { class: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50" }, /* @__PURE__ */ app_default.h("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700 mx-4" }, /* @__PURE__ */ app_default.h("h3", { class: "text-xs font-medium text-gray-900 dark:text-white mb-4" }, state.editing.id ? "Edit Prompt" : "New Prompt"), /* @__PURE__ */ app_default.h("div", { class: "space-y-4" }, /* @__PURE__ */ app_default.h("div", null, /* @__PURE__ */ app_default.h("label", { class: "block font-medium text-gray-700 dark:text-gray-200 mb-2" }, "Prompt Name"), /* @__PURE__ */ app_default.h(
      "input",
      {
        type: "text",
        placeholder: "Enter prompt name",
        value: state.editing.name,
        onchange: (e) => state.editing.name = e.target.value,
        class: "block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium"
      }
    )), /* @__PURE__ */ app_default.h("div", null, /* @__PURE__ */ app_default.h("label", { class: "block font-medium text-gray-700 dark:text-gray-200 mb-2" }, "Prompt Text"), /* @__PURE__ */ app_default.h(
      "textarea",
      {
        placeholder: "Enter prompt text",
        value: state.editing.text,
        onchange: (e) => state.editing.text = e.target.value,
        class: "block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-medium h-96 resize-none"
      }
    )), /* @__PURE__ */ app_default.h("div", { class: "flex gap-2 justify-end mt-4" }, /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: ["save-prompt", state.editing],
        class: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
      },
      "Save"
    ), /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "cancel-edit",
        class: "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      },
      "Cancel"
    )))))));
  };
};
export {
  Prompts as default
};
//# sourceMappingURL=index.js.map
