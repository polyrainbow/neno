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
    return done
      ? {
        done,
        value: null,
      }
      : {
        done,
        value: this.#chars[this.#index],
      };
  }

  peek(numberOfChars: number) {
    return this.#chars.slice(this.#index + 1, this.#index + 1 + numberOfChars);
  }

  peekBack(numberOfChars?: number): string {
    return this.#chars[this.#index - (numberOfChars ?? 1)];
  }

  getRest(): string {
    return this.#chars.slice(this.#index).join("");
  }

  charsUntil(delimiter: string, offset?: number): string | null {
    const stringToAnalyse
      = this.#chars.slice(this.#index + (offset ?? 0)).join("");
    const delimiterIndex = stringToAnalyse.indexOf(delimiter, 0);

    if (delimiterIndex === -1) {
      return null;
    }

    const charsUntilDelimiter = stringToAnalyse
      .slice(this.#index, delimiterIndex);
    return charsUntilDelimiter;
  }
}
