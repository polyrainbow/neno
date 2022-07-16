import React from "react";
import Tooltip from "./Tooltip.js";
import Icon from "./Icon.js";

interface AppHeaderStatsItemProps {
  icon: string,
  label: string,
  value: string,
}

const AppHeaderStatsItem = ({
  icon,
  label,
  value,
}: AppHeaderStatsItemProps) => {
  return <Tooltip
    title={label}
  >
    <div
      style={{
        "display": "flex",
        "alignItems": "center",
        "gap": "2px",
      }}
    ><Icon icon={icon} size={24} title={label}/> {value}</div>
  </Tooltip>;
};


export default AppHeaderStatsItem;
