import React from "react";

const Overlay = ({ children, onClick }) => {
  return <div
    onClick={onClick}
    id="overlay"
  >
    {children}
  </div>;
};

export default Overlay;
