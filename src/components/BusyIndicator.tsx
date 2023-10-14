import { ASSETS_PATH } from "../config";

interface BusyIndicatorProps {
  alt: string,
  height: number,
}

const BusyIndicator = ({
  alt,
  height,
}: BusyIndicatorProps) => {
  return <img
    src={ASSETS_PATH + "busy.svg"}
    alt={alt}
    height={height}
  />;
};

export default BusyIndicator;
