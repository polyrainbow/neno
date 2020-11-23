import React from "react";

const Overlay = ({ children, onClick }) => {
  return <div
    onClick={onClick}
    id="overlay"
    style={{
      "position": "fixed",
      "width": "100vw",
      "height": "100vh",
      "background": "rgba(0, 0, 0, 0.5)",
      "display": "grid",
      "alignItems": "center",
      "zIndex": "100",
    }}
  >
    {children}
  </div>;
};

export default Overlay;
