import { Link } from "./types/Link.js";
import { NoteListSortMode } from "./types/NoteListSortMode.js";
import NoteListItem from "./types/NoteListItem.js";
import ExistingNote from "./types/ExistingNote.js";
import { Slug } from "./types/Slug.js";
import Graph from "./types/Graph.js";

const getSortKeyForTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/(["'.“”„‘’—\-»#*[\]/])/g, "")
    .trim();
};


const getSortFunction = (
  sortMode: NoteListSortMode,
):((a: NoteListItem, b: NoteListItem) => number) => {
  const sortFunctions = {
    [NoteListSortMode.CREATION_DATE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      },
    [NoteListSortMode.CREATION_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
      },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
      },
    [NoteListSortMode.TITLE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        const aNormalized = getSortKeyForTitle(a.title);
        const bNormalized = getSortKeyForTitle(b.title);

        return aNormalized.localeCompare(bNormalized);
      },
    [NoteListSortMode.TITLE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        const aNormalized = getSortKeyForTitle(a.title);
        const bNormalized = getSortKeyForTitle(b.title);

        return bNormalized.localeCompare(aNormalized);
      },
    [NoteListSortMode.NUMBER_OF_LINKS_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.linkCount.sum - b.linkCount.sum;
      },
    [NoteListSortMode.NUMBER_OF_LINKS_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.linkCount.sum - a.linkCount.sum;
      },
    [NoteListSortMode.NUMBER_OF_FILES_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.numberOfFiles - b.numberOfFiles;
      },
    [NoteListSortMode.NUMBER_OF_FILES_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.numberOfFiles - a.numberOfFiles;
      },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.numberOfCharacters - b.numberOfCharacters;
      },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.numberOfCharacters - a.numberOfCharacters;
      },
  };

  return sortFunctions[sortMode] ?? sortFunctions.UPDATE_DATE_ASCENDING;
};


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (
  nodes: ExistingNote[],
  links: Link[],
  root: ExistingNote,
): ExistingNote[] => {
  const queue: ExistingNote[] = [];
  const discovered: ExistingNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as ExistingNote;
    const connectedNodes = links
      .filter((link: Link): boolean => {
        return (link[0] === v.meta.slug) || (link[1] === v.meta.slug);
      })
      .map((link: Link): ExistingNote | undefined => {
        const linkedNoteId = (link[0] === v.meta.slug) ? link[1] : link[0];
        return nodes.find(
          (n) => (n.meta.slug === linkedNoteId),
        );
      })
      .filter((n): n is ExistingNote => {
        return n !== undefined;
      });
    for (let i = 0; i < connectedNodes.length; i++) {
      const w = connectedNodes[i];
      if (!discovered.includes(w)) {
        discovered.push(w);
        queue.push(w);
      }
    }
  }

  return discovered;
};


const getGraphLinks = (graph: Graph): Link[] => {
  return Array.from(graph.notes.keys())
    .reduce(
      (links: Link[], slug: Slug): Link[] => {
        if (!graph.indexes.outgoingLinks.has(slug)) {
          throw new Error(
            "Could not determine outgoing links for " + slug,
          );
        }
        const linksFromThisSlug = Array.from(
          graph.indexes.outgoingLinks.get(slug) as Set<Slug>,
        )
          .filter((targetSlug: Slug): boolean => {
            return graph.notes.has(targetSlug)
              || graph.aliases.has(targetSlug);
          })
          .map((targetSlug: Slug): Link => {
            const canonicalTargetSlug
              = graph.aliases.get(targetSlug) ?? targetSlug;
            return [slug, canonicalTargetSlug];
          });

        return [
          ...links,
          ...linksFromThisSlug,
        ];
      },
      [] as Link[],
    );
};


// https://en.wikipedia.org/wiki/Component_(graph_theory)#Algorithms
const getNumberOfComponents = (
  graph: Graph,
): number => {
  const nodes = Array.from(graph.notes.values());
  const links = getGraphLinks(graph);
  let totallyDiscovered: ExistingNote[] = [];
  let numberOfComponents = 0;

  let i = 0;

  while (totallyDiscovered.length < nodes.length) {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [
      ...totallyDiscovered,
      ...inComponent,
    ] as ExistingNote[];
    numberOfComponents++;
    i++;
  }

  return numberOfComponents;
};

const getGraphCreationTimestamp = (graph: Graph): number => {
  return Math.min(
    ...Array.from(graph.notes.values())
      .map((note: ExistingNote) => note.meta.createdAt)
      .filter((createdAt: number | undefined): createdAt is number => {
        return createdAt !== undefined;
      }),
    graph.metadata.createdAt,
  );
};


const getGraphUpdateTimestamp = (graph: Graph): number => {
  return Math.max(
    ...Array.from(graph.notes.values())
      .map((note: ExistingNote) => note.meta.updatedAt)
      .filter((updatedAt: number | undefined): updatedAt is number => {
        return updatedAt !== undefined;
      }),
    graph.metadata.updatedAt,
  );
};

export {
  getSortKeyForTitle,
  getSortFunction,
  getNumberOfComponents,
  getGraphCreationTimestamp,
  getGraphUpdateTimestamp,
  getGraphLinks,
};
