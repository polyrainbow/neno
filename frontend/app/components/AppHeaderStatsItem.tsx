import React from "react";
import Tooltip from "./Tooltip";
import Icon from "./Icon";

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
