import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ChangeLanguageSetting from "./ChangeLanguageSetting";
import GitConfigSetting from "./GitConfigSetting";
import EnableGitSetting from "./EnableGitSetting";
import NavigationRail from "./NavigationRail";
import AutoSyncSetting from "./AutoSyncSetting";
import useGitEnabled from "../hooks/useGitEnabled";
import { isElectron } from "../lib/electron/bridge";


const SettingsView = () => {
  const gitEnabled = useGitEnabled();
  return <div className="view">
    <NavigationRail activeView="settings" />
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <ChangeLanguageSetting />
      {/* git runs in the desktop app's main process; OPFS mode has none. */}
      {isElectron() && !gitEnabled && <EnableGitSetting />}
      {isElectron() && gitEnabled && <GitConfigSetting />}
      {isElectron() && gitEnabled && <AutoSyncSetting />}
    </section>
  </div>;
};

export default SettingsView;
