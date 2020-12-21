let token = localStorage.getItem("token") || null;

const set = (newToken) => {
  token = newToken;
  localStorage.setItem("token", newToken);
  document.cookie = `token=${token};`;
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
