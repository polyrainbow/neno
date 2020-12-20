import { UserId } from "./UserId";

export default interface User {
  id: UserId,
  login: string,
  passwordHash: string,
};
