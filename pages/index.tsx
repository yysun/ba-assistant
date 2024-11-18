import { app, Component } from 'apprun';
import { Project, createProject, loadProject, saveProject } from './_data/project';
import { promptService } from './_data/prompts';

const beautifyLabel = (filename: string) => {
  return filename
    .replace('.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default class Home extends Component {
  state = {
    dragging: false,
    leftWidth: 30,
    start: { x: 0, width: 30 },
    el: null as HTMLElement,
    container: null as HTMLElement,
    leftContent: '',
    rightContent: '',
    leftTitle: 'Ideas',
    rightTitle: '',
    activeTab: '',
    tabs: [] as string[],
    generating: false,
    project: null as Project,
  }

  view = (state) => (
    <>
      {/* Header */}
      <header class="bg-white dark:bg-gray-800 shadow-sm text-xs">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 flex items-center gap-4">
            {state.tabs.map((tab) => (
              <a $onclick={['setTab', tab]}
                class={`px-4 py-2 rounded-lg transition-colors ${state.activeTab === tab
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                {beautifyLabel(tab)}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div class="flex h-[calc(100vh-30px)] gap-0 select-none overflow-hidden p-6 text-gray-600 dark:text-gray-300 text-xs" ref={el => state.container = el}>
        <div class={`flex-none min-w-[200px] overflow-hidden`} style={{
          width: `${state.leftWidth}%`
        }}>
          <h1>{state.leftTitle}</h1>
          <textarea
            class="w-full h-[calc(100%-2rem)] resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100"
            value={state.leftContent}
            $oninput={['updateLeft']}
          ></textarea>
        </div>
        <div
          ref={el => state.el = el}
          $onpointerdown='drag'
          $onpointermove='move'
          $onpointerup='drop'
          $onpointercancel='drop'
          class={`w-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize -mx-0.5 relative z-10 touch-none h-[calc(100%-2rem)] mt-12 ${state.dragging ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
        ></div>
        <div class="flex-1 min-w-[200px] overflow-hidden">
          <div class="flex justify-between items-center">
            <h1>{state.rightTitle}</h1>
            <button 
              $onclick="generate"
              disabled={state.generating}
              class="px-3 py-1 mb-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <textarea
            class="w-full h-[calc(100%-2rem)] resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100"
            value={state.rightContent}
            $oninput={['updateRight']}
          ></textarea>
        </div>
      </div>
    </>
  );

  update = {

    drag: (state, e: PointerEvent) => {
      const target = e.target as HTMLElement;
      target.setPointerCapture(e.pointerId);
      document.body.style.cursor = 'col-resize';

      return {
        ...state,
        dragging: true,
        start: {
          x: e.pageX,
          width: state.leftWidth
        }
      };
    },

    move: (state, e: PointerEvent) => {
      if (!state.dragging || !state.container) return;

      const dx = e.pageX - state.start.x;
      const containerWidth = state.container.offsetWidth;
      const deltaPercentage = (dx / containerWidth) * 100;
      const newLeftWidth = Math.max(20, Math.min(80,
        state.start.width + deltaPercentage
      ));

      return { ...state, leftWidth: newLeftWidth };
    },

    drop: (state, e: PointerEvent) => {
      if (!state.dragging) return;

      const target = e.target as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      document.body.style.cursor = '';

      return {
        ...state,
        dragging: false
      };
    },

    updateLeft: (state, e: Event) => {
      const newContent = (e.target as HTMLTextAreaElement).value;
      if (state.project) {
        state.project.files['project.md'] = newContent;
        saveProject(state.project);
      }
      return {
        ...state,
        leftContent: newContent
      };
    },

    updateRight: (state, e: Event) => {
      const newContent = (e.target as HTMLTextAreaElement).value;
      if (state.project) {
        state.project.files[state.activeTab] = newContent;
        saveProject(state.project);
      }
      return {
        ...state,
        rightContent: newContent
      };
    },

    'setTab': (state, filename: string) => {
      return {
        ...state,
        activeTab: filename,
        rightTitle: beautifyLabel(filename),
        rightContent: state.project?.files[filename] || ''
      };
    },

    'generate': async (state) => {
      if (state.generating || !state.activeTab) return;

      state = { ...state, generating: true };

      try {
        // Load prompts
        const prompts = await promptService.loadPrompts();
        
        // Match prompt by name (remove .md and convert to title case)
        const promptName = beautifyLabel(state.activeTab);
        const prompt = prompts.find(p => p.name === promptName);
        
        if (!prompt) {
          console.error('No matching prompt found for:', promptName);
          return { ...state, generating: false };
        }

        // TODO: Replace this with actual API call to AI service
        const projectIdeas = state.project.files['project.md'];
        const generatedContent = `${prompt.text}\n\nBased on project ideas below:\n\n<ideas>\n${projectIdeas}<ideas>\n\n`;
        
        if (state.project) {
          state.project.files[state.activeTab] = generatedContent;
          saveProject(state.project);
        }

        return {
          ...state,
          generating: false,
          rightContent: generatedContent
        };

      } catch (error) {
        console.error('Generation failed:', error);
        return { ...state, generating: false };
      }
    },
  };

  mounted = () => {
    let project = loadProject();

    if (!project) {
      project = createProject('New Project');
      saveProject(project);
    }

    const tabs = Object.keys(project.files)
      .filter(name => name !== 'project.md')

    return {
      ...this.state,
      project,
      tabs,
      leftContent: project.files['project.md'] || '',
      rightContent: project.files[tabs[0]] || '',
      leftTitle: 'Project Ideas',
      rightTitle: beautifyLabel(tabs[0]),
      activeTab: tabs[0]
    };
  };

  unload = ({ el }) => {
    if (el) {
      el.onpointerdown = el.onpointerup = el.onpointermove = el.onpointercancel = null;
    }
  };
}
