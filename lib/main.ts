import { resolvers } from './util';
import type { MessageResult } from './util';
export type { MessageResult };

export default class AsyncWorker<TPost = unknown, TRtrn = unknown> {
  readonly #worker: Worker;
  readonly #receivers: Map<number, ReturnType<typeof resolvers<TRtrn>>>;

  constructor(worker: Worker) {
    this.#worker = worker;
    this.#receivers = new Map();

    this.#worker.addEventListener(
      'message',
      (e: MessageEvent<[number, MessageResult<TRtrn, unknown>]>) => {
        const [id, ans] = e.data;
        const receiver = this.#receivers.get(id);
        if (!receiver) {
          throw Error('Receiver Not Found');
        }
        if (ans.success) {
          receiver.resolve(ans.value);
        } else {
          const err = ans.error;
          // console.error(err);
          receiver.reject(err);
        }
      }
    );

    this.#worker.addEventListener('error', (e) => {
      console.error(e.message);
      throw Error(e.message, { cause: e });
    });
  }

  postMessage(message: TPost) {
    const id = Date.now();
    this.#worker.postMessage([id, message]);
    const rslv = resolvers<TRtrn>();
    this.#receivers.set(id, rslv);
  }

  async receive() {
    const iterRes = this.#receivers.entries().next();
    if (iterRes.done) return;

    const [id, { promise }] = iterRes.value;

    return promise.finally(() => {
      this.#receivers.delete(id);
    });
  }
}
