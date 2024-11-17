import { app, Component } from 'apprun';
export default class ContactComponent extends Component {
  state = 'Contact';

  view = state => <div>
    <h2>Manage Prompts</h2>
    <p></p>
  </div>;
}

