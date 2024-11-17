import { app, Component } from 'apprun';

export default class extends Component {
  state = {
    dragging: false,
    leftWidth: 50,
    start: { x: 0, width: 50 },
    el: null as HTMLElement,
    container: null as HTMLElement,
    leftContent: '',
    rightContent: ''
  }

  view = (state) => (
    <>
      <h1>Design Your System</h1>
      <div class="flex h-[calc(100vh-100px)] gap-0 select-none overflow-hidden" ref={el => state.container = el}>
        <div class={`flex-none bg-gray-100 min-w-[200px] overflow-auto`} style={{ 
          width: `${state.leftWidth}%`
        }}>
          <textarea 
            class="w-full h-full resize-none p-2 bg-transparent outline-none"
            value={state.leftContent}
            $oninput={['#updateLeft']}
          ></textarea>
        </div>
        <div 
          ref={el => state.el = el}
          $onpointerdown='drag'
          $onpointermove='move'
          $onpointerup='drop'
          $onpointercancel='drop'
          class={`w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize -mx-0.5 relative z-10 touch-none ${
            state.dragging ? 'bg-gray-400' : ''
          }`}
        ></div>
        <div class="flex-1 bg-gray-100 min-w-[200px] overflow-auto">
          <textarea 
            class="w-full h-full resize-none p-2 bg-transparent outline-none"
            value={state.rightContent}
            $oninput={['#updateRight']}
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

    '#updateLeft': (state, e: Event) => ({
      ...state,
      leftContent: (e.target as HTMLTextAreaElement).value
    }),

    '#updateRight': (state, e: Event) => ({
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
