import React, { useEffect, useState } from "react";
import { getExistingNotesWithThisUrl } from "../utils";

interface Note {
  title: string,
  id: number,
}

const ExistingNotes = ({ apiKey, hostUrl, activeTab, graphId }) => {
  const [existingNotes, setExistingNotes] = useState<Note[]>([]);

  useEffect(() => {
    const updateExistingNotes = async () => {
      if (
        typeof hostUrl !== "string"
        || hostUrl.length === 0
        || typeof apiKey !== "string"
        || apiKey.length === 0
        || typeof graphId !== "string"
      ) {
        return;
      }

      try {
        const response = await getExistingNotesWithThisUrl(
          activeTab.url,
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
                href={hostUrl + "/editor/" + note.id}
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
