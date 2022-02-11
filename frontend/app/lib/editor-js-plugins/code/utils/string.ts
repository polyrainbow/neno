/*
@license

MIT License

Copyright (c) 2018 CodeX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Return the position of line starting from passed point
 *
 * ┌───────────────┐
 * │1234\n         │
 * │2eda | dadd\n  │ <-- returns 5
 * └───────────────┘
 *
 * @param {string} string - string to process
 * @param {number} position - search starting position
 * @return {number}
 */
export function getLineStartPosition(string, position) {
  const charLength = 1;
  let char = "";

  /**
   * Iterate through all the chars before the position till the
   * - end of line (\n)
   * - or start of string (position === 0)
   */
  while (char !== "\n" && position > 0) {
    position = position - charLength;
    char = string.substring(position, position + charLength);
  }

  /**
   * Do not count the linebreak symbol because it is related to the previous
   * line
   */
  if (char === "\n") {
    position += 1;
  }

  return position;
}
