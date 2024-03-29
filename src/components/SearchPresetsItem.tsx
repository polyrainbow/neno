import { l } from "../lib/intl";

interface SearchPresetsItemProps {
  label: string;
  query: string;
  onClick: () => void;
  onDelete: () => void;
}

const SearchPresetsItem = ({
  label,
  query,
  onClick,
  onDelete,
}: SearchPresetsItemProps) => {
  return <div
    className="search-preset"
  >
    <span>
      {label}<br /><code>{query}</code>
    </span>
    <div
      className="search-preset-buttons"
    >
      <button
        onClick={onClick}
        className="default-button-small dialog-box-button default-action"
      >{l("list.search.presets.find")}</button>
      <button
        onClick={onDelete}
        className="default-button-small dialog-box-button dangerous-action"
      >{l("list.search.presets.remove")}</button>
    </div>
  </div>;
};

export default SearchPresetsItem;
