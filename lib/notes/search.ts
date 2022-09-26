import NoteListItem from "./interfaces/NoteListItem.js";
import NoteListPage from "./interfaces/NoteListPage.js";
import DatabaseQuery from "./interfaces/DatabaseQuery.js";
import { BlockType } from "../subwaytext/interfaces/Block.js";
import { MediaType } from "./interfaces/MediaType.js";
import {
  getSortFunction,
  createNoteListItems,
  getNotesWithDuplicateUrls,
  getNotesThatContainTokens,
  getNotesByTitle,
  getNotesWithUrl,
  getNotesWithFile,
  getNotesWithTitleContainingTokens,
  getNotesWithBlocksOfTypes,
  getNotesWithDuplicateTitles,
  getNotesWithMediaTypes,
  getNotesWithKeyValue,
  getNotesWithCustomMetadata,
} from "./noteUtils.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import GraphObject from "./interfaces/Graph.js";
import { getPagedMatches } from "../utils.js";
import * as config from "./config.js";
import CharIterator from "../subwaytext/CharIterator.js";

export const isWhiteSpace = (string) => {
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

  // eslint-disable-next-line no-constant-condition
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

  let matchingNotes = graph.notes;

  const tokens: SearchToken[] = parseQueryString(searchString);

  for (let t = 0; t < tokens.length; t++) {
    if (matchingNotes.length === 0) break;
    const [key, value] = tokens[t]; 

    // search for note pairs containing identical urls or titles
    if (key === "duplicates") {
      if (value === "url") {
        matchingNotes = getNotesWithDuplicateUrls(matchingNotes);
      } else if (value === "title"){
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

    // search for notes with specific fileIds
    } else if (key === "has-file") {
      matchingNotes = getNotesWithFile(matchingNotes, graph, value);


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
        = getNotesWithMediaTypes(matchingNotes, graph, types, false);


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
      matchingNotes = getNotesWithTitleContainingTokens(
        matchingNotes,
        value,
        caseSensitive,
      );
    }
  }


  // now we need to transform all notes into NoteListItems before we can
  // sort those
  let noteListItems: NoteListItem[] = createNoteListItems(matchingNotes, graph)
    .sort(getSortFunction(sortMode));

  // let's only slice the array if it makes sense to do so
  if (limit > 0 && limit < noteListItems.length) {
    noteListItems = noteListItems.slice(0, limit);
  }

  // let's extract the list items for the requested page
  const noteListItemsOfPage: NoteListItem[] = getPagedMatches(
    noteListItems,
    page,
    config.NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
  );

  const noteListPage: NoteListPage = {
    results: noteListItemsOfPage,
    numberOfResults: noteListItems.length,
  };

  return noteListPage;
};