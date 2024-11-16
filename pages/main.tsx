import app from 'apprun';
import Layout from './layout'
import Comic from '../components/comic';

export default () => {
  app.webComponent('ws-comic', Comic);
  app.render(document.getElementById('root'), <Layout />);
}
