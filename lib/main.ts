const withResolvers = <T = unknown>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

type UUIDv4 = ReturnType<typeof crypto.randomUUID>;

const isUuidv4 = (str: unknown): str is UUIDv4 => {
  if (typeof str !== 'string') return false;
  const regex = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}$/;
  return regex.test(str);
};

export default class AsyncWorker {
  readonly #worker: Worker;
  readonly #receivers: Map<UUIDv4, ReturnType<typeof withResolvers>>;

  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    this.#worker = new Worker(scriptURL, options);
    this.#receivers = new Map();

    this.#worker.onmessage = (e: MessageEvent<unknown>) => {
      const [id, ans] = e.data as [UUIDv4, unknown];
      const receiver = this.#receivers.get(id);
      if (!receiver) {
        throw Error('Receiver Not Found');
      }
      receiver.resolve(ans);
    };

    this.#worker.onerror = (e) => {
      const err = e.error as unknown;
      console.error(err);
      if (Array.isArray(err) && isUuidv4(err[0]) && err.length >= 2) {
        const [id, ee] = err;
        const receiver = this.#receivers.get(id);
        if (!receiver) {
          throw Error('Receiver Not Found');
        }
        receiver.reject(ee);
      } else {
        throw Error('Missing ID');
      }
    };
  }

  postMessage(message: unknown) {
    const id = crypto.randomUUID();
    this.#worker.postMessage([id, message]);
    const rslv = withResolvers();
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
