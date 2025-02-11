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
    aria-label={label}
  ><Icon icon={icon} /> {value}</div>;
};


export default AppHeaderStatsItem;
