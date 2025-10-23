self.onmessage = async (e) => {
  const buffer = e.data as SharedArrayBuffer;
  console.log('worker received!', buffer);
  const view = new BigUint64Array(buffer);
  crypto.getRandomValues(view);
 
  postMessage(true);
};

