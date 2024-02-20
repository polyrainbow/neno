/* eslint-disable @stylistic/max-len */
/*
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

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

import {
  AutoLinkPlugin,
  createLinkMatcherWithRegExp,
} from "./LexicalAutoLinkPlugin";

// Longest TLD I have found was .international with 13 chars
// Let's allow commas in path for scroll-to-text fragments like
// #:~:text=Hey,there.
const URL_REGEX
  = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,13}\b([-a-zA-Z0-9()@:%_+.~#!?&//=,;']*)/;

const EMAIL_REGEX
  = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

// TODO: Align all regexes re. slashlink and slugs
const SLASHLINK_REGEX
  = /(@[\p{L}\p{M}\d\-_/]+)?(\/[\p{L}\p{M}\d\-_:.]+)+/u;

const MATCHERS = [
  createLinkMatcherWithRegExp(
    URL_REGEX,
    (text) => {
      return text.startsWith("http") ? text : `https://${text}`;
    },
    {
      rel: "noopener noreferrer",
    },
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`;
  }),
  createLinkMatcherWithRegExp(SLASHLINK_REGEX, (text) => {
    return "#" + text.substring(1);
  }),
];

export default function LexicalAutoLinkPlugin(): JSX.Element {
  return <AutoLinkPlugin matchers={MATCHERS} />;
}
