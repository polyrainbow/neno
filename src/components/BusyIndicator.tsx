import { ASSETS_PATH } from "../config";

interface BusyIndicatorProps {
  alt: string,
}

const BusyIndicator = ({
  alt,
}: BusyIndicatorProps) => {
  return <img
    src={ASSETS_PATH + "busy.svg"}
    alt={alt}
    className="busy-indicator"
  />;
};

export default BusyIndicator;
