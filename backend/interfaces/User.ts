import { UserId } from "./UserId";

export default interface User {
  id: UserId,
  login: string,
  passwordHash: string,
  mfaSecret: string,
  mfaUri?: string,
  qrCode?: string,
  apiKeys?: string[],
}
