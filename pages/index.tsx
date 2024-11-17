import { app, Component } from 'apprun';
export default class extends Component {
  state = 0; // initial state
  view = () => <>
    <p>This is a class Component</p>
  </>;
}