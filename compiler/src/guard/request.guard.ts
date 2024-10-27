import { NextFunction, Response } from "express";
import { HttpMethod, PrismaClient } from "@prisma/client";
import { log, Crypto } from "../services";
import { ApiRequest, ApiResponse } from "../types";
import { UsageManager } from "../managers/StatsManager";
import { CacheLayer } from "../layers/cache";

export class RequestGuard {
  private prisma: PrismaClient;
  private usage: UsageManager;
  private redis: CacheLayer;
  private crypto: Crypto;
  constructor() {
    this.prisma = new PrismaClient();
    this.crypto = new Crypto();
    this.redis = new CacheLayer();
    this.usage = new UsageManager(this.redis.redis);
  }
  validateRequest = async (
    req: ApiRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const header = req.headers["authorization"];
      if (!header) {
        res.status(401).json({ error: "Authorization header is missing" });
        return;
      }
      const [scheme, key] = header.split(" ");
      if (scheme !== "Bearer" || !key) {
        res.status(401).json({
          error: "Invalid authorization header format",
          format: "Bearer API_KEY",
          recevied: header,
        });
        return;
      }
      const hashkey = await this.crypto.hashApiKey(key);
      const apikey = await this.prisma.apiKey.findUnique({
        where: { key: hashkey },
      });

      if (!apikey) {
        res.status(404).json({ error: `API Key is Invalid ${key}` });
        return;
      }
      const isWithinLimits = await this.checkSubscriptionLimits(apikey.userId);
      if (!isWithinLimits) {
        res.status(429).json({ error: "Daily limits are succeded" });
        return;
      }
      req.userId = apikey.userId;
      req.apikeyId = apikey.id;
      next();
    } catch (error) {
      log.error(`Middleware Error --> ${(error as Error).message}`);
      res
        .status(500)
        .json({ error: "Internal server error during authentication" });
    }
  };
  private async checkSubscriptionLimits(userId: string): Promise<boolean> {
    if (!userId) {
      throw "userId is required for checking subscription limits";
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Subscription: {
          include: {
            SubscriptionPlan: true,
          },
        },
      },
    });

    if (!user?.Subscription || user.Subscription.length === 0) {
      return false;
    }

    const activeSubscription = user.Subscription.find(
      (sub) => sub.status === "ACTIVE"
    );
    if (!activeSubscription) {
      return false;
    }

    const { maxRequestsPerDay } = activeSubscription.SubscriptionPlan;

    const today = new Date().toISOString().split("T")[0];
    const dailyRequests = await this.prisma.usageRecord.count({
      where: {
        ApiKey: {
          userId: user.id,
        },
        timestamp: {
          gte: new Date(today),
        },
      },
    });

    if (dailyRequests > maxRequestsPerDay) {
      return false;
    }

    return true;
  }
  onRequestFinish(req: ApiRequest, res: ApiResponse, next: NextFunction) {
    res.on("finish", async () => {
      try {
         await this.usage.recordRequest(
          req.method as HttpMethod,
          req.url,
          res.statusCode,
          req.apikeyId as string,
          Boolean(res.isCached)
        );
      } catch (error) {
        log.error(`${(error as Error).message}`);
      }
    });
    next();
  }
}
