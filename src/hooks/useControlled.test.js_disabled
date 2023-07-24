/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

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

/* eslint-disable max-len */

import * as React from "react";
import { expect } from "chai";
import { act, createRenderer } from "test/utils";
import useControlled from "./useControlled";

const TestComponent = ({ value: valueProp, defaultValue, children }) => {
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: "TestComponent",
  });
  return children({ value, setValue });
};

describe("useControlled", () => {
  const { render } = createRenderer();

  it("works correctly when is not controlled", () => {
    let valueState;
    let setValueState;
    render(
      <TestComponent defaultValue={1}>
        {({ value, setValue }) => {
          valueState = value;
          setValueState = setValue;
          return null;
        }}
      </TestComponent>,
    );
    expect(valueState).to.equal(1);

    act(() => {
      setValueState(2);
    });

    expect(valueState).to.equal(2);
  });

  it("works correctly when is controlled", () => {
    let valueState;
    render(
      <TestComponent value={1}>
        {({ value }) => {
          valueState = value;
          return null;
        }}
      </TestComponent>,
    );
    expect(valueState).to.equal(1);
  });

  it("warns when switching from uncontrolled to controlled", () => {
    let setProps;
    expect(() => {
      ({ setProps } = render(<TestComponent>{() => null}</TestComponent>));
    }).not.toErrorDev();

    expect(() => {
      setProps({ value: "foobar" });
    }).toErrorDev(
      "MUI: A component is changing the uncontrolled value state of TestComponent to be controlled.",
    );
  });

  it("warns when switching from controlled to uncontrolled", () => {
    let setProps;

    expect(() => {
      ({ setProps } = render(<TestComponent value="foobar">{() => null}</TestComponent>));
    }).not.toErrorDev();

    expect(() => {
      setProps({ value: undefined });
    }).toErrorDev(
      "MUI: A component is changing the controlled value state of TestComponent to be uncontrolled.",
    );
  });

  it("warns when changing the defaultValue prop after initial rendering", () => {
    let setProps;

    expect(() => {
      ({ setProps } = render(<TestComponent>{() => null}</TestComponent>));
    }).not.toErrorDev();

    expect(() => {
      setProps({ defaultValue: 1 });
    }).toErrorDev(
      "MUI: A component is changing the default value state of an uncontrolled TestComponent after being initialized.",
    );
  });

  it("should not raise a warning if changing the defaultValue when controlled", () => {
    let setProps;

    expect(() => {
      ({ setProps } = render(
        <TestComponent value={1} defaultValue={0}>
          {() => null}
        </TestComponent>,
      ));
    }).not.toErrorDev();

    expect(() => {
      setProps({ defaultValue: 1 });
    }).not.toErrorDev();
  });
});
