/* eslint-disable no-console */
import server, { config } from 'apprun-site/server.js';

const port = process.env.PORT || 8080;
const { root, ssr, save, live_reload } = config;

// Get base app from apprun-site
const app = server({ output: 'docs', ssr: false });

app.listen(port, () => {
  console.log('Your app is listening on:', `http://localhost:${port}`);
  console.log('Serving from:', `${root}`);
  console.log('SSR:', `${!ssr ? 'disabled' : 'enabled'}.`);
  console.log('Save:', `${!save ? 'disabled' : 'enabled'}.`);
  console.log('Live reload:', `${!live_reload ? 'disabled' : 'enabled'}.`);
});
