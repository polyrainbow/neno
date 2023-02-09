declare namespace Express {
  interface Request {
    userId: string;
    params: any;
    body: any;
    method: string;
  }
}