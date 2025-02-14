import { useState, useEffect } from "react";
import { l } from "../lib/intl";
import { FileInfo } from "../lib/notes/types/FileInfo";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import useNotesProvider from "../hooks/useNotesProvider";
import CreateScript from "./CreateScript";
import { getCompareKeyForTimestamp } from "../lib/notes/utils";
import NavigationRail from "./NavigationRail";
import AppHeaderStatsItem from "./AppHeaderStatsItem";
import BusyIndicator from "./BusyIndicator";
import ScriptsViewItem from "./ScriptsViewItem";
import useConfirm from "../hooks/useConfirm";

const ScriptsView = () => {
  const notesProvider = useNotesProvider();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [scripts, setScripts] = useState<FileInfo[]>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");
  const confirm = useConfirm();

  const updateFiles = async () => {
    const files: FileInfo[] = await notesProvider.getFiles();
    setFiles(files);
    const scripts = files
      .filter((file) => {
        return file.slug.toLowerCase().endsWith(".neno.js");
      })
      .toSorted((a, b): number => {
        return getCompareKeyForTimestamp(b.createdAt)
          - getCompareKeyForTimestamp(a.createdAt);
      });
    setScripts(scripts);
    setStatus("READY");
  };

  useEffect(() => {
    if (!notesProvider) return;
    updateFiles();
  }, [notesProvider]);

  return <div className="view">
    <NavigationRail activeView="scripting" />
    <HeaderContainerLeftRight
      rightContent={
        <div className="stats-container">
          {
            status === "READY"
              ? <div className="header-stats">
                <AppHeaderStatsItem
                  icon={"note"}
                  label={l(
                    "scripts.number-of-scripts",
                    { numberOfScripts: scripts.length.toString() },
                  )}
                  value={scripts.length.toLocaleString()}
                />
              </div>
              : <BusyIndicator alt={l("app.loading")} />
          }
        </div>
      }
    />
    <section className="content-section-wide scripts-view">
      {
        status === "READY"
          ? <>
            <FlexContainer
              className="scripts"
            >
              {scripts.map((script) => {
                return <ScriptsViewItem
                  file={script}
                  key={"svi_" + script.slug}
                  onDelete={async () => {
                    await confirm({
                      text: l("files.confirm-delete"),
                      confirmText: l("files.confirm-delete.confirm"),
                      cancelText: l("dialog.cancel"),
                      encourageConfirmation: false,
                    });

                    await notesProvider.deleteFile(script.slug);
                  }}
                />;
              })}
            </FlexContainer>
            <CreateScript
              existingFiles={files}
              onCreated={() => updateFiles()}
            />
          </>
          : <p>{l("files.fetching")}</p>
      }
    </section>
  </div>;
};

export default ScriptsView;
