import { l } from "../lib/intl";
import IconButton from "./IconButton";


interface AppTitleProps {
  toggleAppMenu: () => void,
}


const AppTitle = ({ toggleAppMenu }: AppTitleProps) => {
  return <IconButton
    onClick={toggleAppMenu}
    icon="menu"
    title={l("app.menu-button.alt")}
  />;
};

export default AppTitle;
