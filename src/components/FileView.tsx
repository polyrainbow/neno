import { useState, useEffect } from "react";
import {
  useParams, Link, useNavigate,
} from "react-router-dom";
import NoteListItem from "../lib/notes/types/NoteListItem";
import {
  ISOTimestampToLocaleString,
  createContentFromSlugs,
  getAppPath,
  humanFileSize,
} from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { MediaType } from "../lib/notes/types/MediaType";
import { FileInfo } from "../lib/notes/types/FileInfo";
import BusyIndicator from "./BusyIndicator";
import {
  LOCAL_GRAPH_ID,
  NENO_SCRIPT_FILE_SUFFIX,
  SPAN_SEPARATOR,
} from "../config";
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
import {
  getObjectUrlForArbitraryGraphFile,
  saveFile,
} from "../lib/LocalDataStorage";
import useConfirm from "../hooks/useConfirm";
import FileViewPreview from "./FileViewPreview";
import HeaderButton from "./HeaderButton";

const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  // status can be READY, BUSY
  const [notes, setNotes] = useState<NoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const { slug } = useParams();
  const [slugRenameInput, setSlugRenameInput] = useState<string>(
    slug ? removeExtensionFromFilename(slug) : "",
  );
  const extension = fileInfo ? getExtensionFromFilename(fileInfo.filename) : "";
  const potentialNewSlug = slugRenameInput + (
    typeof extension === "string"
      ? `.${extension}`
      : ""
  );
  const [updateReferences, setUpdateReferences] = useState(true);

  const navigate = useNavigate();

  const type = fileInfo
    ? getMediaTypeFromFilename(fileInfo.filename)
    : null;

  const confirm = useConfirm();

  const canShowTextPreview = type === MediaType.TEXT;
  const isNenoScript = slug?.endsWith(NENO_SCRIPT_FILE_SUFFIX) ?? false;
  useEffect(() => {
    if (typeof slug !== "string") return;

    const getFileInfo = async () => {
      const fileInfo = await notesProvider.getFileInfo(slug);
      setFileInfo(fileInfo);
      const objectUrl = await getObjectUrlForArbitraryGraphFile(fileInfo);
      setObjectUrl(objectUrl);
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


  useEffect(() => {
    if (canShowTextPreview && typeof objectUrl === "string") {
      fetch(objectUrl)
        .then((response) => response.text())
        .then((text) => setText(text));
    }
  }, [objectUrl, canShowTextPreview]);

  const canShowPreview = type !== MediaType.OTHER;

  return <>
    <HeaderContainerLeftRight
      leftContent={
        <div className="header-controls">
          <HeaderButton
            icon="list"
            onClick={() => {
              navigate(
                getAppPath(
                  PathTemplate.FILES,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ),
              );
            }}
          >
            {l("files.show-all-files")}
          </HeaderButton>
          <HeaderButton
            icon="add"
            disabled={!fileInfo}
            onClick={async () => {
              if (!fileInfo) return;

              navigate(getAppPath(
                PathTemplate.NEW_NOTE,
                new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
              ), {
                state: {
                  contentIfNewNote: createContentFromSlugs([
                    fileInfo.slug,
                  ]),
                },
              });
            }}
          >
            {l("files.create-note-with-file")}
          </HeaderButton>
          <HeaderButton
            icon="file_download"
            onClick={async () => {
              if (!fileInfo) return;
              await saveFile(fileInfo.slug);
            }}
          >
            {l("files.save-duplicate")}
          </HeaderButton>
          {
            isNenoScript
              ? <HeaderButton
                icon="create"
                onClick={async () => {
                  if (!fileInfo) return;

                  navigate(getAppPath(
                    PathTemplate.SCRIPT,
                    new Map([
                      ["GRAPH_ID", LOCAL_GRAPH_ID],
                      ["SCRIPT_SLUG", fileInfo.slug],
                    ]),
                  ));
                }}
              >
                {l("files.open-in-script-editor")}
              </HeaderButton>
              : ""
          }
          <HeaderButton
            icon="delete"
            dangerous
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
          >{l("files.delete")}</HeaderButton>
        </div>
      }
    />
    <section className="content-section-wide file-section">
      <h1>{fileInfo ? fileInfo.slug : ""}</h1>
      {
        canShowPreview && type && objectUrl
          ? <FileViewPreview
            type={type}
            src={objectUrl}
            text={text}
          />
          : ""
      }
      <p>{
        fileInfo ? humanFileSize(fileInfo.size) : ""
      }{fileInfo?.createdAt ? SPAN_SEPARATOR : ""}{
        fileInfo?.createdAt
          ? l("stats.metadata.created-at")
            + ": "
            + ISOTimestampToLocaleString(fileInfo.createdAt)
          : ""
      }</p>
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

            const objectUrl = await getObjectUrlForArbitraryGraphFile(
              newFileInfo,
            );
            setFileInfo(newFileInfo);
            setObjectUrl(objectUrl);

            navigate(getAppPath(
              PathTemplate.FILE,
              new Map([
                ["GRAPH_ID", LOCAL_GRAPH_ID],
                ["FILE_SLUG", potentialNewSlug],
              ]),
            ), {
              replace: true,
            });
          }}
        >
          {l("files.rename")}
        </button>
      </div>
    </section>
  </>;
};

export default FileView;
