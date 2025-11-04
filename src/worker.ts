import { sleep } from './lazyrand';
import type { MessageResult } from '../lib/main';

globalThis.addEventListener(
  'message',
  async (e: MessageEvent<[number, number]>) => {
    const [id, inp] = e.data;
    console.log('worker: received from main!', id, inp);
    await sleep(1000);
    const res: MessageResult<number, Error> = {
      success: false,
      error: Error('thrown!'),
    }
    postMessage([id, res]);
  }
);
