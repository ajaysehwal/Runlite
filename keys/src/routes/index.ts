import { Router } from "express";
import { Middleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

abstract class BaseRoute {
  public router: Router;
  protected path: string;
  protected middleware: Middleware;
  protected prisma: PrismaClient;
  constructor(path: string) {
    this.router = Router();
    this.path = path;
    this.middleware = new Middleware();
    this.prisma = new PrismaClient();
  }

  public init() {
    this.initRoute();
  }

  protected abstract initRoute(): void;
}

export default BaseRoute;
