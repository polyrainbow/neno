import { Response } from "express";

export default (filepath:string, options:any) => {
  return (req, res:Response, next) => {
    if (
      (req.method === 'GET' || req.method === 'HEAD')
      && req.accepts('html')
    ) {
      res.sendFile(filepath, options, err => err && next());
    } else {
      next();
    }
  };
};