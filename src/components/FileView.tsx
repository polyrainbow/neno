import React, { useState, useEffect } from "react";
import {
  useParams, Link, useNavigate,
} from "react-router-dom";
import NoteListItem from "../lib/notes/interfaces/NoteListItem";
import {
  getAppPath,
  getUrl,
  humanFileSize,
  makeTimestampHumanReadable,
} from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { MediaType } from "../lib/notes/interfaces/MediaType";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import BusyIndicator from "./BusyIndicator";
import { LOCAL_GRAPH_ID, SPAN_SEPARATOR } from "../config";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import useNotesProvider from "../hooks/useNotesProvider";
import DialogActionBar from "./DialogActionBar";
import { getMediaTypeFromFilename } from "../lib/notes/noteUtils";
import useGraphAccessCheck from "../hooks/useGraphAccessCheck";
import { isInitialized } from "../lib/LocalDataStorage";


const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<NoteListItem[] | null>(null);
  const [text, setText] = useState<string>("");
  const { slug } = useParams();

  const navigate = useNavigate();

  const type = slug && getMediaTypeFromFilename(slug);

  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

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

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section-wide file-section">
      <p><Link
        to={getAppPath(
          PathTemplate.FILES, new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
        )}
      >{l("files.show-all-files")}</Link></p>
      <h1>{fileInfo?.slug}</h1>
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
      <DialogActionBar>
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
      </DialogActionBar>
    </section>
  </>;
};

export default FileView;
