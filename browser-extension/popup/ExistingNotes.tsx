import React, { useEffect, useState } from "react";
import { GraphId } from "../../lib/notes/interfaces/GraphId";
import { getExistingNotesWithThisUrl } from "../utils";

interface Note {
  title: string,
  id: number,
}

interface ExistingNotesProps {
  apiKey: string,
  hostUrl: string,
  activeTab: chrome.tabs.Tab,
  graphId: GraphId
}

const ExistingNotes = ({
  apiKey,
  hostUrl,
  activeTab,
  graphId,
}: ExistingNotesProps) => {
  const [existingNotes, setExistingNotes] = useState<Note[]>([]);

  useEffect(() => {
    const updateExistingNotes = async () => {
      if (
        hostUrl.length === 0
        || apiKey.length === 0
      ) {
        return;
      }

      try {
        const response = await getExistingNotesWithThisUrl(
          activeTab.url as string,
          graphId,
          hostUrl,
          apiKey,
        );
        setExistingNotes(response.payload.results);
      } catch (e) {
        console.log(e);
      }
    };

    if (activeTab) {
      updateExistingNotes();
    }
  }, [activeTab, graphId]);


  return <section id="section_existing-notes">
    <h2>Existing notes with this page</h2>
    <div id="existing-notes">
      {
        existingNotes.length > 0
          ? existingNotes.map((note) => {
            return <p
              key={"existing-note-" + note.id}
            >
              <a
                href={`${hostUrl}/graph/${graphId}/note/${note.id}`}
                target="_blank" rel="noreferrer"
              >{note.title}</a>
            </p>;
          })
          : "None"
      }
    </div>
  </section>;
};

export default ExistingNotes;
