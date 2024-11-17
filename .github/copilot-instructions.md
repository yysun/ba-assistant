This project uses AppRun Site that requires the following rules:

## Pages and Components

- Each page is a folder with an `index.tsx` file. The page folder name is the page path. E.g., the `docs` folder is the `/docs` page.
- Do not add any routing logic. AppRun Site will handle the routing.
- Use the `a` tag to navigate between pages. E.g., `<a href="/docs">Docs</a>`

- The page `index.tsx` file should export an AppRun class component. E.g.,
```tsx
// pages/[page]/index.tsx -- class component
import { app, Component } from 'apprun';
export default class extends Component {
  state = 0; // initial state
  view = () => <>
    <p>This is a class Component</p>
  </>;
}
```
- Use the `state` property to define the initial state.
- The initial state can be a value or an async function that returns the initial state.
- Use the `view` method to define the component view.
- Use the `update` map to define the event handlers.

## Event Handlers

- There are two ways to define event handlers in AppRun Site:
  1. Regular event handlers: E.g., `onchange={(e) => console.log(e.target.value) }`; 
  2. Event handler function grouped in the `update` map:
    -- The event handle function is a function that takes the current state and event parameters as arguments and returns the new stat. AppRun will re-render the component with the new state. If it returns null or undefined, AppRun will not to render the component.
    - Organize the event handler functions in the `update` map, E.g.,
    ```tsx    
      update = {
        '+': state => state + 1,
        '-': state => state - 1
      }
    ```
    - You can add the $ sign to the on events, such as `$onclick`, `$onsubmit`, `$onchange`, etc. and assign an event name. AppRun will automatically bind the event to the event handler in the `update` map. E.g., `$onclick="+"`, `$onclick="-"` will bind the `+` and `-` events to the `+` and `-` event handlers in the `update` map.
    - You can also pass parameters to the event handler in an arry. E.g., `$onclick={['add', 1]}` will pass `1` as a parameter to the `add` event handler.
- Event handlers rules:
  - Use regular event handlers if not state change.
  - Use event handler functions to update the state. Without the `return` statement will not trigger rendering the component.
  - Use the `update` map for grouping event handler functions.

## Events
- The AppRun event name starts with '#' or '@' are global events. E.g., `#logout`, `@login`. Otherwise, the events are local events scoped to the component. E.g., `add`, `+` events are local events.
- Use local events for component-specific events. Use global events for app-wide events.
- Try use the local events as much as possible. Only use global events when necessary.

## Rendering Controls

- The event handler in the `update` map returns the new state. AppRun will re-render the component with the new state. If it returns null or undefined, it tells AppRun not to render the component.

## Styles

- Uses `class` attribute instead of `className`.