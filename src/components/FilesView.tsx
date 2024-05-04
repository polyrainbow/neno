import { useState, useEffect } from "react";
import FilesViewPreviewBox from "./FilesViewPreviewBox";
import { l } from "../lib/intl";
import { FileInfo } from "../lib/notes/types/FileInfo";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import useNotesProvider from "../hooks/useNotesProvider";
import { Slug } from "../lib/notes/types/Slug";
import CreateScript from "./CreateScript";

enum FileSortMode {
  CREATED_AT_DESCENDING = "CREATED_AT_DESCENDING",
  CREATED_AT_ASCENDING = "CREATED_AT_ASCENDING",
  NAME_ASCENDING = "NAME_ASCENDING",
  NAME_DESCENDING = "NAME_DESCENDING",
  SIZE_ASCENDING = "SIZE_ASCENDING",
  SIZE_DESCENDING = "SIZE_DESCENDING",
}

const FilesView = () => {
  const notesProvider = useNotesProvider();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filterInput, setFilterInput] = useState<string>("");
  const [danglingFileSlugs, setDanglingFileSlugs] = useState<Slug[]>([]);
  const [sortMode, setSortMode] = useState<FileSortMode>(
    FileSortMode.CREATED_AT_DESCENDING,
  );
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFiles: FileInfo[]
      = await notesProvider.getDanglingFiles();

    setDanglingFileSlugs(danglingFiles.map((file) => file.slug));
  };

  const displayedFiles = files
    .filter((file) => file.slug.toLowerCase().startsWith(
      filterInput.toLowerCase(),
    ))
    .toSorted((a, b): number => {
      if (sortMode === FileSortMode.CREATED_AT_DESCENDING) {
        return b.createdAt - a.createdAt;
      } else if (sortMode === FileSortMode.CREATED_AT_ASCENDING) {
        return a.createdAt - b.createdAt;
      } else if (sortMode === FileSortMode.NAME_ASCENDING) {
        if (a.slug.toLowerCase() < b.slug.toLowerCase()) return -1;
        if (a.slug.toLowerCase() > b.slug.toLowerCase()) return 1;
        return 0;
      } else if (sortMode === FileSortMode.NAME_DESCENDING) {
        if (a.slug.toLowerCase() < b.slug.toLowerCase()) return 1;
        if (a.slug.toLowerCase() > b.slug.toLowerCase()) return -1;
        return 0;
      } else if (sortMode === FileSortMode.SIZE_DESCENDING) {
        return b.size - a.size;
      } else if (sortMode === FileSortMode.SIZE_ASCENDING) {
        return a.size - b.size;
      } else {
        return 0;
      }
    });

  const updateFiles = async () => {
    const files: FileInfo[] = await notesProvider.getFiles();
    setFiles(files);
    await updateDanglingFiles();
    setStatus("READY");
  };

  useEffect(() => {
    if (!notesProvider) return;
    updateFiles();
  }, [notesProvider]);

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide files-view">
      {
        status === "READY"
          ? <>
            <h1>{l(
              "files.files-heading",
              { numberOfFiles: files.length.toString() },
            )}</h1>
            <div
              className="controls"
            >
              <select
                onChange={(e) => setSortMode(e.target.value as FileSortMode)}
              >
                <option
                  value={FileSortMode.CREATED_AT_DESCENDING}
                >{l("files.sort-mode.created-at.descending")}</option>
                <option
                  value={FileSortMode.CREATED_AT_ASCENDING}
                >{l("files.sort-mode.created-at.ascending")}</option>
                <option
                  value={FileSortMode.NAME_ASCENDING}
                >{l("files.sort-mode.name.ascending")}</option>
                <option
                  value={FileSortMode.NAME_DESCENDING}
                >{l("files.sort-mode.name.descending")}</option>
                <option
                  value={FileSortMode.SIZE_ASCENDING}
                >{l("files.sort-mode.size.ascending")}</option>
                <option
                  value={FileSortMode.SIZE_DESCENDING}
                >{l("files.sort-mode.size.descending")}</option>
              </select>
              <input
                className="filter"
                type="search"
                placeholder={l("files.filter")}
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
              />
              <button
                className="default-button-small"
                onClick={() => setFilterInput("scripts/")}
              >
                {l("files.show-neno-scripts")}
              </button>
            </div>
            <FlexContainer
              className="files"
            >
              {displayedFiles.map((file) => {
                return <FilesViewPreviewBox
                  file={file}
                  key={"img_" + file.slug}
                  isDangling={danglingFileSlugs.includes(file.slug)}
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
  </>;
};

export default FilesView;
