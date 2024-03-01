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
  return <div
    className="app-header-stats-item"
    title={label}
  ><Icon icon={icon} size={24} title={label}/> {value}</div>;
};


export default AppHeaderStatsItem;
