import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import { l } from "../lib/intl";
import ChangeLanguageSetting from "./ChangeLanguageSetting";


const SettingsView = () => {
  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <h1>{l("settings")}</h1>
      <ChangeLanguageSetting />
    </section>
  </>;
};

export default SettingsView;
