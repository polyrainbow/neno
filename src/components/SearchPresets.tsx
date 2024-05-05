import { useEffect, useState } from "react";
import { l } from "../lib/intl";
import * as IDB from "idb-keyval";
import IconButton from "./IconButton";
import SearchPresetsItem from "./SearchPresetsItem";

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
    "query": "has-block:unordered-list-item|ordered-list-item",
  },
  {
    "label": l("list.search.presets.has-custom-metadata"),
    "query": "has:custom-metadata",
  },
];


interface SearchPresetsProps {
  onSelect: (query: string) => void,
  currentQuery: string,
  onClose: () => void,
}


const SearchPresets = ({
  onSelect,
  currentQuery,
  onClose,
}: SearchPresetsProps) => {
  const [searchPresets, setSearchPresets] = useState<SearchPreset[]>([]);
  const [currentQueryLabel, setCurrentQueryLabel] = useState<string>("");

  useEffect(() => {
    IDB.get("SEARCH_PRESETS")
      .then((searchPresets) => {
        setSearchPresets(searchPresets || DEFAULT_SEARCH_PRESETS);
      })
      .catch(() => {});
  }, []);

  const setSearchPresetsPersistently = async (
    searchPresets: SearchPreset[],
  ) => {
    setSearchPresets(searchPresets);
    await IDB.set("SEARCH_PRESETS", searchPresets);
  };

  return <section
    className="search-presets"
  >
    <div className="search-presets-heading-row">
      <h1>{l("list.search.presets")}</h1>
      <IconButton
        id="close-search-presets"
        icon="close"
        title={l("close")}
        onClick={onClose}
      />
    </div>
    {
      searchPresets.map((preset) => {
        return <SearchPresetsItem
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
          <div className="save-current-query-controls">
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
