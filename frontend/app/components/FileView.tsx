import React, { useState, useEffect } from "react";
import {
  useParams, Link, useNavigate,
} from "react-router-dom";
import { MainNoteListItem } from "../types/NoteListItem";
import {
  getAppPath,
  getMediaTypeFromFilename,
  getUrl,
  humanFileSize,
  makeTimestampHumanReadable,
} from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import BusyIndicator from "./BusyIndicator";
import { SPAN_SEPARATOR } from "../config";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import useGraphId from "../hooks/useGraphId";
import DialogActionBar from "./DialogActionBar";


const FileView = () => {
  const databaseProvider = useDatabaseProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<MainNoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const graphId = useGraphId();
  const { fileId } = useParams();

  const navigate = useNavigate();

  const type = fileId && getMediaTypeFromFilename(fileId);

  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  useEffect(() => {
    if (typeof fileId !== "string") return;

    const getFileInfo = async () => {
      const fileInfo = await databaseProvider.getFileInfo(graphId, fileId);
      setFileInfo(fileInfo);
      const src = await getUrl(graphId, fileInfo, databaseProvider);
      setSrc(src);

      if (type === MediaType.TEXT) {
        fetch(src)
          .then((response) => response.text())
          .then((text) => setText(text));
      }
    };

    const getNotes = async () => {
      const response = await databaseProvider.getNotes(graphId, {
        searchString: "has-file:" + fileId,
      });
      setNotes(response.results);
    };

    getFileInfo();
    getNotes();
  }, [databaseProvider, fileId]);

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <p><Link
        to={getAppPath(PathTemplate.FILES, new Map([["GRAPH_ID", graphId]]))}
      >{l("files.show-all-files")}</Link></p>
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
      <FlexContainer
        className="file-container"
      >
        {
          type === MediaType.IMAGE
            ? <img
              className="checkerboard-background"
              src={src}
              loading="lazy"
            />
            : ""
        }
        {
          type === MediaType.AUDIO
            ? <audio
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.VIDEO
            ? <video
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.PDF
            ? <iframe
              src={src}
            />
            : ""
        }
        {
          type === MediaType.TEXT
            ? <pre
              className="preview-block-file-text"
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
      </FlexContainer>
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
                        PathTemplate.EXISTING_NOTE,
                        new Map([
                          ["GRAPH_ID", graphId],
                          ["NOTE_ID", note.id.toString()],
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
      <DialogActionBar>
        <button
          disabled={!fileInfo}
          onClick={async () => {
            if (!fileInfo) return;

            navigate(getAppPath(
              PathTemplate.NEW_NOTE,
              new Map([["GRAPH_ID", graphId]]),
              new URLSearchParams({
                fileIds: fileInfo.fileId,
              }),
            ));
          }}
          className="default-button default-action"
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

            await databaseProvider.deleteFile(graphId, fileInfo.fileId);
            navigate(getAppPath(
              PathTemplate.FILES,
              new Map([["GRAPH_ID", graphId]]),
            ));
          }}
          className="default-button dangerous-action"
        >{l("files.delete")}</button>
      </DialogActionBar>
    </section>
  </>;
};

export default FileView;
