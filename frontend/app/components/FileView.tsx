import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import {
  useParams, Link, useNavigate,
} from "react-router-dom";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import {
  getAppPath,
  getMediaTypeFromFilename,
  getUrl,
  humanFileSize,
  makeTimestampHumanReadable,
} from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import BusyIndicator from "./BusyIndicator";
import { SPAN_SEPARATOR } from "../config";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";


const FileView = ({
  databaseProvider,
  toggleAppMenu,
  createNewNote,
}: {
  databaseProvider: DatabaseProvider,
  toggleAppMenu: () => void,
  createNewNote,
}) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<MainNoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");

  const { fileId } = useParams();

  const navigate = useNavigate();

  const type = fileId && getMediaTypeFromFilename(fileId);

  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  useEffect(() => {
    if (typeof fileId !== "string") return;

    const getFileInfo = async () => {
      const fileInfo = await databaseProvider.getFileInfo(fileId);
      setFileInfo(fileInfo);
      const src = await getUrl(fileInfo, databaseProvider);
      setSrc(src);

      if (type === MediaType.TEXT) {
        fetch(src)
          .then((response) => response.text())
          .then((text) => setText(text));
      }
    };

    const getNotes = async () => {
      const response = await databaseProvider.getNotes({
        searchString: "has-file:" + fileId,
      });
      setNotes(response.results);
    };

    getFileInfo();
    getNotes();
  }, [databaseProvider, fileId]);

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section-wide">
      <p><Link to="/files">{l("files.show-all-files")}</Link></p>
      <h1>{fileInfo?.name}</h1>
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
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {
          type === MediaType.IMAGE
            ? <img
              style={{
                marginRight: "15px auto",
                maxWidth: "95vw",
              }}
              src={src}
              loading="lazy"
            />
            : ""
        }
        {
          type === MediaType.AUDIO
            ? <audio
              style={{
                marginRight: "15px auto",
                width: "95vw",
              }}
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.VIDEO
            ? <video
              style={{
                marginRight: "15px auto",
                maxHeight: "80vh",
              }}
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.PDF
            ? <iframe
              style={{
                marginRight: "15px auto",
                height: "80vh",
                width: "60vw",
              }}
              src={src}
            />
            : ""
        }
        {
          type === MediaType.TEXT
            ? <pre
              className="preview-block-file-text"
              style={{
                width: "100%",
              }}
            >{text}</pre>
            : ""
        }
        {
          type === MediaType.OTHER
            ? <a
              download
              href={src}
            >Download</a>
            : ""
        }
      </div>
      <h2>{l("files.used-in")}</h2>
      {
        notes
          ? (
            notes.length > 0
              ? notes.map((note) => {
                return <p key={"notelink-" + note.id}>
                  <Link
                    to={
                      getAppPath(
                        PathTemplate.EDITOR_WITH_NOTE,
                        new Map([["NOTE_ID", note.id.toString()]]),
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
      <button
        disabled={!fileInfo}
        onClick={async () => {
          createNewNote([], [fileInfo]);
        }}
        className="small-button default-action"
      >{l("files.create-note-with-file")}</button>
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

          await databaseProvider.deleteFile(fileInfo.fileId);
          navigate(getAppPath(PathTemplate.FILES));
        }}
        className="small-button dangerous-action"
      >{l("files.delete")}</button>
    </section>
  </>;
};

export default FileView;
