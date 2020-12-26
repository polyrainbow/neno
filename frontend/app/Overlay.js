import React from "react";

const Overlay = ({ children, onClick }) => {
  return <div
    onClick={onClick}
    id="overlay"
    style={{
      "position": "fixed",
      "width": "100vw",
      "height": "100vh",
      "background":
        "linear-gradient(45deg, rgba(2,0,36,1) 0%, "
        + "rgba(9,9,121,0.5) 35%, rgba(0,212,255,1) 100%)",
      "display": "grid",
      "alignItems": "center",
      "zIndex": "100",
    }}
  >
    {children}
  </div>;
};

export default Overlay;
