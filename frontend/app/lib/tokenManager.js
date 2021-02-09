import { MAX_SESSION_AGE } from "./config.js";

const tokenKey = "NENO_token";
const dbIdKey = "NENO_dbId";

let token = localStorage.getItem(tokenKey) || null;
let dbId = localStorage.getItem("token") || null;

const set = (options) => {
  token = options.token;
  dbId = options.dbId;
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(dbIdKey, dbId);
  document.cookie
    = `${tokenKey}=${token};max-age=${MAX_SESSION_AGE.toString()}`;
};

const get = () => {
  return { token, dbId };
};

const remove = () => {
  token = null;
  dbId = null;
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(dbIdKey);
  document.cookie = tokenKey + "=;";
};

export {
  set,
  get,
  remove,
};
