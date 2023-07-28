import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import { l } from "../lib/intl";
import ChangeLanguageSetting from "./ChangeLanguageSetting";


const GraphSettingsView = () => {
  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <h1>{l("settings")}</h1>
      <ChangeLanguageSetting />
    </section>
  </>;
};

export default GraphSettingsView;
