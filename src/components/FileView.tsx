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
  getMediaTypeFromFilename,
} from "../lib/notes/utils";
import {
  getObjectUrlForArbitraryGraphFile,
  saveFile,
} from "../lib/LocalDataStorage";
import useConfirm from "../hooks/useConfirm";
import FileViewPreview from "./FileViewPreview";
import HeaderButton from "./HeaderButton";
import FileViewRenameForm from "./FileViewRenameForm";

const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  // status can be READY, BUSY
  const [notes, setNotes] = useState<NoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const { slug } = useParams();

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
      {
        fileInfo
          ? <FileViewRenameForm
            fileInfo={fileInfo}
            setFileInfo={async (newFileInfo: FileInfo) => {
              const objectUrl = await getObjectUrlForArbitraryGraphFile(
                newFileInfo,
              );
              setFileInfo(newFileInfo);
              setObjectUrl(objectUrl);

              navigate(getAppPath(
                PathTemplate.FILE,
                new Map([
                  ["GRAPH_ID", LOCAL_GRAPH_ID],
                  ["FILE_SLUG", newFileInfo.slug],
                ]),
              ), {
                replace: true,
              });
            }}
          />
          : ""
      }
    </section>
  </>;
};

export default FileView;
