/*
@license

MIT License

Copyright (c) 2020 CodeX

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

import { make } from "../utils.js";
import * as svgs from "./svgs.js";

/**
 * Working with Block Tunes
 */
export default class Tunes {
  api;
  actions;
  onChange;
  buttons;

  /**
   * @param {object} tune - image tool Tunes managers
   * @param {object} tune.api - Editor API
   * @param {Function} tune.onChange - tune toggling callback
   */
  constructor({ api, onChange }) {
    this.api = api;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Available Image tunes
   *
   * @return {{name: string, icon: string, title: string}[]}
   */
  static get tunes() {
    return [
      {
        name: "withBackground",
        icon: svgs.background,
        title: "With background",
      },
    ];
  }

  /**
   * Styles
   *
   * @return {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: "",
      buttonBase: this.api.styles.settingsButton,
      button: "image-tool__tune",
      buttonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @param {ImageToolData} toolData - generate Elements of tunes
   * @return {Element}
   */
  render(toolData) {
    const wrapper = make("div", [this.CSS.wrapper]);

    this.buttons = [];

    Tunes.tunes.forEach((tune) => {
      const title = tune.title;

      const el = make("div", [this.CSS.buttonBase, this.CSS.button], {
        innerHTML: tune.icon,
        title,
      });

      el.addEventListener("click", () => {
        this.tuneClicked(tune.name);
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

      this.buttons.push(el);

      this.api.tooltip.onHover(el, title, {
        placement: "top",
      });

      wrapper.appendChild(el);
    });

    return wrapper;
  }


  tuneClicked(tuneName) {
    const button = this.buttons.find((el) => el.dataset.tune === tuneName);

    button.classList.toggle(
      this.CSS.buttonActive,
      !button.classList.contains(this.CSS.buttonActive),
    );

    this.onChange(tuneName);
  }
}
