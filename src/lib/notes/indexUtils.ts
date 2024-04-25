import ExistingNote from "./types/ExistingNote";
import GraphObject from "./types/Graph";
import subwaytext from "../subwaytext/index.js";
import { Slug } from "./types/Slug";
import { getAliasesOfSlug, getSlugsFromParsedNote } from "./noteUtils";
import { Block } from "../subwaytext/types/Block";

const removeSlugFromIndexes = (
  graph: GraphObject,
  slug: Slug,
): void => {
  graph.indexes.blocks.delete(slug);
  graph.indexes.outgoingLinks.delete(slug);
  graph.indexes.backlinks.delete(slug);

  /*
    We will not remove occurences of this slug in other notes
    (outgoing links), because that index is keeping all slugs, even with
    non-existing targets.
    This is because we do not want to re-index all notes when a note is
    created/updated/deleted.
  */

  graph.indexes.backlinks.forEach((backlinks: Set<Slug>) => {
    backlinks.delete(slug);
  });
};


const updateBacklinksIndex = (
  graph: GraphObject,
  ourSlug: Slug,
  ourOutgoingLinks: Slug[],
): void => {
  // Let's first check if we need to create a backlink index for *our* note
  let ourBacklinks: Set<Slug>;
  if (graph.indexes.backlinks.has(ourSlug)) {
    ourBacklinks = graph.indexes.backlinks.get(ourSlug) as Set<Slug>;
  } else {
    ourBacklinks = new Set<Slug>();
    graph.indexes.backlinks.set(ourSlug, ourBacklinks);
  }

  const ourAliases = getAliasesOfSlug(graph, ourSlug);

  for (const someExistingSlug of graph.notes.keys()) {
    if (someExistingSlug === ourSlug) {
      continue;
    }

    // Refresh their backlinks with our outgoing links
    if (ourOutgoingLinks.includes(someExistingSlug)) {
      (graph.indexes.backlinks.get(someExistingSlug) as Set<Slug>)
        .add(ourSlug);
    } else {
      (graph.indexes.backlinks.get(someExistingSlug) as Set<Slug>)
        .delete(ourSlug);
    }

    // Refresh their backlinks with our mentioning of their aliases
    const aliasesOfSomeExistingSlug = getAliasesOfSlug(graph, someExistingSlug);

    if (ourOutgoingLinks.some((outgoingLink) => {
      return aliasesOfSomeExistingSlug.has(outgoingLink);
    })) {
      (graph.indexes.backlinks.get(someExistingSlug) as Set<Slug>)
        .add(ourSlug);
    }

    // let's fill our note's backlinks with the outgoing links of the
    // other notes that lead to our note or our aliases
    const theirOutgoingLinks = graph.indexes.outgoingLinks.get(
      someExistingSlug,
    ) as Set<Slug>;

    if (
      theirOutgoingLinks.has(ourSlug)
      || [...ourAliases].some((alias) => {
        return theirOutgoingLinks.has(alias);
      })
    ) {
      ourBacklinks.add(someExistingSlug);
    }
  }
};

const updateBlockIndex = (
  graph: GraphObject,
  existingNote: ExistingNote,
): Block[] => {
  const blocks = subwaytext(existingNote.content);

  graph.indexes.blocks.set(
    existingNote.meta.slug,
    blocks,
  );

  return blocks;
};


const updateOutgoingLinksIndex = (
  graph: GraphObject,
  existingNote: ExistingNote,
  blocks: Block[],
): string[] => {
  const ourSlug = existingNote.meta.slug;
  const ourOutgoingLinks = getSlugsFromParsedNote(blocks);
  graph.indexes.outgoingLinks.set(ourSlug, new Set(ourOutgoingLinks));
  return ourOutgoingLinks;
};


const updateIndexes = (
  graph: GraphObject,
  existingNote: ExistingNote,
): void => {
  const blocks = updateBlockIndex(graph, existingNote);
  const ourOutgoingLinks = updateOutgoingLinksIndex(
    graph,
    existingNote,
    blocks,
  );
  updateBacklinksIndex(graph, existingNote.meta.slug, ourOutgoingLinks);
};

export {
  removeSlugFromIndexes,
  updateBacklinksIndex,
  updateIndexes,
};
