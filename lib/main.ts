import { resolvers } from './util';

export default class AsyncWorker<TPost = unknown, TRtrn = unknown> {
  readonly #worker: Worker;
  readonly #receivers: Map<number, ReturnType<typeof resolvers<TRtrn>>>;

  constructor(worker: Worker) {
    this.#worker = worker;
    this.#receivers = new Map();

    this.#worker.onmessage = (e: MessageEvent<[number, TRtrn]>) => {
      const [id, ans] = e.data;
      const receiver = this.#receivers.get(id);
      if (!receiver) {
        throw Error('Receiver Not Found');
      }
      receiver.resolve(ans);
    };

    this.#worker.onerror = (e) => {
      const _err = e.error as unknown;
      console.error(_err);
      if (
        Array.isArray(_err) &&
        typeof _err[0] === 'number' &&
        _err.length >= 2
      ) {
        const [id, err] = _err;
        const receiver = this.#receivers.get(id);

        if (!receiver) {
          throw Error('Receiver Not Found');
        }

        receiver.reject(err);
      } else {
        throw Error('Missing ID');
      }
    };
  }

  postMessage(message: TPost) {
    const id = Date.now();
    this.#worker.postMessage([id, message]);
    const rslv = resolvers<TRtrn>();
    this.#receivers.set(id, rslv);
  }

  async receive() {
    const [entry] = this.#receivers.entries();
    if (!entry) return;
    const [id, { promise }] = entry;
    const ans = await promise;
    this.#receivers.delete(id);
    return ans;
  }
}
