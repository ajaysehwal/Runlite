import { HttpMethod, PrismaClient } from "@prisma/client";
import Redis from "ioredis";

export class UsageManager {
  private prisma: PrismaClient;
  constructor(private redis: Redis) {
    this.prisma = new PrismaClient();
  }
  async recordRequest(
    method: HttpMethod,
    endpoint: string,
    statusCode: number,
    apiKeyId: string,
    isCached: boolean
  ): Promise<boolean> {
    try {
      const pipeline = this.redis.pipeline();
      pipeline.incr(apiKeyId);
      pipeline.expire(apiKeyId, 86400);
      await this.prisma.usageRecord.create({
        data: {
          method,
          isCached,
          apiKeyId,
          endpoint,
          statusCode,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  protected async getKeyRequestCount(apiKey: string) {
    return await this.redis.get(apiKey);
  }
}
