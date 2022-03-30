import React from "react";

const Overlay = (props) => {
  return <div
    onClick={props.onClick}
    id="overlay"
  >
    {props.children}
  </div>;
};

export default Overlay;
