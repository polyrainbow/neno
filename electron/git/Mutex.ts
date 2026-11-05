/*
  First come, first served. A failing holder releases the lock like any
  other.
*/
export default class Mutex {
  #tail: Promise<void> = Promise.resolve();

  async run<T>(fn: () => Promise<T>): Promise<T> {
    const previous = this.#tail;
    let release!: () => void;
    this.#tail = new Promise<void>((resolve) => {
      release = resolve;
    });
    try {
      await previous;
      return await fn();
    } finally {
      release();
    }
  }

  /** Resolves once everything queued so far has run. */
  async drain(): Promise<void> {
    await this.run(async () => {});
  }
}
