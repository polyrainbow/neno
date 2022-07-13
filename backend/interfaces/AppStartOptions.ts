import { Filepath } from "./Filepath";
import User from "./User";

export default interface AppStartOptions {
  users: User[],
  dataPath: Filepath,
  frontendPath: Filepath,
  sessionSecret: string,
  sessionTTL: number,
  maxUploadFileSize: number,
  sessionCookieName: string,
  maxGraphSize: number,
}