import {
  InlineText,
  Span,
} from "../subwaytext/types/Block.js";
import { Slug } from "./types/Slug.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import { inferNoteTitle } from "./noteUtils.js";
import { FileInfo } from "./types/FileInfo.js";
import {
  getExtensionFromFilename,
  removeExtensionFromFilename,
} from "./utils.js";


const isValidFileSlug = (slug: Slug): boolean => {
  /*
    A file slug is a slug that is saved in a subfolder of the root graph
    directory.
  */
  return slug.match(/\//gi)?.length === 1
    && !slug.startsWith("/");
};


const trimSlug = (slug: string): string => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};


/*
  Turns note text into a slug, without truncating.
  For example, it can be used to obtain a slug from a Wikilink.
  We will replace slashes and dots with dashes, as we do not allow
  these chars in note slugs (even though they are generally allowed
  in slugs).
  As a consequence, this means that uploaded files with slashes in slugs
  (like `files/image.png`) cannot be referenced via a Wikilink.
*/
const sluggify = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // remove invalid chars
    .replace(/['’]+/g, "")
    // Replace invalid chars with dashes.
    .replace(/[^\p{L}\p{M}\d\-_]+/gu, "-")
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
  We will replace slashes and dots with dashes, as these are not allowed for
  note slugs (only allowed for general slugs). We do not want
  to have these chars when creating a simple slug for a normal note.
*/
const sluggifyNoteText = (text: string): string => {
  return sluggify(text)
    // Truncate to avoid file name length limit issues.
    // Windows systems can handle up to 255, but we truncate at 200 to leave
    // a bit of room for things like version numbers.
    .substring(0, 200);
};


const isValidSlug = (slug: Slug): boolean => {
  return (
    slug.length > 0
    && slug.length <= 200
    && slug.match(/^[\p{L}\d_][\p{L}\d\-/._]*$/u) !== null
  );
};


const isValidSlugOrEmpty = (slug: Slug): boolean => {
  return isValidSlug(slug) || slug.length === 0;
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
      return sluggify(span.text.substring(2, span.text.length - 2));
    }
  });
};


const createSlug = (
  noteContent: string,
  existingSlugs: Slug[],
): Slug => {
  const title = inferNoteTitle(noteContent);
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
  sluggify,
  sluggifyNoteText,
  trimSlug,
  isValidSlugOrEmpty,
  sluggifyFilename,
};
