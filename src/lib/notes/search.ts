import NoteListItem from "./types/NoteListItem.js";
import NoteListPage from "./types/NoteListPage.js";
import DatabaseQuery from "./types/DatabaseQuery.js";
import { BlockType } from "../subwaytext/types/Block.js";
import { MediaType } from "./types/MediaType.js";
import {
  createNoteListItems,
} from "./noteUtils.js";
import {
  getNotesWithDuplicateUrls,
  getNotesThatContainTokens,
  getNotesByTitle,
  getNotesWithUrl,
  getNotesWithFile,
  getNotesWithTitleOrSlugContainingToken,
  getNotesWithBlocksOfTypes,
  getNotesWithDuplicateTitles,
  getNotesWithMediaTypes,
  getNotesWithKeyValue,
  getNotesWithCustomMetadata,
  getNotesWithFlag,
} from "./searchUtils.js";
import { NoteListSortMode } from "./types/NoteListSortMode.js";
import GraphObject from "./types/Graph.js";
import { getPagedMatches } from "../utils.js";
import * as config from "./config.js";
import CharIterator from "../subwaytext/CharIterator.js";
import { getNoteSortFunction, getSortFunction } from "./graphUtils.js";

export const isWhiteSpace = (string: string): boolean => {
  return string.trim().length === 0;
};


type SearchToken = [string, string];

const parseToken = (token: string): SearchToken => {
  // key:"some value"
  if (
    token.length > 1
    && token.indexOf(":\"") > -1
    && token.lastIndexOf("\"") === token.length - 1
  ) {
    return [
      token.substring(0, token.indexOf(":\"")),
      token.substring(token.indexOf(":\"") + 2, token.length - 1),
    ];

  // "just one value"
  } else if (token[0] === "\"" && token[token.length - 1] === "\"") {
    return [
      "",
      token.substring(1, token.length - 1),
    ];

  // key:value
  } else if (token.includes(":")) {
    const pos = token.indexOf(":");
    return [
      token.substring(0, pos),
      token.substring(pos + 1),
    ];

  // just-one-value
  } else {
    return ["", token];
  }
};


export const getRawTokensFromQueryString = (queryString: string): string[] => {
  const rawTokens: string[] = [];
  const iterator = new CharIterator(queryString);

  let mode: "token" | "whitespace" = "whitespace";
  let withinQuote = false;
  let collector = "";


  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (mode === "token") {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      }
      break;
    }

    const value = step.value;

    if (mode === "whitespace") {
      if (isWhiteSpace(value)) {
        continue;
      } else {
        if (value === "\"") {
          withinQuote = !withinQuote;
        }

        mode = "token";
        collector += value;
      }
    } else if (mode === "token") {
      if (value === "\"") {
        withinQuote = !withinQuote;
      }

      if ((!withinQuote) && isWhiteSpace(value)) {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      } else {
        collector += value;
      }
    }
  }

  return rawTokens;
};


export const parseQueryString = (queryString: string): SearchToken[] => {
  return getRawTokensFromQueryString(queryString).map(parseToken);
};


export const search = async (
  graph: GraphObject,
  query: DatabaseQuery,
): Promise<NoteListPage> => {
  const searchString = query.searchString || "";
  const caseSensitive = query.caseSensitive || false;
  const page = query.page ? Math.max(query.page, 1) : 1;
  const sortMode
    = query.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;
  const limit = query.limit || 0;

  let matchingNotes = Array.from(graph.notes.values());

  const tokens: SearchToken[] = parseQueryString(searchString);

  for (let t = 0; t < tokens.length; t++) {
    if (matchingNotes.length === 0) break;
    const [key, value] = tokens[t];

    // search for note pairs containing identical urls or titles
    if (key === "duplicates") {
      if (value === "url") {
        matchingNotes = getNotesWithDuplicateUrls(matchingNotes);
      } else if (value === "title") {
        matchingNotes = getNotesWithDuplicateTitles(matchingNotes);
      } else {
        matchingNotes = [];
      }

    // search for exact title
    } else if (key === "exact") {
      matchingNotes = getNotesByTitle(matchingNotes, value, false);

    // search for notes with specific urls
    } else if (key === "has") {
      if (value === "custom-metadata") {
        matchingNotes = getNotesWithCustomMetadata(matchingNotes);
      } else {
        matchingNotes = [];
      }

    // search for notes with specific urls
    } else if (key === "has-url") {
      matchingNotes = getNotesWithUrl(matchingNotes, value);

    // search for notes with specific file slugs
    } else if (key === "has-file") {
      matchingNotes = getNotesWithFile(matchingNotes, graph, value);
    } else if (key === "has-flag") {
      matchingNotes = getNotesWithFlag(matchingNotes, value);

    // search for notes with specific block types
    } else if (key === "has-block") {
      /*
        has:list|paragraph - show all notes that contain either list
        or paragraph
      */

      const types = value.split("|") as BlockType[];
      matchingNotes
        = getNotesWithBlocksOfTypes(matchingNotes, graph, types, false);


    // search for notes with specific media types
    } else if (key === "has-media") {
      /*
        has-media:audio|video - show all notes that contain either audio
        or video
      */
      const types = value.split("|") as MediaType[];
      matchingNotes
        = getNotesWithMediaTypes(
          matchingNotes,
          graph,
          new Set(types),
          false,
        );


    // full-text search
    } else if (key === "ft") {
      matchingNotes = getNotesThatContainTokens(
        matchingNotes,
        value,
        caseSensitive,
      );

    // custom key-value search
    } else if (key.startsWith("$")) {
      matchingNotes = getNotesWithKeyValue(
        matchingNotes,
        key.substring(1),
        value,
      );

    // default mode: check if all query tokens are included in note title
    } else {
      matchingNotes = getNotesWithTitleOrSlugContainingToken(
        matchingNotes,
        value,
        caseSensitive,
      );
    }
  }

  const SIMPLE_SORT_MODES: NoteListSortMode[] = [
    NoteListSortMode.CREATION_DATE_ASCENDING,
    NoteListSortMode.CREATION_DATE_DESCENDING,
    NoteListSortMode.UPDATE_DATE_ASCENDING,
    NoteListSortMode.UPDATE_DATE_DESCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING,
  ];

  // perf optimization: if we're using a simple sort mode, we can
  // avoid creating note list items of *all* notes and only create
  // them for the notes we're going to display
  if (SIMPLE_SORT_MODES.includes(sortMode)) {
    matchingNotes = matchingNotes.sort(getNoteSortFunction(sortMode));

    // let's see if we should limit the number of results
    if (limit > 0 && limit < matchingNotes.length) {
      matchingNotes = matchingNotes.slice(0, limit);
    }

    // let's extract the list items for the requested page
    const pagedMatches = getPagedMatches(
      matchingNotes,
      page,
      config.NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
    );

    return {
      results: createNoteListItems(pagedMatches, graph),
      numberOfResults: matchingNotes.length,
    };
  } else {
    const noteListItems: NoteListItem[] = createNoteListItems(
      matchingNotes,
      graph,
    )
      .sort(getSortFunction(sortMode));

    const pagedMatches = getPagedMatches(
      noteListItems,
      page,
      config.NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
    );

    return {
      results: pagedMatches,
      numberOfResults: matchingNotes.length,
    };
  }
};
