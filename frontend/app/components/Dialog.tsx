import React from "react";
import Overlay from "./Overlay";

const Dialog = (props) => {
  const {
    children,
    onClickOnOverlay,
    className = "",
  } = props;

  return <Overlay
    onClick={onClickOnOverlay}
  >
    <div
      className={"dialog-box " + className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </Overlay>;
};

export default Dialog;
