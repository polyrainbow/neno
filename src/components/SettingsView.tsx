import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ChangeLanguageSetting from "./ChangeLanguageSetting";
import GitConfigSetting from "./GitConfigSetting";
import NavigationRail from "./NavigationRail";


const SettingsView = () => {
  return <div className="view">
    <NavigationRail activeView="settings" />
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <ChangeLanguageSetting />
      <GitConfigSetting />
    </section>
  </div>;
};

export default SettingsView;
