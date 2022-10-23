import { GraphId } from "../../lib/notes/interfaces/GraphId";
import { UserId } from "./UserId";

export default interface User {
  id: UserId, // unique key
  login: string,
  graphIds: GraphId[],
  passwordHash: string,
  salt: string,
  mfaSecret: string,
  mfaUri?: string,
  qrCode?: string,
  apiKeyHashes: string[],
}
