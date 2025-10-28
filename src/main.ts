import AsyncWorker from '../lib/main';

const app = document.getElementById('app') as HTMLDivElement;
app.textContent = 'Please press F12 to open devtools console';

const wo = new AsyncWorker(new URL('worker.ts', import.meta.url), {
  type: 'module',
});
const buffer = new SharedArrayBuffer(32);

wo.postMessage(buffer);

const ans = await wo.receive();
console.log('received at main!', ans);

const view = new Uint8Array(buffer);

for (const a of view) {
  console.log('from main:', a.toString(16).padStart(2, '0'));
}

console.log(await wo.receive());
console.log(`main finished!`);
