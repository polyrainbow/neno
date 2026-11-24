import { l } from "../lib/intl";
import SshPublicKey from "./SshPublicKey";

const AndroidSshKeySetting = () => {
  return <section className="setting">
    <h2>{l("ssh-key.heading")}</h2>
    <SshPublicKey />
  </section>;
};

export default AndroidSshKeySetting;
