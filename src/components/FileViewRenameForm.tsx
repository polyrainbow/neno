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
          const newFileInfo = await notesProvider.renameFileSlug(
            slug,
            potentialNewSlug,
            updateReferences,
          );

          setFileInfo(newFileInfo);
        }}
      >
        {l("files.rename")}
      </button>
    </div>
  </>;
};

export default FileViewRenameForm;
