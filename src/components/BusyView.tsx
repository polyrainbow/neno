import { l } from "../lib/intl";
import BusyIndicator from "./BusyIndicator";

const BusyView = () => {
  return <div className="busy-view">
    <BusyIndicator alt={l("app.loading")} />
  </div>;
};

export default BusyView;
