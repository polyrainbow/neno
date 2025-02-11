import ActiveNote from "../types/ActiveNote";
import NotesProvider from "../lib/notes";
import NoteSlugUpdateReferencesToggle from "./NoteSlugUpdateReferencesToggle";
import { l } from "../lib/intl";
import Icon from "./Icon";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { sluggifyNoteText } from "../lib/notes/slugUtils";
import { flushSync } from "react-dom";

interface NoteSlugProps {
  note: ActiveNote,
  slugInput: string,
  setSlugInput: (val: string) => void,
  displayedSlugAliases: string[],
  setDisplayedSlugAliases: (val: string[]) => void,
  setUnsavedChanges: (val: boolean) => void,
  updateReferences: boolean,
  setUpdateReferences: (val: boolean) => void,
}


const NoteSlug = ({
  note,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
  setUnsavedChanges,
  updateReferences,
  setUpdateReferences,
}: NoteSlugProps) => {

  const handleNewAliasRequest = () => {
    const newDisplayedSlugAliases = [...displayedSlugAliases];
    newDisplayedSlugAliases.push("");
    setDisplayedSlugAliases(newDisplayedSlugAliases);
  };

  useKeyboardShortcuts({
    onCmdU: handleNewAliasRequest,
  });

  return <div className="slug-lines">
    <div className="slug-line canonical">
      <input
        type="text"
        placeholder="slug"
        className={
          "note-slug "
          + (
            !NotesProvider.isValidNoteSlugOrEmpty(slugInput)
              ? "invalid"
              : ""
          )
        }
        onInput={(e) => {
          const element = e.currentTarget;
          const newValue = element.value.replace(
            // In the input field, we also allow \p{SK} modifiers, as
            // they are used to create a full letter with modifier in a
            // second step. They are not valid slug characters on their own,
            // though.
            // We also allow apostrophes ('), as they might be used as a
            // dead key for letters like é.
            // Unfortunately, it seems like we cannot simulate pressing
            // dead keys in Playwright currently, so we cannot
            // add a meaningful test for this.
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
        onPaste={(e) => {
          e.preventDefault();
          const element = e.currentTarget;

          const pastedText = e.clipboardData.getData("text");
          const pastedTextSluggified = sluggifyNoteText(pastedText);
          const originalSelectionStart = element.selectionStart!;
          const originalSelectionEnd = element.selectionEnd!;
          const oldText = element.value;
          const newText = oldText.substring(0, originalSelectionStart)
            + pastedTextSluggified
            + oldText.substring(originalSelectionEnd, oldText.length);

          // flushSync is necessary to ensure that the value is updated before
          // we set the selection range. Otherwise, the selection range would
          // be set based on the old value.
          flushSync(() => {
            setSlugInput(newText);
          });

          const selectionOffset = (oldText.substring(0, originalSelectionStart)
            + pastedTextSluggified).length;
          element.setSelectionRange(selectionOffset, selectionOffset);
        }}
      />
      {
        !NotesProvider.isValidNoteSlugOrEmpty(slugInput)
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
      <button
        className="alias-control-button"
        onClick={handleNewAliasRequest}
        aria-label={l("editor.add-alias")}
        title={l("editor.add-alias")}
      >
        <Icon
          icon={"add"}
        />
      </button>
    </div>
    {
      displayedSlugAliases.map((slugAlias, index, aliases) => {
        return <div
          className="slug-line canonical"
          key={"sla-" + index}
        >
          <input
            type="text"
            placeholder="alias"
            className={
              "note-slug "
              + (
                !NotesProvider.isValidNoteSlugOrEmpty(slugInput)
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
                // We also allow apostrophes ('), as they might be used as a
                // dead key for letters like é.
                // Unfortunately, it seems like we cannot simulate pressing
                // dead keys in Playwright currently, so we cannot
                // add a meaningful test for this.
                /[^\p{L}\p{Sk}\d\-/._']/gu,
                "",
              ).toLowerCase();
              const newDisplayedSlugAliases = [...displayedSlugAliases];
              newDisplayedSlugAliases[index] = newValue;
              setDisplayedSlugAliases(newDisplayedSlugAliases);
              setUnsavedChanges(true);
            }}
            value={slugAlias}
            autoFocus={
              /*
                If this input field is the result of a user request to create
                a new alias (field is empty and the last one), focus it.
              */
              slugAlias === ""
              && index === aliases.length - 1
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.querySelector<HTMLDivElement>(
                  "div[data-lexical-editor]",
                )?.focus();
              }

              if (e.key === "Escape") {
                e.preventDefault();
                const newDisplayedSlugAliases
                  = Array.from(displayedSlugAliases).splice(index, 1);
                setDisplayedSlugAliases(newDisplayedSlugAliases);
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const element = e.currentTarget;

              const pastedText = e.clipboardData.getData("text");
              const pastedTextSluggified = sluggifyNoteText(pastedText);
              const originalSelectionStart = element.selectionStart!;
              const originalSelectionEnd = element.selectionEnd!;
              const oldText = element.value;
              const newText = oldText.substring(0, originalSelectionStart)
                + pastedTextSluggified
                + oldText.substring(originalSelectionEnd, oldText.length);

              const newDisplayedSlugAliases = [...displayedSlugAliases];
              newDisplayedSlugAliases[index] = newText;

              // flushSync is necessary to ensure that the value is updated
              // before we set the selection range. Otherwise, the selection
              // range would be set based on the old value.
              flushSync(() => {
                setDisplayedSlugAliases(newDisplayedSlugAliases);
              });

              const selectionOffset = (
                oldText.substring(0, originalSelectionStart)
                + pastedTextSluggified
              ).length;
              element.setSelectionRange(selectionOffset, selectionOffset);
            }}
          />
          {
            !NotesProvider.isValidNoteSlugOrEmpty(slugAlias)
              ? <div className="note-slug-validation-error">
                {l("note.slug.invalid-slug").toLocaleUpperCase()}
              </div>
              : ""
          }
          <button
            className="alias-control-button"
            onClick={() => {
              const newDisplayedSlugAliases = [...displayedSlugAliases];
              newDisplayedSlugAliases.splice(index, 1);
              setDisplayedSlugAliases(newDisplayedSlugAliases);
            }}
            aria-label={l("editor.remove-alias")}
            title={l("editor.remove-alias")}
          >
            <Icon
              icon={"delete"}
            />
          </button>
        </div>;
      })
    }
  </div>;
};

export default NoteSlug;
