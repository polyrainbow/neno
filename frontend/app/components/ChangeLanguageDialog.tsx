import React, { useState } from "react";
import { l } from "../lib/intl";
import Dialog from "./Dialog";
import DialogActionBar from "./DialogActionBar";

const ChangeLanguageDialog = ({
  activeLanguage,
  languages,
  changeLanguage,
  onClose,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(activeLanguage);

  return <Dialog
    onClickOnOverlay={onClose}
  >
    <h1>{l("change-language.heading")}</h1>
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
    >
      {
        languages.map((language) => {
          return <option
            value={language}
            key={language}
          >{language}</option>;
        })
      }
    </select>
    <DialogActionBar>
      <button
        onClick={() => {
          changeLanguage(selectedLanguage);
          onClose();
        }}
        className="default-button dialog-box-button default-action"
      >{l("change-language.change")}</button>
      <button
        onClick={onClose}
        className="default-button dialog-box-button"
      >{l("dialog.cancel")}</button>
    </DialogActionBar>
  </Dialog>;
};

export default ChangeLanguageDialog;
