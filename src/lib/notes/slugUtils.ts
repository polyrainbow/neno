import {
  InlineText,
  Span,
} from "../subwaytext/types/Block.js";
import { Slug } from "./types/Slug.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import { FileInfo } from "./types/FileInfo.js";
import {
  getExtensionFromFilename,
  removeExtensionFromFilename,
} from "./utils.js";
import { getNoteTitle } from "./noteUtils.js";


const isValidFileSlug = (slug: Slug): boolean => {
  /*
    A file slug is a slug that is saved in a subfolder of the root graph
    directory.
  */
  const numberOfSlashes = slug.match(/\//gi)?.length ?? 0;
  return numberOfSlashes >= 1
    && !slug.startsWith("/");
};


const trimSlug = (slug: string): string => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};


/*
  Turns wiki link text into a slug, without truncating.
  It is used to obtain a slug from a Wikilink.
  We will replace dots with dashes, as we do not allow
  these chars in note slugs (even though they are generally allowed
  in slugs).
  As a consequence, this means that uploaded files with dots in slugs
  (like `files/image.png`) cannot be referenced via a Wikilink.
  Also, it will replace series of multiple slashes (//, ///, ...)
  with single slashes (/).
  In order to link to nested note slugs, we have to use "//" as separator,
  e.g. [[Person//Alice A.]]
*/
const sluggifyWikilinkText = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // remove invalid chars
    .replace(/['’]+/g, "")
    // Replace invalid chars with dashes. Keep / for processing afterwards
    .replace(/[^\p{L}\p{M}\d\-_/]+/gu, "-")
    // replace single slashes
    .replace(/(?<!\/)\/(?!\/)/g, "-")
    // replace multiple slashes (//, ///, ...) with /
    .replace(/\/\/+/g, "/")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    .toLowerCase();

  return trimSlug(slug);
};


// same as above, but leaves dots in place
// should be used for uploaded files, but not for note content or note slugs.
const sluggifyFilename = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // remove invalid chars
    .replace(/['’]+/g, "")
    // Replace invalid chars with dashes.
    .replace(/[^\p{L}\p{M}\d\-._]+/gu, "-")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    // we do not allow dotfiles for now
    .replace(/^\./g, "")
    .toLowerCase();

  return trimSlug(slug);
};


/*
  Transforms note text like into a slug and truncates it.
  We will replace slashes and dots with dashes:
  Dots are not allowed in note slugs.
  And we do not want to have slashes in the slug when creating a simple slug
  for a normal note.
*/
const sluggifyNoteText = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // remove invalid chars
    .replace(/['’]+/g, "")
    // Replace invalid chars with dashes (including invalid slashes).
    .replace(/[^\p{L}\p{M}\d\-_]+/gu, "-")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    .toLowerCase();

  return trimSlug(slug)
    // Truncate to avoid file name length limit issues.
    // Windows systems can handle up to 255, but we truncate at 200 to leave
    // a bit of room for things like version numbers.
    .substring(0, 200);
};


const isValidSlug = (slug: Slug): boolean => {
  return (
    slug.length > 0
    && slug.length <= 200
    && slug.match(/^[\p{L}\d\-._]+(\/[\p{L}\d\-._]+)*$/u) !== null
  );
};


const isValidNoteSlug = (slug: Slug): boolean => {
  return (
    slug.length > 0
    && slug.length <= 200
    && slug.match(/^[\p{L}\d\-_]+(\/[\p{L}\d\-_]+)*$/u) !== null
  );
};


const isValidSlugOrEmpty = (slug: Slug): boolean => {
  return isValidSlug(slug) || slug.length === 0;
};


const isValidNoteSlugOrEmpty = (slug: Slug): boolean => {
  return isValidNoteSlug(slug) || slug.length === 0;
};


const getSlugsFromInlineText = (text: InlineText): Slug[] => {
  return text.filter(
    (span: Span): boolean => {
      return span.type === SpanType.SLASHLINK
        || span.type === SpanType.WIKILINK;
    },
  ).map((span: Span): Slug => {
    if (span.type === SpanType.SLASHLINK) {
      return span.text.substring(1);
    } else {
      return sluggifyWikilinkText(span.text.substring(2, span.text.length - 2));
    }
  });
};


const createSlug = (
  noteContent: string,
  existingSlugs: Slug[],
): Slug => {
  const title = getNoteTitle(noteContent);
  let slugStem = sluggifyNoteText(title);

  let n = 1;

  if (!slugStem) {
    slugStem = "new";
  }

  while (true) {
    // We don't want to use just "new" as a slug, because that would conflict
    // with the "new" keyword in the URL schema. So let's use "new-1" instead.
    // If that's taken, we'll try "new-2", etc.
    // With other slugs, we only want to append a number if there's a conflict,
    // starting with "2".
    const showIntegerSuffix = slugStem === "new" || n > 1;
    const slug = showIntegerSuffix ? `${slugStem}-${n}` : slugStem;
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};


const getSlugFromFilename = (
  folder: string,
  filename: string,
  existingFiles: FileInfo[],
): Slug => {
  const existingFileSlugs = existingFiles.map((file) => file.slug);
  const extension = getExtensionFromFilename(filename);
  const filenameWithoutExtension = removeExtensionFromFilename(filename);
  const sluggifiedFileStem = sluggifyFilename(filenameWithoutExtension);

  let n = 1;

  while (true) {
    // We don't want to use just "new" as a slug, because that would conflict
    // with the "new" keyword in the URL schema. So let's use "new-1" instead.
    // If that's taken, we'll try "new-2", etc.
    // With other slugs, we only want to append a number if there's a conflict,
    // starting with "2".
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix
      ? `${sluggifiedFileStem}-${n}`
      : sluggifiedFileStem;

    const slug: Slug = folder + "/"
      + stemWithOptionalIntegerSuffix
      + (
        extension
          ? (
            stemWithOptionalIntegerSuffix
              ? "."
              : ""
          ) + extension.trim().toLowerCase()
          : ""
      );

    if (!existingFileSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};


const getFilenameFromFileSlug = (
  fileSlug: Slug,
) => {
  if (!isValidFileSlug(fileSlug)) {
    throw new Error("Not a file slug: " + fileSlug);
  }
  return fileSlug.substring(fileSlug.indexOf("/") + 1);
};


export {
  createSlug,
  getFilenameFromFileSlug,
  getSlugFromFilename,
  getSlugsFromInlineText,
  isValidFileSlug,
  isValidSlug,
  isValidNoteSlug,
  isValidNoteSlugOrEmpty,
  sluggifyWikilinkText,
  sluggifyNoteText,
  trimSlug,
  isValidSlugOrEmpty,
  sluggifyFilename,
};
