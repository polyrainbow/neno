import React from "react";

const FlexContainer = (props) => {
  return <div
    onClick={props.onClick}
    className={
      "flex-container"
      + (props.className ? " " + props.className : "")
      + (props.centerAlignedItems ? " center-aligned-items" : "")
    }
  >
    {props.children}
  </div>;
};

export default FlexContainer;
