import { l } from "../lib/intl";
import IconButton from "./IconButton";


interface AppMenuToggleProps {
  toggleAppMenu: () => void,
}


const AppMenuToggle = ({ toggleAppMenu }: AppMenuToggleProps) => {
  return <IconButton
    onClick={toggleAppMenu}
    icon="menu"
    title={l("app.menu-button.alt")}
    disableTooltip={true}
  />;
};

export default AppMenuToggle;
