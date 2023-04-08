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
    <dialog
      className={"dialog-box " + className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </dialog>
  </Overlay>;
};

export default Dialog;
