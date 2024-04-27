import { useState, useEffect } from "react";
import {
  useParams, Link, useNavigate,
} from "react-router-dom";
import NoteListItem from "../lib/notes/types/NoteListItem";
import {
  getAppPath,
  getUrl,
  humanFileSize,
  makeTimestampHumanReadable,
} from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { MediaType } from "../lib/notes/types/MediaType";
import { FileInfo } from "../lib/notes/types/FileInfo";
import BusyIndicator from "./BusyIndicator";
import { LOCAL_GRAPH_ID, SPAN_SEPARATOR } from "../config";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useNotesProvider from "../hooks/useNotesProvider";
import {
  getExtensionFromFilename,
  getMediaTypeFromFilename,
  removeExtensionFromFilename,
} from "../lib/notes/utils";
import {
  isValidSlug,
} from "../lib/notes/slugUtils";
import { saveFile } from "../lib/LocalDataStorage";
import useConfirm from "../hooks/useConfirm";
import FileViewPreview from "./FileViewPreview";
import { Slug } from "../lib/notes/types/Slug";

const getRenameInput = (slug: Slug): string => {
  return removeExtensionFromFilename(slug);
};

const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<NoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const { slug } = useParams();
  const [slugRenameInput, setSlugRenameInput] = useState<string>(
    slug ? getRenameInput(slug) : "",
  );
  const extension = slug ? getExtensionFromFilename(slug) : "";
  const [updateReferences, setUpdateReferences] = useState(true);

  const navigate = useNavigate();
  const type = slug
    ? getMediaTypeFromFilename(slug)
    : null;
  const confirm = useConfirm();

  useEffect(() => {
    if (typeof slug !== "string") return;

    const getFileInfo = async () => {
      const fileInfo = await notesProvider.getFileInfo(slug);
      setFileInfo(fileInfo);
      const src = await getUrl(fileInfo);
      setSrc(src);

      if (type === MediaType.TEXT) {
        fetch(src)
          .then((response) => response.text())
          .then((text) => setText(text));
      }
    };

    const getNotes = async () => {
      const response = await notesProvider.getNotesList({
        searchString: "has-file:" + slug,
      });
      setNotes(response.results);
    };

    getFileInfo();
    getNotes();
  }, [notesProvider, slug]);

  const canShowPreview = type !== MediaType.OTHER;

  return <>
    <HeaderContainerLeftRight
      leftContent={
        <div className="header-controls">
          <button
            className="header-button"
            onClick={() => {
              navigate(
                getAppPath(
                  PathTemplate.FILES,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ),
              );
            }}
          >{l("files.show-all-files")}</button>
        </div>
      }
    />
    <section className="content-section-wide file-section">
      <h1>{fileInfo ? fileInfo.slug : ""}</h1>
      {
        canShowPreview && type
          ? <FileViewPreview
            type={type}
            src={src}
            text={text}
          />
          : ""
      }
      <p>{
        fileInfo ? humanFileSize(fileInfo.size) : ""
      }{SPAN_SEPARATOR}{
        fileInfo
          ? l("stats.metadata.created-at")
            + ": "
            + makeTimestampHumanReadable(fileInfo.createdAt)
          : ""
      }</p>
      <div
        className="action-bar"
      >
        <button
          disabled={!fileInfo}
          onClick={async () => {
            if (!fileInfo) return;

            navigate(getAppPath(
              PathTemplate.NEW_NOTE,
              new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
              new URLSearchParams({
                referenceSlugs: fileInfo.slug,
              }),
            ));
          }}
          className="default-button default-action"
        >{l("files.create-note-with-file")}</button>
        <button
          className="default-button default-action"
          onClick={async () => {
            if (!fileInfo) return;
            await saveFile(fileInfo.slug);
          }}
        >
          {l("files.save-duplicate")}
        </button>
        <button
          disabled={!fileInfo}
          onClick={async () => {
            if (!fileInfo) return;

            await confirm({
              text: l("files.confirm-delete"),
              confirmText: l("files.confirm-delete.confirm"),
              cancelText: l("dialog.cancel"),
              encourageConfirmation: false,
            });

            await notesProvider.deleteFile(fileInfo.slug);
            navigate(getAppPath(
              PathTemplate.FILES,
              new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
            ));
          }}
          className="default-button dangerous-action"
        >{l("files.delete")}</button>
      </div>
      <h2>{l("files.used-in")}</h2>
      {
        notes
          ? (
            notes.length > 0
              ? <ul>{
                notes.map((note) => {
                  return <li key={"notelink-" + note.slug}>
                    <Link
                      to={
                        getAppPath(
                          PathTemplate.EXISTING_NOTE,
                          new Map([
                            ["GRAPH_ID", LOCAL_GRAPH_ID],
                            ["SLUG", note.slug],
                          ]),
                        )
                      }
                    >{note.title}</Link>
                  </li>;
                })
              }</ul>
              : <p>{l("files.used-in.none")}</p>
          )
          : <BusyIndicator
            alt={l("app.loading")}
            height={30}
          />
      }
      <h2>Rename</h2>
      <div className="rename">
        <div className="rename-section-input-line">
          <label htmlFor="file-slug-rename-input">New slug:</label>
          <div>
            <input
              id="file-slug-rename-input"
              type="text"
              value={slugRenameInput}
              onInput={(e) => {
                const element = e.currentTarget;
                const newValue = element.value.replace(
                  // In the input field, we also allow \p{SK} modifiers, as
                  // they are used to create a full letter with modifier in a
                  // second step. They are not valid slug characters on
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
            />.{extension}
          </div>
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
            slugRenameInput === getRenameInput(slug || "")
            || !isValidSlug(slugRenameInput)
          }
          className="default-button-small dangerous-action"
          onClick={async () => {
            if (
              !slug
              || slugRenameInput === getRenameInput(slug || "")
              || !isValidSlug(slugRenameInput)
            ) return;
            const newSlug = slugRenameInput + "." + extension;
            try {
              const newFileInfo = await notesProvider.renameFile(
                slug,
                newSlug,
                updateReferences,
              );
              const src = await getUrl(newFileInfo);
              setFileInfo(newFileInfo);
              setSrc(src);

              navigate(getAppPath(
                PathTemplate.FILE,
                new Map([
                  ["GRAPH_ID", LOCAL_GRAPH_ID],
                  ["FILE_SLUG", newSlug],
                ]),
              ), {
                replace: true,
              });
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          }}
        >
          Rename
        </button>
      </div>
    </section>
  </>;
};

export default FileView;
