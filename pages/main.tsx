import app from 'apprun';
import Layout from './layout'

export default () => {
  app.render(document.getElementById('root'), <Layout />);
}
