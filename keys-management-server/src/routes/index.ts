import { Router } from "express";
import { KeysGuard } from "../guard/keys.guard";
import { PrismaClient } from "@prisma/client";
// Base Router instance
abstract class BaseRoute {
  public router: Router;
  protected path: string;
  protected keysGuard: KeysGuard;
  protected prisma: PrismaClient;
  constructor(path: string) {
    this.router = Router();
    this.path = path;
    this.keysGuard = new KeysGuard();
    this.prisma = new PrismaClient();
  }

  public init() {
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}

export default BaseRoute;
export * from "./health.routes";
export * from "./keys.routes";
