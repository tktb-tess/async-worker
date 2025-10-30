import AsyncWorker from '../lib/main';
import { sleep } from './lazyrand';

const main = async () => {
  const app = document.getElementById('app') as HTMLDivElement;
  app.textContent = 'Please press F12 to open devtools console';
  const worker = new Worker(new URL('worker.ts', import.meta.url), {
    type: 'module',
  });

  const aWorker = new AsyncWorker<number, number>(worker);

  aWorker.postMessage(0);

  const a = await aWorker.receive();
  console.log('main: received from worker!', a);

  for (let i = 0; i < 10; i++) {
    console.log('from main', i, Math.random());
    await sleep();
  }

  console.log('main finished!');
};

main();
