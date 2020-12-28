import { MAX_SESSION_AGE } from "./config.js";

let token = localStorage.getItem("token") || null;

const set = (newToken) => {
  token = newToken;
  localStorage.setItem("token", newToken);
  document.cookie = `token=${token};max-age=${MAX_SESSION_AGE.toString()}`;
};

const get = () => {
  return token;
};

const remove = () => {
  token = null;
  localStorage.removeItem("token");
  document.cookie = "token=;";
};

export {
  set,
  get,
  remove,
};
