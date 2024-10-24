import { useState } from "react";
import { l } from "../lib/intl";
import useNotesProvider from "../hooks/useNotesProvider";
import {
  getExtensionFromFilename,
  removeExtensionFromFilename,
} from "../lib/notes/utils";
import {
  isValidSlug,
} from "../lib/notes/slugUtils";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { ErrorMessage } from "../lib/notes/types/ErrorMessage";

interface FileViewRenameFormProps {
  fileInfo: FileInfo;
  setFileInfo: (newFileInfo: FileInfo) => void,
};

const FileViewRenameForm = ({
  fileInfo,
  setFileInfo,
}: FileViewRenameFormProps) => {
  const notesProvider = useNotesProvider();
  const slug = fileInfo.slug;
  const extension = fileInfo ? getExtensionFromFilename(fileInfo.filename) : "";
  const [slugRenameInput, setSlugRenameInput] = useState<string>(
    slug ? removeExtensionFromFilename(slug) : "",
  );
  const potentialNewSlug = slugRenameInput + (
    typeof extension === "string"
      ? `.${extension}`
      : ""
  );
  const [updateReferences, setUpdateReferences] = useState(true);
  const [error, setError] = useState<ErrorMessage | null>(null);

  return <>
    <h2>{l("files.rename")}</h2>
    <div className="rename">
      <div className="rename-section-input-line">
        <label htmlFor="file-slug-rename-input">
          {l("files.rename.new-slug")}:
        </label>
        <input
          id="file-slug-rename-input"
          type="text"
          value={slugRenameInput}
          onInput={(e) => {
            const element = e.currentTarget;
            const newValue = element.value.replace(
              // In the input field, we also allow \p{SK} modifiers, as
              // they are used to create a full letter with modifier via a
              // composition session. They are not valid slug characters on
              // their own, though.
              // We also allow apostrophes ('), as they might be used as a
              // dead key for letters like é.
              // Unfortunately, it seems like we cannot simulate pressing
              // dead keys in Playwright currently, so we cannot
              // add a meaningful test for this.
              /[^\p{L}\p{Sk}\d\-/._']/gu,
              "",
            ).toLowerCase();
            setSlugRenameInput(newValue);
            setError(null);
          }}
        />{
          typeof extension === "string"
            ? `.${extension}`
            : ""
        }
      </div>
      <div className="update-references">
        <label className="switch">
          <input
            type="checkbox"
            checked={updateReferences}
            onChange={(e) => {
              setUpdateReferences(e.target.checked);
            }}
          />
          <span className="slider round"></span>
        </label>
        <span className="update-references-toggle-text">
          {l("note.slug.update-references")}
        </span>
      </div>
      {
        error === ErrorMessage.SLUG_EXISTS
          ? <p className="error">
            {l("files.rename.slug-already-exists")}
          </p>
          : ""
      }
      <button
        disabled={
          slugRenameInput === removeExtensionFromFilename(slug ?? "")
          || !isValidSlug(potentialNewSlug)
        }
        className="default-button-small dangerous-action"
        onClick={async () => {
          if (
            !slug
            || slugRenameInput === slug
            || !isValidSlug(potentialNewSlug)
          ) return;

          try {
            const newFileInfo = await notesProvider.renameFileSlug(
              slug,
              potentialNewSlug,
              updateReferences,
            );

            setFileInfo(newFileInfo);
          } catch (e) {
            if (e instanceof Error && e.message === ErrorMessage.SLUG_EXISTS) {
              setError(ErrorMessage.SLUG_EXISTS);
            } else {
              throw e;
            }
          }
        }}
      >
        {l("files.rename")}
      </button>
    </div>
  </>;
};

export default FileViewRenameForm;
