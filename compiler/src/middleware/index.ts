import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { log } from "../services/logging";
export class Middleware {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  validateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers["authorization"];
      if (!header) {
        res.status(401).json({ error: "Authorization header is missing" });
        return;
      }
      const [scheme, key] = header?.split("");
      if (scheme !== "Bearer" || !key) {
        res.status(401).json({
          error: "Invalid authorization header format",
          format: "Bearer API_KEY",
          recevied: header,
        });
        return;
      }
      const apikey = await this.prisma.apiKey.findUnique({
        where: { key },
      });
      if (!apikey) {
        res.status(404).json({ error: `API Key is Invalid ${key}` });
        return;
      }
      next();
    } catch (error) {
      log.error(`Middleware Error --> ${(error as Error).message}`);
      res
        .status(500)
        .json({ error: "Internal server error during authentication" });
    }
  };
}
