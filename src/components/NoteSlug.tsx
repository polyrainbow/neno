import ActiveNote from "../types/ActiveNote";
import NotesProvider from "../lib/notes";
import NoteSlugUpdateReferencesToggle from "./NoteSlugUpdateReferencesToggle";
import { l } from "../lib/intl";

interface NoteSlugProps {
  note: ActiveNote,
  slugInput: string,
  setSlugInput: (val: string) => void,
  setUnsavedChanges: (val: boolean) => void,
  updateReferences: boolean,
  setUpdateReferences: (val: boolean) => void,
}


const NoteSlug = ({
  note,
  slugInput,
  setSlugInput,
  setUnsavedChanges,
  updateReferences,
  setUpdateReferences,
}: NoteSlugProps) => {
  return <div className="slug-line">
    <input
      type="text"
      placeholder="slug"
      className={
        "note-slug "
        + (
          !NotesProvider.isValidSlug(slugInput) && slugInput.length > 0
            ? "invalid"
            : ""
        )
      }
      onInput={(e) => {
        const element = e.currentTarget;
        const newValue = element.value.replace(
          // In the input field, we also allow \p{SK} modifiers, as
          // they are used to create a full letter with modifier in a
          // second step. They are not valid slug characters on its own,
          // though.
          // We also allow apostrophes ('), as they might be used as a dead key
          // for letters like é.
          // Unfortunately, it seems like we cannot simulate pressing dead keys
          // in Playwright currently, so we cannot add a meaningful test for
          // this.
          /[^\p{L}\p{Sk}\d\-/._']/gu,
          "",
        ).toLowerCase();
        setSlugInput(newValue);
        setUnsavedChanges(true);
      }}
      value={slugInput}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          document.querySelector<HTMLDivElement>(
            "div[data-lexical-editor]",
          )?.focus();
        }

        if (e.key === "Escape") {
          e.preventDefault();
          setSlugInput("slug" in note ? note.slug : "");
        }
      }}
    />
    {
      slugInput.length > 0 && !NotesProvider.isValidSlug(slugInput)
        ? <div className="note-slug-validation-error">
          {l("note.slug.invalid-slug").toLocaleUpperCase()}
        </div>
        : ""
    }
    {
      (
        "slug" in note
        && note.slug !== slugInput
        && NotesProvider.isValidSlug(slugInput)
      )
        ? <NoteSlugUpdateReferencesToggle
          isActivated={updateReferences}
          setIsActivated={(val: boolean) => {
            setUpdateReferences(val);
          }}
        />
        : ""
    }
  </div>;
};

export default NoteSlug;
