# async-worker

main.ts

```ts
const wo = new AsyncWorker(new URL('worker.ts', import.meta.url), {
  type: 'module',
});

// send worker a message
wo.postMessage('Hello worker!');

// receive result from a worker asynchronously
const a = await wo.receive();
console.log(a); // Nice to meet you!

```

worker.ts

```ts
globalThis.addEventListener('message', async (e) => {
  // You need to receive a message as a tuple form of [ID, message]
  const [id, msg] = e.data as [string, string];
  console.log(msg); // Hello worker!

  // some programs ...

  // And you also need to send back a message and the received ID together
  postMessage([id, 'Nice to meet you!']);
});
```

