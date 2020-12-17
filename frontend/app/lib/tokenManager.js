let token = localStorage.getItem("token") || null;

const set = (newToken) => {
  token = newToken;
  localStorage.setItem("token", newToken);
}

const get = () => {
  return token;
};

const remove = () => {
  token = null;
  localStorage.removeItem("token");
}

export {
  set,
  get,
  remove,
}