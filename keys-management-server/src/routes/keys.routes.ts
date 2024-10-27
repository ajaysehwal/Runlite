import { NextFunction, Response } from "express";
import BaseRoute from ".";
import { RequestedUser } from "../guard/keys.guard";
import { KeysController } from "../controllers/keys.controllers";

export class KeysRoutes extends BaseRoute {
  private keys: KeysController;
  constructor() {
    super("/key");
    this.keys = new KeysController(this.prisma);
  }
  public initRoutes(): void {
    this.router.post(
      `${this.path}/generate`,
      this.keysGuard.validateRequest,
      async (req: RequestedUser, res: Response, next: NextFunction) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }
          const { userId } = req.user;
          const result = await this.keys.generate(req.body, userId);
          res.status(201).json(result);
        } catch (error) {
          next(error);
        }
      },
    );
    this.router.get(
      `${this.path}/get`,
      this.keysGuard.validateRequest,
      async (req: RequestedUser, res: Response, next: NextFunction) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }
          const { userId } = req.user;
          const keys = await this.keys.getKeys(userId);
          res.status(200).json(keys);
        } catch (error) {
          next(error);
        }
      },
    );
    this.router.delete(
      `${this.path}/del/:id`,
      this.keysGuard.validateRequest,
      async (req: RequestedUser, res: Response, next: NextFunction) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }
          const { userId } = req.user;
          const { id } = req.params;
          const isdel = await this.keys.del(id, userId);
          if (!isdel) {
            res.status(404).json({
              error:
                "API key not found or you don't have permission to delete it",
            });
            return;
          }
          res.status(200).json({ message: "OK", id });
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
