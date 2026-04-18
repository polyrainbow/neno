import { useState } from "react";
import { l } from "../lib/intl";
import { getGitAuthor, setGitAuthor } from "../lib/LocalDataStorage";

const GitConfigSetting = () => {
  const initial = getGitAuthor();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);

  const commit = () => {
    setGitAuthor(name, email);
  };

  return <section className="setting">
    <h2>{l("git-config.heading")}</h2>
    <p>
      <label>
        {l("git-config.user-name.label")}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commit}
        />
      </label>
    </p>
    <p>
      <label>
        {l("git-config.user-email.label")}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={commit}
        />
      </label>
    </p>
  </section>;
};

export default GitConfigSetting;
