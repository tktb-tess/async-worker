const withResolvers = <T>() => {
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

class AsyncWorker {
  readonly #worker: Worker;
  #receiver: Promise<unknown> | null;

  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    this.#worker = new Worker(scriptURL, options);
    this.#receiver = null;
  }

  #makeReceiver() {
    const { promise, resolve, reject } = withResolvers();

    this.#worker.onmessage = (e) => {
      this.#worker.onmessage = null;
      this.#worker.onerror = null;
      this.#receiver = null;
      resolve(e.data);
    };

    this.#worker.onerror = (e) => {
      this.#worker.onmessage = null;
      this.#worker.onerror = null;
      this.#receiver = null;
      reject(e.error);
    };

    this.#receiver = promise;
    return promise;
  }

  postMessage(message: unknown) {
    this.#worker.postMessage(message);
    return this.#makeReceiver();
  }

  receive() {
    if (!this.#receiver) {
      throw Error(`No messages are sent`);
    }
    return this.#receiver;
  }
}

export { AsyncWorker };
