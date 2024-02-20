import SearchInput from "./SearchInput";
import IconButton from "./IconButton";
import { l } from "../lib/intl";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { NoteListSortMode } from "../lib/notes/types/NoteListSortMode";
import { NoteListView } from "./NoteListWithControls";

interface NoteListControlsProps {
  value: string,
  onChange: (value: string) => void,
  sortMode: string,
  setSortMode: (sortMode: NoteListSortMode) => void,
  view: string,
  setView: (view: NoteListView) => void,
}

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  view,
  setView,
}: NoteListControlsProps) => {
  const isSmallScreen = useIsSmallScreen();

  return <section
    className="note-list-controls"
  >
    <SearchInput
      placeholder={l("list.search.placeholder")}
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
    <IconButton
      id="button_show-search-presets"
      title={l("list.search.presets")}
      icon="saved_search"
      onClick={() => {
        setView(
          view === NoteListView.SEARCH_PRESETS
            ? NoteListView.DEFAULT
            : NoteListView.SEARCH_PRESETS,
        );
      }}
    />
    <select
      className="note-list-sort-mode-select"
      value={sortMode}
      onChange={(e) => setSortMode(e.target.value as NoteListSortMode)}
    >
      <option
        value={NoteListSortMode.CREATION_DATE_ASCENDING}
      >{l("list.sort-mode.creation-date-ascending")}</option>
      <option
        value={NoteListSortMode.CREATION_DATE_DESCENDING}
      >{l("list.sort-mode.creation-date-descending")}</option>
      <option
        value={NoteListSortMode.UPDATE_DATE_ASCENDING}
      >{l("list.sort-mode.update-date-ascending")}</option>
      <option
        value={NoteListSortMode.UPDATE_DATE_DESCENDING}
      >{l("list.sort-mode.update-date-descending")}</option>
      <option
        value={NoteListSortMode.TITLE_ASCENDING}
      >{l("list.sort-mode.title-a-z")}</option>
      <option
        value={NoteListSortMode.TITLE_DESCENDING}
      >{l("list.sort-mode.title-z-a")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_LINKS_ASCENDING}
      >{l("list.sort-mode.number-of-links-ascending")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_LINKS_DESCENDING}
      >{l("list.sort-mode.number-of-links-descending")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_FILES_ASCENDING}
      >{l("list.sort-mode.number-of-files-ascending")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_FILES_DESCENDING}
      >{l("list.sort-mode.number-of-files-descending")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING}
      >{l("list.sort-mode.number-of-chars-ascending")}</option>
      <option
        value={NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING}
      >{l("list.sort-mode.number-of-chars-descending")}</option>
    </select>
  </section>;
};

export default NoteListControls;
