import React, { useEffect, useRef } from "react";

/**
 * @param {Object} ref
 * @param {Object} callback
 */
function useOutsideAlerter(ref, callback) {
  /**
   * Alert if clicked on outside of element
   * @param {Object} event
   */
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (typeof callback === "function") {
        callback();
      }
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
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
    className="outsideAlerter"
    style={{
      "display": "flex",
      "justifyContent": "inherit",
      "textTransform": "none",
      "whiteSpace": "normal",
    }}
  >{props.children}</div>;
}

export default OutsideAlerter;
