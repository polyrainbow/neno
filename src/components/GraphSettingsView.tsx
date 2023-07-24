import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import ExportDatabaseSetting from "./ExportDatabaseSetting";
import { l } from "../lib/intl";
import { LOCAL_GRAPH_ID } from "../config";


const GraphSettingsView = () => {
  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <h1>{l("graph-settings.for", { graphId: LOCAL_GRAPH_ID })}</h1>
      <ExportDatabaseSetting />
    </section>
  </>;
};

export default GraphSettingsView;
