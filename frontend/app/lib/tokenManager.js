let token = localStorage.getItem("token") || null;

const set = (newToken) => {
  token = newToken;
  localStorage.setItem("token", newToken);
}

const get = () => {
  return token;
};

export {
  set,
  get,
}