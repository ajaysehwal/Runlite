import { NextFunction, Response } from "express";
import BaseRoute from ".";
import { RequestedUser } from "../guard/keys.guard";
import { UsageController } from "../controllers/usage.controllers";
export class UsageRoutes extends BaseRoute {
  private usage: UsageController;
  constructor() {
    super("/usage");
    this.usage = new UsageController(this.prisma);
  }
  public initRoutes(): void {
    this.router.get(
      `${this.path}/all`,
      this.keysGuard.validateRequest,
      async (req: RequestedUser, res: Response, next: NextFunction) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }
          const { userId } = req.user;
          const request = await this.usage.getAllRequests(userId);
          res.status(200).json(request);
        } catch (error) {
          next(error);
        }
      }
    );
    this.router.get(
      `${this.path}/logs`,
      this.keysGuard.validateRequest,
      async (req: RequestedUser, res: Response, next: NextFunction) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }
          const { userId } = req.user;
          const logs = await this.usage.getLogs(userId);
          res.status(200).json(logs);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
