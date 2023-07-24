import { useEffect, useRef, useState } from "react";

/**
 * @param {Object} ref
 * @param {Object} callback
 */
function useOutsideAlerter(ref, callback) {
  /*
    with react 18, React now always synchronously flushes effect functions if
    the update was triggered during a discrete user input event such as a click
    or a keydown event.
    that's why the callback is already triggered when performing a user input
    that *renders* this OutsideAlerter component for the first time.
    Because of this, we need to ignore the first outside click and only handle
    the second one.

    https://reactjs.org/blog/2022/03/08/
    react-18-upgrade-guide.html#other-breaking-changes
  */
  const [
    hasAlreadyBeenTriggeredOnce,
    setHasAlreadyBeenTriggeredOnce,
  ] = useState(false);

  /**
   * Alert if clicked on outside of element
   * @param {Object} event
   */
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (typeof callback === "function") {
        if (hasAlreadyBeenTriggeredOnce) {
          callback();
        } else {
          setHasAlreadyBeenTriggeredOnce(true);
        }
      }
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  });
}

/**
 * Component that alerts if you click outside of it
 * @param {Object} props
 * @return {Object}
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.onOutsideClick);

  return <div
    ref={wrapperRef}
    className="outside-alerter"
  >{props.children}</div>;
}

export default OutsideAlerter;
