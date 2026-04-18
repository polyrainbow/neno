import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ChangeLanguageSetting from "./ChangeLanguageSetting";
import GitConfigSetting from "./GitConfigSetting";
import EnableGitSetting from "./EnableGitSetting";
import NavigationRail from "./NavigationRail";
import useGitEnabled from "../hooks/useGitEnabled";


const SettingsView = () => {
  const gitEnabled = useGitEnabled();
  return <div className="view">
    <NavigationRail activeView="settings" />
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <ChangeLanguageSetting />
      {gitEnabled ? <GitConfigSetting /> : <EnableGitSetting />}
    </section>
  </div>;
};

export default SettingsView;
