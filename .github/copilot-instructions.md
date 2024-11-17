This project uses AppRun Site that requires the following rules:

## Main App

- The main app (`main.js`) is compiled from `pages/main.tsx`.
- `pages/main.tsx` shoukdexport a function that renders the site layout.
- Do not define routes. The page path is the route path.
- Do not register the page components. AppRun Site will load the page dynamically.

Example:
```tsx
// pages/main.tsx
import app from 'apprun';
import Layout from '../components/layout'

export default () => {
  app.render(document.getElementById('root'), <Layout />);
}
`
```

## Layout
- The site layout should always create a div with the id `main-app` for rendering the pages. 

## Pages

- Each page is a folder with an `index.tsx` file. The page folder name is the page path. E.g., the `docs` folder is the `/docs` page.
- The page `index.tsx` file should create a div with the id `[page]-app` for sub pages if any. E.g., `/docs/index.tsx` should create a div `docs-app` for its sub pages. `/docs/help/index.tsx` will be rendered in the `docs-app` div.
- The page `index.tsx` file should export an AppRun class component or function component. Use class components if you need to manage states or handle events. Otherwise, use function components.

Class component example:
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

Function component example:
```tsx
// pages/[page]/index.tsx -- function component
import { app } from 'apprun';
export default () => <>
  <p>This is a function Component</p>
</>;
```

## Navigation

- Use the `a` tag to navigate between pages. E.g., `<a href="/docs">Docs</a>`

## Events
- If you want to listen to an event, use the $ sign, such as `$onclick`, `$onsubmit`, `$onchange`, etc. AppRun will automatically bind the event to the event handler in the `update` map. E.g., `$onclick="+"`, `$onclick="-"` will bind the `+` and `-` events to the `+` and `-` event handlers in the `update` map.
- You can also pass parameters to the event handler in an arry. E.g., `$onclick={['add', 1]}` will pass `1` as a parameter to the `add` event handler.
- The AppRun event name starts with '#' or '@' are global events. E.g., `#logout`, `@login`. Otherwise, the events are local events scoped to the component. E.g., `add`, `+` events are local events.
- Use local events for component-specific events. Use global events for app-wide events.

## Rendering Controls

- The event handler in the `update` map returns the new state. AppRun will re-render the component with the new state. If it returns null or undefined, it tells AppRun not to render the component.

## Styles

- Uses `class` attribute instead of `className`.