import { ASSETS_PATH } from "../config";
import React from "react";

const BusyIndicator = ({
  alt,
  height,
}) => {
  return <img
    src={ASSETS_PATH + "busy.svg"}
    alt={alt}
    height={height}
  />;
};

export default BusyIndicator;
