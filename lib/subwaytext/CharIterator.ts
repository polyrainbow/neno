type IteratorStep
  = {
    done: false,
    value: string,
  } | {
    done: true,
    value: null,
  };

export default class CharIterator {
  #chars: string[];
  #index;

  constructor(input: string) {
    this.#chars = Array.from(input);
    this.#index = -1;
  }

  next(): IteratorStep {
    this.#index++;
    const done = this.#index === this.#chars.length;
    return done ? {
      done,
      value: null,
    } : {
      done,
      value: this.#chars[this.#index],
    };
  }

  peek(numberOfChars: number) {
    return this.#chars.slice(this.#index + 1, this.#index + 1 + numberOfChars);
  }

  peekBack(): string {
    return this.#chars[this.#index - 1];
  }
}
