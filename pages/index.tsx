import { app, Component } from 'apprun';

export default class Home extends Component {
  state = {
    dragging: false,
    leftWidth: 50,
    start: { x: 0, width: 50 },
    el: null as HTMLElement,
    container: null as HTMLElement,
    leftContent: '',
    rightContent: '',
    leftTitle: 'Ideas',
    rightTitle: '',
  }

  view = (state) => (
    <div class="flex h-[calc(100vh-100px)] gap-0 select-none overflow-hidden" ref={el => state.container = el}>
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
        class={`w-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-col-resize -mx-0.5 relative z-10 touch-none h-[calc(100%-2rem)] mt-12 ${
          state.dragging ? 'bg-gray-300 dark:bg-gray-600' : ''
        }`}
      ></div>
      <div class="flex-1 min-w-[200px] overflow-hidden">
        <h1>{ state.rightTitle }</h1>
        <textarea
          class="w-full h-[calc(100%-2rem)] resize-none p-2 bg-gray-100 dark:bg-gray-800 outline-none dark:text-gray-100"
          value={state.rightContent}
          $oninput={['updateRight']}
        ></textarea>
      </div>
    </div>
  );

  update = {
    '#': (state, title) => ({ ...state, rightTitle: title }),
    
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

    updateLeft: (state, e: Event) => ({
      ...state,
      leftContent: (e.target as HTMLTextAreaElement).value
    }),

    updateRight: (state, e: Event) => ({
      ...state,
      rightContent: (e.target as HTMLTextAreaElement).value
    })
  };

  unload = ({ el }) => {
    if (el) {
      el.onpointerdown = el.onpointerup = el.onpointermove = el.onpointercancel = null;
    }
  };
}
