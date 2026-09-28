import { l } from "../lib/intl";
import { isElectron } from "../lib/electron/bridge";
import useHistoryNavigation from "../hooks/useHistoryNavigation";
import IconButton from "./IconButton";

/*
  In a browser the browser's own buttons do this job, so the component
  renders nothing there.
*/
const HistoryNavigationButtons = () => {
  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
  } = useHistoryNavigation();

  if (!isElectron()) return null;

  return <div className="history-navigation-buttons">
    <IconButton
      onClick={goBack}
      icon="arrow_back"
      title={l("app.back-button.alt")}
      disabled={!canGoBack}
      disableTooltip={true}
    />
    <IconButton
      onClick={goForward}
      icon="arrow_forward"
      title={l("app.forward-button.alt")}
      disabled={!canGoForward}
      disableTooltip={true}
    />
  </div>;
};

export default HistoryNavigationButtons;
