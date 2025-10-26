import AsyncWorker from '../lib/main';

const app = document.getElementById('app') as HTMLDivElement;
app.textContent = 'Please press F12 to open devtools console';

if (crossOriginIsolated) {
  const wo = new AsyncWorker(new URL('worker.ts', import.meta.url));
  const buffer = new SharedArrayBuffer(256);
  wo.postMessage(buffer);

  await wo.receive();

  const view = new BigUint64Array(buffer);

  for (const a of view) {
    console.log(a);
  }

  console.log(`main finished!`);
}
