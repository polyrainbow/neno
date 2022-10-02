import React from "react";
import { l } from "../lib/intl";

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


const SearchPresetDialogPreset = ({
  label,
  query,
  onClick,
}) => {
  return <p>
    <button
      onClick={onClick}
      className="small-button dialog-box-button"
    >{query}</button>
    {label}
  </p>;
};


const SearchPresets = ({
  onSelect,
}) => {
  const searchPresets = DEFAULT_SEARCH_PRESETS;

  return <section
    id="section_list"
  >
    <h1>{l("list.search.presets")}</h1>
    {
      searchPresets.map((preset) => {
        return <SearchPresetDialogPreset
          key={preset.query + "__" + preset.label}
          onClick={() => onSelect(preset.query)}
          label={preset.label}
          query={preset.query}
        />;
      })
    }
  </section>;
};

export default SearchPresets;
