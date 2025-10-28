import { randF64, sleep } from './lazyrand';

globalThis.addEventListener('message', async (e) => {
  const [id, inp] = e.data as [string, unknown];
  console.log('worker: received from main!', id, inp);

  for (let i = 0; i < 10; i++) {
    console.log('from worker', i, randF64());
    await sleep();
  }

  console.log('worker finished!');
  postMessage([id, 777]);
});
