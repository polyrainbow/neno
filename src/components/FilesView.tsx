import { useState, useEffect, useRef } from "react";
import FilesViewPreviewBox from "./FilesViewPreviewBox";
import { l } from "../lib/intl";
import { FileInfo } from "../lib/notes/types/FileInfo";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import useNotesProvider from "../hooks/useNotesProvider";
import { Slug } from "../lib/notes/types/Slug";
import Pagination from "./Pagination";
import { DEFAULT_DOCUMENT_TITLE, SEARCH_RESULTS_PER_PAGE } from "../config";
import { getPagedMatches } from "../lib/utils";
import { getCompareKeyForTimestamp } from "../lib/notes/utils";
import NavigationRail from "./NavigationRail";
import AppHeaderStatsItem from "./AppHeaderStatsItem";
import BusyIndicator from "./BusyIndicator";

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
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLElement | null>(null);

  const updateDanglingFiles = async () => {
    const slugsOfDanglingFiles: Slug[]
      = await notesProvider.getSlugsOfDanglingFiles();

    setDanglingFileSlugs(slugsOfDanglingFiles);
  };

  const filteredFiles = files
    .filter((file) => {
      if (filterInput.startsWith("ends-with:")) {
        const suffix = filterInput.substring("ends-with:".length);
        return file.slug.toLowerCase().endsWith(suffix);
      } else {
        return file.slug.toLowerCase().startsWith(
          filterInput.toLowerCase(),
        );
      }
    })
    .toSorted((a, b): number => {
      if (sortMode === FileSortMode.CREATED_AT_DESCENDING) {
        return getCompareKeyForTimestamp(b.createdAt)
          - getCompareKeyForTimestamp(a.createdAt);
      } else if (sortMode === FileSortMode.CREATED_AT_ASCENDING) {
        return getCompareKeyForTimestamp(a.createdAt)
          - getCompareKeyForTimestamp(b.createdAt);
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

  const displayedFiles = getPagedMatches(
    filteredFiles, page, SEARCH_RESULTS_PER_PAGE,
  );

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = 0;
  }, [page]);

  useEffect(() => {
    const documentTitle = l("menu.files");

    if (document.title !== documentTitle) {
      document.title = documentTitle;
    }

    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, []);

  return <div className="view">
    <NavigationRail activeView="files" />
    <HeaderContainerLeftRight
      leftContent={<>
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
          onChange={(e) => {
            setFilterInput(e.target.value);
            setPage(1);
          }}
        />
      </>
      }
      rightContent={
        <div className="stats-container">
          {
            status === "READY"
              ? <div className="header-stats">
                <AppHeaderStatsItem
                  icon={"note"}
                  label={l(
                    "files.files-heading",
                    { numberOfFiles: files.length.toString() },
                  )}
                  value={files.length.toLocaleString()}
                />
                <AppHeaderStatsItem
                  icon={"link_off"}
                  label={l(
                    "files.files-heading",
                    { numberOfFiles: files.length.toString() },
                  )}
                  value={danglingFileSlugs.length.toLocaleString()}
                />
              </div>
              : <BusyIndicator alt={l("app.loading")} />
          }
        </div>
      }
    />
    <section
      className="content-section-wide files-view"
      ref={containerRef}
    >
      {
        status === "READY"
          ? <>
            <Pagination
              numberOfResults={filteredFiles.length}
              page={page}
              searchResultsPerPage={SEARCH_RESULTS_PER_PAGE}
              onChange={(newPage) => setPage(newPage)}
            />
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
            <Pagination
              numberOfResults={filteredFiles.length}
              page={page}
              searchResultsPerPage={SEARCH_RESULTS_PER_PAGE}
              onChange={(newPage) => setPage(newPage)}
            />
          </>
          : <p>{l("files.fetching")}</p>
      }
    </section>
  </div>;
};

export default FilesView;
