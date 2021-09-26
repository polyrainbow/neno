import React from "react";
import Overlay from "./Overlay";

const Dialog = ({
  children,
  onClickOnOverlay,
  className = "",
}) => {
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
