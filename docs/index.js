import {
  promptService
} from "./dist/chunk-HVPWHXXK.js";
import {
  Component,
  app_default
} from "./dist/chunk-WTDSMSRU.js";

// pages/_data/project.ts
var DEFAULT_FILES = [
  "project.md",
  "user-story-map.md",
  "customer-journey-map.md",
  "page-navigations.md",
  "page-user-stories.md",
  "sprint-plan.md"
];
var createProject = (name) => ({
  name,
  files: DEFAULT_FILES.reduce((acc, file) => ({ ...acc, [file]: "" }), {})
});
var saveProject = async (project, dirHandle) => {
  localStorage.setItem("ba-assistant-project", JSON.stringify(project));
  if (dirHandle) {
    try {
      for (const [filename, content] of Object.entries(project.files)) {
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      }
    } catch (err) {
      console.error("Error saving files to directory:", err);
      throw err;
    }
  }
};
var loadProject = () => {
  const project = localStorage.getItem("ba-assistant-project");
  return project ? JSON.parse(project) : null;
};

// pages/index.tsx
var beautifyLabel = (filename) => {
  return filename.replace(".md", "").split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
var verifyPermission = async (dirHandle) => {
  const options = "readwrite";
  if (await dirHandle.queryPermission({ mode: options }) === "granted") return true;
  if (await dirHandle.requestPermission({ mode: options }) === "granted") return true;
  return false;
};
var Home = class extends Component {
  state = async () => {
    let project = loadProject();
    const prompts = await promptService.loadPrompts();
    if (!project) {
      project = createProject("New Project");
      saveProject(project);
    }
    const tabs = Object.keys(project.files).filter((name) => name !== "project.md");
    return {
      dragging: false,
      leftWidth: 30,
      start: { x: 0, width: 30 },
      el: null,
      container: null,
      leftContent: project.files["project.md"] || "",
      rightContent: project.files[tabs[0]] || "",
      leftTitle: "Project Ideas",
      rightTitle: beautifyLabel(tabs[0]),
      activeTab: tabs[0],
      tabs,
      generating: false,
      project,
      selectedFiles: ["project.md"],
      showFileSelector: false,
      promptContent: "",
      prompts
      // Store loaded prompts in state
    };
  };
  view = (state) => {
    const generatePrompt = () => {
      const promptName = beautifyLabel(state.activeTab);
      const prompt = state.prompts?.find((p) => p.name === promptName);
      if (!prompt) {
        console.error("No matching prompt found:", promptName);
        return "";
      }
      const selectedContent = state.selectedFiles.map((file) => {
        const content = state.project.files[file];
        const tagName = beautifyLabel(file).replace(/\s+/g, "");
        return `<${tagName}>
${content}
</${tagName}>`;
      }).join("\n\n");
      return `${prompt.text}

Based on the following files:

${selectedContent}

`;
    };
    if (!state.promptContent) state.promptContent = generatePrompt();
    return /* @__PURE__ */ app_default.h("div", { class: "flex flex-col h-screen overflow-hidden" }, /* @__PURE__ */ app_default.h("header", { class: "bg-white dark:bg-gray-800 shadow-sm text-xs flex-none" }, /* @__PURE__ */ app_default.h("div", { class: "flex items-center justify-between px-6 py-4" }, /* @__PURE__ */ app_default.h("div", { class: "flex-1 flex items-center gap-4" }, state.tabs.map((tab) => /* @__PURE__ */ app_default.h(
      "a",
      {
        $onclick: ["setTab", tab],
        class: `px-4 py-2 rounded-lg transition-colors ${state.activeTab === tab ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`
      },
      beautifyLabel(tab)
    ))), /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "selectFolderAndSave",
        class: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      },
      "Save"
    ))), /* @__PURE__ */ app_default.h("div", { class: "flex flex-1 gap-0 select-none overflow-hidden p-6 text-gray-600 dark:text-gray-300 text-xs", ref: (el) => state.container = el }, /* @__PURE__ */ app_default.h("div", { class: `flex-none min-w-[200px] overflow-hidden flex flex-col`, style: {
      width: `${state.leftWidth}%`
    } }, /* @__PURE__ */ app_default.h("h1", null, state.leftTitle), /* @__PURE__ */ app_default.h(
      "textarea",
      {
        class: "flex-1 w-full resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600",
        value: state.leftContent,
        $oninput: ["updateLeft"]
      }
    )), /* @__PURE__ */ app_default.h(
      "div",
      {
        ref: (el) => state.el = el,
        $onpointerdown: "drag",
        $onpointermove: "move",
        $onpointerup: "drop",
        $onpointercancel: "drop",
        class: `w-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize touch-none h-full mx-2 ${state.dragging ? "bg-gray-300 dark:bg-gray-600" : ""}`
      }
    ), /* @__PURE__ */ app_default.h("div", { class: "flex-1 min-w-[200px] overflow-hidden flex flex-col" }, /* @__PURE__ */ app_default.h("div", { class: "flex justify-between items-center" }, /* @__PURE__ */ app_default.h("h1", null, state.rightTitle), /* @__PURE__ */ app_default.h("div", { class: "flex gap-2" }, /* @__PURE__ */ app_default.h("div", { class: "relative" }, /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "toggleFileSelector",
        class: "px-3 py-1 mb-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-1"
      },
      "Select Files (",
      state.selectedFiles.length,
      ")",
      /* @__PURE__ */ app_default.h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, /* @__PURE__ */ app_default.h("path", { "fill-rule": "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", "clip-rule": "evenodd" }))
    ), state.showFileSelector && /* @__PURE__ */ app_default.h("div", { id: "file-selector", class: "absolute z-20 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" }, /* @__PURE__ */ app_default.h("label", { class: "flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" }, /* @__PURE__ */ app_default.h(
      "input",
      {
        type: "checkbox",
        checked: state.selectedFiles.includes("project.md"),
        $onchange: ["toggleFileSelection", "project.md"],
        class: "mr-2"
      }
    ), "Project Ideas"), state.tabs.filter((file) => file !== state.activeTab).map((file) => /* @__PURE__ */ app_default.h("label", { class: "flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" }, /* @__PURE__ */ app_default.h(
      "input",
      {
        type: "checkbox",
        checked: state.selectedFiles.includes(file),
        $onchange: ["toggleFileSelection", file],
        class: "mr-2"
      }
    ), beautifyLabel(file))))), /* @__PURE__ */ app_default.h("div", { class: "relative" }, /* @__PURE__ */ app_default.h(
      "button",
      {
        $onclick: "copyContent",
        class: "px-3 py-1 mb-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg relative",
        title: "Copy the prompt"
      },
      /* @__PURE__ */ app_default.h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, /* @__PURE__ */ app_default.h("path", { d: "M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" }), /* @__PURE__ */ app_default.h("path", { d: "M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" }))
    )))), /* @__PURE__ */ app_default.h("div", { class: "flex-1 flex flex-col" }, /* @__PURE__ */ app_default.h("div", { class: "h-1/3 mb-2" }, /* @__PURE__ */ app_default.h(
      "textarea",
      {
        class: "w-full h-full resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg",
        value: state.promptContent,
        placeholder: "Generated prompt/response will appear here...",
        $oninput: ["updatePrompt"]
      }
    )), /* @__PURE__ */ app_default.h("div", { class: "h-2/3" }, /* @__PURE__ */ app_default.h(
      "textarea",
      {
        class: "w-full h-full resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg",
        value: state.rightContent,
        $oninput: ["updateRight"]
      }
    ))))));
  };
  update = {
    drag: (state, e) => {
      const target = e.target;
      target.setPointerCapture(e.pointerId);
      document.body.style.cursor = "col-resize";
      return {
        ...state,
        dragging: true,
        start: {
          x: e.pageX,
          width: state.leftWidth
        }
      };
    },
    move: (state, e) => {
      if (!state.dragging || !state.container) return;
      const dx = e.pageX - state.start.x;
      const containerWidth = state.container.offsetWidth;
      const deltaPercentage = dx / containerWidth * 100;
      const newLeftWidth = Math.max(20, Math.min(
        80,
        state.start.width + deltaPercentage
      ));
      return { ...state, leftWidth: newLeftWidth };
    },
    drop: (state, e) => {
      if (!state.dragging) return;
      const target = e.target;
      target.releasePointerCapture(e.pointerId);
      document.body.style.cursor = "";
      return {
        ...state,
        dragging: false
      };
    },
    updateLeft: (state, e) => {
      const newContent = e.target.value;
      if (state.project) {
        state.project.files["project.md"] = newContent;
        saveProject(state.project);
      }
      return {
        ...state,
        leftContent: newContent
      };
    },
    updateRight: (state, e) => {
      const newContent = e.target.value;
      if (state.project && state.activeTab) {
        state.project.files[state.activeTab] = newContent;
        saveProject(state.project);
      }
      return {
        ...state,
        rightContent: newContent
      };
    },
    setTab: (state, filename) => {
      if (state.project) {
        state.project.files[state.activeTab] = state.rightContent;
        saveProject(state.project);
      }
      return {
        ...state,
        activeTab: filename,
        rightTitle: beautifyLabel(filename),
        rightContent: state.project?.files[filename] || "",
        promptContent: ""
        // Reset prompt content to trigger regeneration
      };
    },
    toggleFileSelection: (state, file) => {
      const newSelectedFiles = state.selectedFiles.includes(file) ? state.selectedFiles.filter((f) => f !== file) : [...state.selectedFiles, file];
      return {
        ...state,
        selectedFiles: newSelectedFiles,
        // showFileSelector: false,
        promptContent: ""
        // Reset prompt content to trigger regeneration
      };
    },
    updatePrompt: (state, e) => {
      const newContent = e.target.value;
      return {
        ...state,
        promptContent: newContent
      };
    },
    copyContent: async (state, e) => {
      try {
        await navigator.clipboard.writeText(state.promptContent);
        const tooltip = document.createElement("div");
        tooltip.textContent = "Copied!";
        tooltip.className = "absolute top-8 -left-6 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded shadow pointer-events-none z-50 whitespace-nowrap";
        const buttonContainer = e.target.closest(".relative");
        if (buttonContainer) {
          buttonContainer.appendChild(tooltip);
          setTimeout(() => tooltip.remove(), 2e3);
        }
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    },
    toggleFileSelector: (state) => ({
      ...state,
      showFileSelector: !state.showFileSelector
    }),
    selectFolderAndSave: async (state) => {
      try {
        const dirHandle = await window.showDirectoryPicker();
        const hasPermission = await verifyPermission(dirHandle);
        if (!hasPermission) {
          alert("Permission denied to access the selected folder");
          return state;
        }
        if (state.project) {
          state.project.files["project.md"] = state.leftContent;
          state.project.files[state.activeTab] = state.rightContent;
          state.project.folder = dirHandle.name;
          await saveProject(state.project, dirHandle);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return state;
        }
        console.error("Failed to save files:", err);
        alert("Failed to save files: " + err.message);
      }
      return state;
    },
    save: (state) => {
      if (state.project) {
        state.project.files["project.md"] = state.leftContent;
        state.project.files[state.activeTab] = state.rightContent;
        saveProject(state.project);
      }
    },
    // generate: async (state) => { },
    "@document-click": (state, e) => {
      if (!state.showFileSelector) return;
      const target = e.target;
      const isInsideSelector = target.closest('#file-selector, button[class*="bg-gray-500"]');
      if (!isInsideSelector) {
        return {
          ...state,
          showFileSelector: false
        };
      }
    }
  };
  unload = ({ el }) => {
    if (el) {
      el.onpointerdown = el.onpointerup = el.onpointermove = el.onpointercancel = null;
    }
  };
};
export {
  Home as default
};
//# sourceMappingURL=index.js.map
