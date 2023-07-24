import SearchInput from "./SearchInput";
import IconButton from "./IconButton";
import { l } from "../lib/intl";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import FlexContainer from "./FlexContainer";

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  view,
  setView,
  refreshNoteList,
}) => {
  const isSmallScreen = useIsSmallScreen();

  return <section
    className="note-list-controls"
  >
    <FlexContainer centerAlignedItems>
      <SearchInput
        placeholder={l("list.search.placeholder")}
        value={value}
        onChange={onChange}
        inputStyle={{
          width: isSmallScreen ? "auto" : "250px",
        }}
      />
      <IconButton
        id="button_show-search-presets"
        title={l("list.search.presets")}
        icon="saved_search"
        onClick={() => {
          setView(
            view === "search-presets"
              ? "note-list"
              : "search-presets",
          );
        }}
      />
      {
        !isSmallScreen
          ? <IconButton
            id="button_refresh-note-list"
            title={l("list.refresh")}
            icon="refresh"
            onClick={refreshNoteList}
          />
          : ""
      }
    </FlexContainer>
    <FlexContainer centerAlignedItems>
      <select
        className="note-list-sort-mode-select"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value)}
      >
        <option
          value="CREATION_DATE_ASCENDING"
        >{l("list.sort-mode.creation-date-ascending")}</option>
        <option
          value="CREATION_DATE_DESCENDING"
        >{l("list.sort-mode.creation-date-descending")}</option>
        <option
          value="UPDATE_DATE_ASCENDING"
        >{l("list.sort-mode.update-date-ascending")}</option>
        <option
          value="UPDATE_DATE_DESCENDING"
        >{l("list.sort-mode.update-date-descending")}</option>
        <option
          value="TITLE_ASCENDING"
        >{l("list.sort-mode.title-a-z")}</option>
        <option
          value="TITLE_DESCENDING"
        >{l("list.sort-mode.title-z-a")}</option>
        <option
          value="NUMBER_OF_LINKS_ASCENDING"
        >{l("list.sort-mode.number-of-links-ascending")}</option>
        <option
          value="NUMBER_OF_LINKS_DESCENDING"
        >{l("list.sort-mode.number-of-links-descending")}</option>
        <option
          value="NUMBER_OF_FILES_ASCENDING"
        >{l("list.sort-mode.number-of-files-ascending")}</option>
        <option
          value="NUMBER_OF_FILES_DESCENDING"
        >{l("list.sort-mode.number-of-files-descending")}</option>
        <option
          value="NUMBER_OF_CHARACTERS_ASCENDING"
        >{l("list.sort-mode.number-of-chars-ascending")}</option>
        <option
          value="NUMBER_OF_CHARACTERS_DESCENDING"
        >{l("list.sort-mode.number-of-chars-descending")}</option>
      </select>
    </FlexContainer>
  </section>;
};

export default NoteListControls;
