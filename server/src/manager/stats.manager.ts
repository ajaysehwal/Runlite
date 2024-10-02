import { Redis } from "ioredis";

export class usageManager {
  constructor(private redis: Redis) {}
  recordRequest = async (key: string, data: any) => {
    await this.redis.set(key, JSON.stringify(data));
  };
}
