export default class CharIterator {
  #chars;
  #index;

  constructor(input: string) {
    this.#chars = Array.from(input);
    this.#index = -1;
  }

  next() {
    this.#index++;
    return {
      done: this.#index === this.#chars.length,
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
