const tokenKey = "NENO_token";
const dbIdKey = "NENO_dbId";

let token = localStorage.getItem(tokenKey) || null;
let dbId = localStorage.getItem(dbIdKey) || null;

const set = (options) => {
  token = options.token;
  dbId = options.dbId;
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(dbIdKey, dbId);
  document.cookie
    = `${tokenKey}=${token};max-age=${options.maxSessionAge.toString()}`;
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
