import { getIconSrc } from "../lib/utils";

interface IconProps {
  icon: string,
}

const Icon = ({
  icon,
}: IconProps) => {
  return <img
    src={getIconSrc(icon)}
    alt=""
    className="svg-icon"
    aria-hidden="true"
  />;
};

export default Icon;
