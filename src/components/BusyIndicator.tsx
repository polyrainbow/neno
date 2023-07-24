import { ASSETS_PATH } from "../config";

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
