# async-worker

main.ts

```ts
const wo = new AsyncWorker(new URL('worker.ts', import.meta.url), {
  type: 'module',
});

// send worker a message
wo.postMessage('Hello worker!');

// receive result from worker asynchronically
const a = await wo.receive();
console.log(a); // Nice to meet you!

```

worker.ts

```ts
globalThis.addEventListener('message', async (e) => {
  // you need to receive message as a tuple form of [ID, message]
  const [id, msg] = e.data as [string, string];
  console.log(msg); // Hello worker!

  // some programs ...

  // And you also need to send back a message with the same ID as received
  postMessage([id, 'Nice to meet you!']);
});
```

