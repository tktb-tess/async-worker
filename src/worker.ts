globalThis.addEventListener('message', async (e) => {
  const buffer = e.data as SharedArrayBuffer;
  console.log('worker received!', buffer);
  const view = new BigUint64Array(buffer);
  view.set(crypto.getRandomValues(new BigUint64Array(view.length)));

  globalThis.postMessage(true);
});
