declare namespace Express {
  interface Request {
      userId: string;
      session: any;
  }
}