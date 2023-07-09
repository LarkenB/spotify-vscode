import App from './components/Main.svelte';
import { accessToken } from './store';

window.addEventListener('message', (event) => {
  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case 'accessToken': {
      accessToken.set(message.accessToken);
      break;
    }
  }
});

const app = new App({
  target: document.body,
});

export default app;
