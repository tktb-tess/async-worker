# async-worker

Wrapping Worker by Promise

## Usage

main.ts

```ts
import AsyncWorker from '@tktb-tess/async-worker';

const w = new Worker(
  new URL('worker.ts', import.meta.url),
  { type: 'module' }
);
const worker = new AsyncWorker<string, string>(w);

// send worker a message
worker.postMessage('Hello worker!');

// receive result from a worker asynchronously
const a = await worker.receive();
console.log(a); // Nice to meet you!
```

worker.ts

```ts
globalThis.addEventListener('message', async (e) => {
  // You need to receive a message as a tuple form of [ID, message]
  // ID is a timestamp
  const [id, msg] = e.data as [number, string];
  console.log(msg); // Hello worker!

  // some programs ...

  // And you also need to send back a message and the received ID together
  postMessage([id, 'Nice to meet you!']);
});
```

