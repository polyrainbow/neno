import { Filepath } from "./Filepath";

export default interface AppStartOptions {
  dataPath: Filepath,
  frontendPath: Filepath,
  sessionSecret: string,
  sessionTTL: number,
  maxUploadFileSize: number,
  sessionCookieName: string,
  maxGraphSize: number,
}