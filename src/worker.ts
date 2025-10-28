globalThis.addEventListener('message', async (e) => {
  const [id, buffer] = e.data as [string, SharedArrayBuffer];
  console.log('received at worker!', buffer);
  const view = new Uint8Array(buffer);
  view.set(crypto.getRandomValues(new Uint8Array(view.length)));

  for (const i of view) {
    console.log('from worker:', i.toString(16).padStart(2, '0'));
  }
  console.log('worker finished!');
  globalThis.postMessage([id, true]);
});

export {};
