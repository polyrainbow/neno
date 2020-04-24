const getNote = async (noteId) => {
  const response = await fetch("/api/note/" + noteId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const note = await response.json();
  return note;
};


const getNotes = async () => {
  const response = await fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const notes = await response.json();
  return notes;
};


const putNote = async (note) => {
  const response = await fetch("/api/note", {
    method: "PUT",
    body: JSON.stringify(note),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const noteFromServer = (await response.json()).note;
  return noteFromServer;
};


const deleteNote = async (noteId) => {
  await fetch(
    "/api/note/" + noteId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};


const getDatabaseAsJSON = async () => {
  const response = await fetch("/api/database/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.text();
  return json;
};


const getGraph = async () => {
  const response = await fetch("/api/graph", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
};


export {
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getDatabaseAsJSON,
  getGraph,
};

