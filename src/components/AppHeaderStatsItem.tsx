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
      className="app-header-stats-item"
    ><Icon icon={icon} size={24} title={label}/> {value}</div>
  </Tooltip>;
};


export default AppHeaderStatsItem;
