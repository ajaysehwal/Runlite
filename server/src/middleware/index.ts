import { NextFunction, Request, Response } from "express";

export class Middleware {
  static validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    

  };
}
