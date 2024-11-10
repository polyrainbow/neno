import { useState } from "react";
import {
  getActiveLanguage,
  l,
  setLanguage,
  SUPPORTED_LANGS,
} from "../lib/intl";

const ChangeLanguageSetting = () => {
  const activeLanguage = getActiveLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(activeLanguage);

  return <section className="setting">
    <h2>{l("change-language.heading")}</h2>
    <select
      value={selectedLanguage}
      autoFocus={true}
      onChange={(e) => setSelectedLanguage(e.target.value)}
    >
      {
        SUPPORTED_LANGS.map((language) => {
          return <option
            value={language}
            key={language}
          >{language}</option>;
        })
      }
    </select>
    <div>
      <button
        onClick={async () => {
          await setLanguage(selectedLanguage);
        }}
        className="default-button dialog-box-button default-action"
      >{l("change-language.change")}</button>
    </div>
  </section>;
};

export default ChangeLanguageSetting;
