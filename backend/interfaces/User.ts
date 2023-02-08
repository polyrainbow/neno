import { GraphId } from "../../lib/notes/interfaces/GraphId";
import { UserId } from "./UserId";

export interface StoredCredentials {
  pubKey: string,
  prevCounter: number,
}

export default interface User {
  id: UserId,
  name: string,
  graphIds: GraphId[],
  apiKeyHashes: string[],
  signUpTokens: string[],
  credentials: StoredCredentials[],
}
