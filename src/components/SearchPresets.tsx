import { useEffect, useState } from "react";
import { l } from "../lib/intl";
import * as IDB from "idb-keyval";

interface SearchPreset {
  label: string,
  query: string,
}


const DEFAULT_SEARCH_PRESETS: SearchPreset[] = [
  {
    "label": l("list.search.presets.untitled-notes"),
    "query": "exact:",
  },
  {
    "label": l("list.search.presets.notes-with-duplicate-titles"),
    "query": "duplicates:title",
  },
  {
    "label": l("list.search.presets.notes-with-duplicate-urls"),
    "query": "duplicates:url",
  },
  {
    "label": l("list.search.presets.notes-with-audio"),
    "query": "has-media:audio",
  },
  {
    "label": l("list.search.presets.notes-with-video"),
    "query": "has-media:video",
  },
  {
    "label": l("list.search.presets.notes-with-pdfs"),
    "query": "has-media:pdf",
  },
  {
    "label": l("list.search.presets.notes-with-images"),
    "query": "has-media:image",
  },
  {
    "label": l("list.search.presets.has-list"),
    "query": "has-block:list",
  },
  {
    "label": l("list.search.presets.has-custom-metadata"),
    "query": "has:custom-metadata",
  },
];


const SearchPresetItem = ({
  label,
  query,
  onClick,
  onDelete,
}) => {
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
      >{l("list.search.presets.query")}</button>
      <button
        onClick={onDelete}
        className="default-button-small dialog-box-button dangerous-action"
      >{l("list.search.presets.remove")}</button>
    </div>
  </div>;
};


const SearchPresets = ({
  onSelect,
  currentQuery,
}) => {
  const [searchPresets, setSearchPresets] = useState<SearchPreset[]>([]);
  const [currentQueryLabel, setCurrentQueryLabel] = useState<string>("");

  useEffect(() => {
    IDB.get("SEARCH_PRESETS")
      .then((searchPresets) => {
        setSearchPresets(searchPresets || DEFAULT_SEARCH_PRESETS);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }, []);

  const setSearchPresetsPersistently = async (searchPresets) => {
    setSearchPresets(searchPresets);
    await IDB.set("SEARCH_PRESETS", searchPresets);
  };

  return <section
    className="list-section"
  >
    <h1>{l("list.search.presets")}</h1>
    {
      searchPresets.map((preset) => {
        return <SearchPresetItem
          key={preset.query + "__" + preset.label}
          onClick={() => onSelect(preset.query)}
          label={preset.label}
          query={preset.query}
          onDelete={() => {
            setSearchPresetsPersistently(
              searchPresets.filter((p) => p.query !== preset.query),
            );
          }}
        />;
      })
    }
    {
      currentQuery.trim().length > 2
        ? <div className="save-current-query">
          <h2>{l("list.search.presets.save-current-query")}</h2>
          <input
            id="search-preset-name-input"
            type="text"
            placeholder={l("list.search.presets.preset-name")}
            onInput={(e) => {
              setCurrentQueryLabel((e.target as HTMLInputElement).value);
            }}
          ></input>
          <button
            onClick={() => setSearchPresetsPersistently([...searchPresets, {
              query: currentQuery,
              label: currentQueryLabel,
            }])}
            className="default-button-small default-action"
          >{l("list.search.presets.save")}</button>
        </div>
        : ""
    }
    <div>
      <button
        onClick={() => setSearchPresetsPersistently(DEFAULT_SEARCH_PRESETS)}
        className="default-button dangerous-action"
      >{l("list.search.presets.reset-to-defaults")}</button>
    </div>
  </section>;
};

export default SearchPresets;
