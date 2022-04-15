import fs from "fs/promises";
import * as logger from "./logger.js";

export default function (session) {
  const Store = session.Store;

  class FileStore extends Store {
    #filePath;
    #maxNumberOfSessions;
  
    constructor(options) {
      super(options);
      this.#maxNumberOfSessions = options.maxNumberOfSessions || 1000;
      this.#filePath = options.filePath;
    }

    async #getSessions() {
      let fileContent;

      try {
        fileContent = await fs.readFile(this.#filePath, "utf8");
      } catch (e) {
        logger.info("Could not access sessions file.");
        logger.info("Creating sessions file: " + this.#filePath);
        await fs.writeFile(this.#filePath, JSON.stringify([]));
        fileContent = await fs.readFile(this.#filePath, "utf8");
      }

      const sessions = JSON.parse(fileContent);
      return sessions;
    }


    async #writeSessions(sessions) {
      await fs.writeFile(
        this.#filePath,
        JSON.stringify(sessions, null, "  "),
      );
    }


    async get(sid, cb) {
      const sessions = await this.#getSessions();
      const session = sessions.find(s => s.id === sid);
      cb(null, session?.data);
    }

    async set(sid, sess, cb) {
      const sessions = await this.#getSessions();

      while (sessions.length > this.#maxNumberOfSessions) {
        sessions.shift();
      }

      sessions.push({
        id: sid,
        data: sess,
      });

      await this.#writeSessions(sessions);
      cb(null);
    }

    async destroy(sid, cb) {
      const sessions = await this.#getSessions();
      const index = sessions.findIndex(s => s.id === sid);
      sessions.splice(index, 1);
      await this.#writeSessions(sessions);
      cb(null);
    }

    async clear(cb) {
      const sessions = await this.#getSessions();
      sessions.length = 0;
      await this.#writeSessions(sessions);
      cb(null);
    }

    async length(cb) {
      const sessions = await this.#getSessions();
      cb(null, sessions.length);
    }
  }

  return FileStore;
}