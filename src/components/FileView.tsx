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
  getMediaTypeFromFilename,
} from "../lib/notes/utils";
import {
  getFilenameFromFileSlug,
} from "../lib/notes/slugUtils";
import useGraphAccessCheck from "../hooks/useGraphAccessCheck";
import { isInitialized, saveFile } from "../lib/LocalDataStorage";
import useConfirm from "../hooks/useConfirm";
import FileViewPreview from "./FileViewPreview";


const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<NoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const { slug } = useParams();

  const navigate = useNavigate();
  const type = slug
    ? getMediaTypeFromFilename(slug)
    : null;
  const confirm = useConfirm();

  useGraphAccessCheck();

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

  if (!isInitialized()) {
    return <BusyIndicator height={80} alt={l("app.loading")} />;
  }

  const canShowPreview = type !== MediaType.OTHER;

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <p><Link
        to={getAppPath(
          PathTemplate.FILES, new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
        )}
      >{l("files.show-all-files")}</Link></p>
      <h1>{fileInfo ? getFilenameFromFileSlug(fileInfo.slug) : ""}</h1>
      <p>{
        fileInfo ? humanFileSize(fileInfo.size) : ""
      }{SPAN_SEPARATOR}{
        fileInfo
          ? l("stats.metadata.created-at")
            + ": "
            + makeTimestampHumanReadable(fileInfo.createdAt)
          : ""
      }</p>
      {
        canShowPreview && type
          ? <FileViewPreview
            type={type}
            src={src}
            text={text}
          />
          : ""
      }
      <h2>{l("files.used-in")}</h2>
      {
        notes
          ? (
            notes.length > 0
              ? notes.map((note) => {
                return <p key={"notelink-" + note.slug}>
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
                </p>;
              })
              : <p>{l("files.used-in.none")}</p>
          )
          : <BusyIndicator
            alt={l("app.loading")}
            height={30}
          />
      }
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
    </section>
  </>;
};

export default FileView;
