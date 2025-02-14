import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ChangeLanguageSetting from "./ChangeLanguageSetting";
import NavigationRail from "./NavigationRail";


const SettingsView = () => {
  return <div className="view">
    <NavigationRail activeView="settings" />
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <ChangeLanguageSetting />
    </section>
  </div>;
};

export default SettingsView;
