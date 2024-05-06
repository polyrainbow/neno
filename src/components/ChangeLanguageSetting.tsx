import { useState } from "react";
import { getActiveLanguage, l, setLanguage, supportedLangs } from "../lib/intl";

const ChangeLanguageSetting = () => {
  const activeLanguage = getActiveLanguage();
  const languages = supportedLangs;

  const [selectedLanguage, setSelectedLanguage] = useState(activeLanguage);

  return <section className="setting">
    <h2>{l("change-language.heading")}</h2>
    <select
      value={selectedLanguage}
      autoFocus={true}
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
    <div>
      <button
        onClick={() => {
          setLanguage(selectedLanguage);
        }}
        className="default-button dialog-box-button default-action"
      >{l("change-language.change")}</button>
    </div>
  </section>;
};

export default ChangeLanguageSetting;
