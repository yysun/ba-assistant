import app from 'apprun';
import Layout from './layout'

document.addEventListener('click', (e) => {
  app.run('@document-click', e);
});
app.on('@document-click', (e) => { });

export default () => {
  app.render(document.getElementById('root'), <Layout />);
}
