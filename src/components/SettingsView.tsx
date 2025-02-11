import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import { l } from "../lib/intl";
import ChangeLanguageSetting from "./ChangeLanguageSetting";


const SettingsView = () => {
  return <>
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <h1>{l("settings")}</h1>
      <ChangeLanguageSetting />
    </section>
  </>;
};

export default SettingsView;
