import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ChangeLanguageSetting from "./ChangeLanguageSetting";
import GitConfigSetting from "./GitConfigSetting";
import EnableGitSetting from "./EnableGitSetting";
import NavigationRail from "./NavigationRail";
import AutoSyncSetting from "./AutoSyncSetting";
import useGitEnabled from "../hooks/useGitEnabled";
import { hasNativeHost, isAndroid } from "../lib/electron/bridge";
import AndroidSshKeySetting from "./AndroidSshKeySetting";


const SettingsView = () => {
  const gitEnabled = useGitEnabled();
  return <div className="view">
    <NavigationRail activeView="settings" />
    <HeaderContainerLeftRight />
    <section className="settings-view content-section-wide">
      <ChangeLanguageSetting />
      {/* git runs in the native host (Electron main, Android); OPFS mode
        has none. */}
      {hasNativeHost() && !gitEnabled && <EnableGitSetting />}
      {hasNativeHost() && gitEnabled && <GitConfigSetting />}
      {hasNativeHost() && gitEnabled && <AutoSyncSetting />}
      {isAndroid() && <AndroidSshKeySetting />}
    </section>
  </div>;
};

export default SettingsView;
