import express, { Application } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { log } from "./services/logging";
import http from "http";
import { config } from "./config";
import { routes } from "./manager/route.manager";
export class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.initMiddleware();
    this.initRoutes();
  }

  private initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      morgan("combined", {
        stream: { write: (message) => log.info(message.trim()) },
      })
    );
  }

  private initRoutes() {
    this.app.use("/", routes);
  }

  public shutdown(server: http.Server) {
    log.info("Server shutting down...");
    server.close((err) => {
      if (err) log.error((err as Error).message);
      log.info("Server stopped");
      process.exit(0);
    });
    setTimeout(() => {
      log.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  }

  public run() {
    const server = this.app.listen(config.port, () => {
      log.info(`Server running on port ${config.port}`);
    });
    process.on("SIGTERM", () => this.shutdown(server));
    process.on("SIGINT", () => this.shutdown(server));
  }
}

(async () => {
  try {
    const server = new Server();
    server.run();
  } catch (error) {
    log.error((error as Error).message);
    process.exit(1);
  }
})();
