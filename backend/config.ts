import User from "./interfaces/User";

const API_PATH = "/api/";

const DEFAULT_USERS:User[] = [
  {
    id: "admin",
    login: "admin",
    // bcrypt password hash for default password 0000
    passwordHash:
      "$2a$10$dhCPi4ycActip6dS74olwed9ENrN3V7XWSjbCn7S5V0cIUjctCBm2",
  },
];

export {
  API_PATH,
  DEFAULT_USERS,
}