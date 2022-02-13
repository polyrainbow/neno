import React, { useEffect, useState } from "react";
import { getExistingNotesWithThisUrl } from "../utils";

interface Note {
  title: string,
  id: number,
}

export default ({config, activeTab, graphId}) => {
  const [existingNotes, setExistingNotes] = useState<Note[]>([]);

  useEffect(() => {
    const updateExistingNotes = async () => {
      if (
        typeof config.hostUrl !== "string"
        || config.hostUrl.length === 0
        || typeof config.apiKey !== "string"
        || config.apiKey.length === 0
        || typeof graphId !== "string"
      ) {
        return;
      }

      try {
        const response = await getExistingNotesWithThisUrl(
          activeTab.url,
          graphId,
          config.hostUrl,
          config.apiKey,
        );
        setExistingNotes(response.payload.results);
      } catch (e) {
        console.log(e);
      }
    }

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
                href={config.hostUrl + "/editor/" + note.id}
                target="_blank"
              >{note.title}</a>
            </p>
          })
          : "None found."
      }
    </div>
  </section>;
}
