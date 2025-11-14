import { registerRootComponent } from 'expo';

import App from './App';

async function enableMocking() {
  if (!__DEV__) {
    return;
  }

  await import("./msw.polyfills");

  const { server } = await import("./src/mocks/server");
  server.listen();
}

enableMocking().then(() => {
  registerRootComponent(App);
});

registerRootComponent(App);
