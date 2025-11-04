import AsyncWorker from '../lib/main';

const app = document.getElementById('app') as HTMLDivElement;
app.textContent = 'Please press F12 to open devtools console';
const w = new Worker(new URL('worker.ts', import.meta.url), {
  type: 'module',
});

const worker = new AsyncWorker<number, number>(w);

worker.postMessage(0);

await worker.receive();

console.log('main finished!');
