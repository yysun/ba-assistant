/**
 * Application Entry Point
 * ----------------------
 * Initializes the app and sets up:
 * - Global document event listeners
 * - Root layout rendering
 * 
 * Core Features:
 * - Document-level event delegation
 * - Root component mounting
 * 
 * Dependencies:
 * - AppRun for event system
 * - Layout component
 */

import app from 'apprun';
import Layout from './layout'

document.addEventListener('click', (e) => {
  app.run('@document-click', e);
});
app.on('@document-click', (e) => { });

export default () => {
  app.render(document.getElementById('root'), <Layout />);
}
