import React from "react";


const NotesListStatus = ({
  status,
}) => {
  const map = {
    BUSY: {
      label: "Loading notes ...",
      icon: "pending",
    },
    SEARCH_VALUE_TOO_SHORT: {
      label: "Please type at least 3 characters to search",
      icon: "looks_3",
    },
    NO_NOTES_FOUND: {
      label: "No notes found",
      icon: "radio_button_unchecked",
    },
  };

  const activeState = map[status];

  return <div
    style={{
      fontSize: "20px",
      textAlign: "center",
      margin: "30px auto",
    }}
  >
    <img
      style={{
        width: "100px",
      }}
      src={"/assets/icons/" + activeState.icon + "-24px.svg"}
      alt={activeState.label}
    />
    <p>{activeState.label}</p>
  </div>;
};

export default NotesListStatus;
