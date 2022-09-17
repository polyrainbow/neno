import { UserId } from "./UserId";
import { GraphId } from "./GraphId";

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
