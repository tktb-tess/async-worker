import AsyncWorker from '../lib/main';
import { randF64, sleep } from './lazyrand';

const main = async () => {
  const app = document.getElementById('app') as HTMLDivElement;
  app.textContent = 'Please press F12 to open devtools console';

  const wo = new AsyncWorker(new URL('worker.ts', import.meta.url), {
    type: 'module',
  });

  wo.postMessage(0);

  const a = await wo.receive();
  console.log('main: received from worker!', a);

  for (let i = 0; i < 10; i++) {
    console.log('from main', i, randF64());
    await sleep();
  }

  console.log('main finished!');
};

main();
