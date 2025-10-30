import { sleep } from './lazyrand';

globalThis.addEventListener(
  'message',
  async (e: MessageEvent<[number, unknown]>) => {
    const [id, inp] = e.data;
    console.log('worker: received from main!', id, inp);

    for (let i = 0; i < 10; i++) {
      console.log('from worker', i, Math.random());
      await sleep();
    }

    console.log('worker finished!');
    postMessage([id, 777]);
  }
);
