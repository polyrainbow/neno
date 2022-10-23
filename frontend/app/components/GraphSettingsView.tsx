import React from "react";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useGraphId from "../hooks/useGraphId";
import ExportDatabaseSetting from "./ExportDatabaseSetting";
import CreateOneNotePerLineTool from "./CreateOneNotePerLineTool";
import { l } from "../lib/intl";


const GraphSettingsView = () => {
  const graphId = useGraphId();

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <h1>{l("graph-settings.for", { graphId })}</h1>
      <ExportDatabaseSetting />
      <CreateOneNotePerLineTool />
    </section>
  </>;
};

export default GraphSettingsView;
