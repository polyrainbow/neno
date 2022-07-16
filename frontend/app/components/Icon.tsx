import React from "react";
import { getIconSrc } from "../lib/utils";

interface IconProps {
  icon: string,
  title: string,
  size: number,
}

const Icon = ({
  icon,
  title,
  size,
}: IconProps, ref) => {
  return <img
    ref={ref}
    src={getIconSrc(icon)}
    alt={title}
    width={size.toString()}
    height={size.toString()}
    className="svg-icon"
  />;
};

export default React.forwardRef(Icon);
