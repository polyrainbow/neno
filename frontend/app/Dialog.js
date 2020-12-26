import React from "react";
import Overlay from "./Overlay.js";

const Dialog = ({
  children,
  onClickOnOverlay,
  className,
}) => {
  return <Overlay
    onClick={onClickOnOverlay}
  >
    <div
      style={{
        "width": "400px",
        "display": "block",
        "padding": "20px",
        "margin": "auto",
      }}
      className={"dialog-box " + className}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </Overlay>;
};

export default Dialog;
