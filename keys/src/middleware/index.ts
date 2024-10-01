import { NextFunction, Response, Request } from "express";
import { admin } from "../services/firebase-admin";
import { PrismaClient } from "@prisma/client";

export interface RequestedUser extends Request {
  user?: {
    userId: string;
  };
}

export class Middleware {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  validateRequest = async (
    req: RequestedUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const header = req.headers["authorization"];
      if (!header) {
        res.status(401).json({ error: "Authorization header is missing" });
        return;
      }

      const [scheme, token] = header.split(" ");
      if (scheme !== "Bearer" || !token) {
        res.status(401).json({ error: "Invalid authorization format" });
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      let user = await this.prisma.user.findUnique({
        where: { id: decodedToken.uid },
      });

      if (!user) {
        const firebaseUser = await admin.auth().getUser(decodedToken.uid);
        user = await this.prisma.user.create({
          data: {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
            provider:
              firebaseUser.providerData[0]?.providerId === "github.com"
                ? "GITHUB"
                : "GOOGLE",
            updatedAt: new Date(),
          },
        });
      }

      req.user = { userId: user.id };
      next();
    } catch (error) {
      console.error("Middleware error:", error);
      res
        .status(500)
        .json({ error: "Internal server error during authentication" });
    }
  };
}
