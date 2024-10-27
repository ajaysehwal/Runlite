import { PrismaClient } from "@prisma/client";

export class UsageController {
  constructor(private prisma: PrismaClient) {}
  async getAllRequests(userId: string) {
    try {
      const userRequests = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          ApiKey: {
            select: {
              UsageRecord: {
                select: {
                  timestamp: true,
                  statusCode: true,
                  isCached: true,
                },
              },
            },
          },
        },
      });
      const usageRecord =
        userRequests?.ApiKey.flatMap((apiKey) => apiKey.UsageRecord) || [];
      const cacheCount = usageRecord.filter((record) => record.isCached).length;
      const uncacheCount = usageRecord.filter(
        (record) => !record.isCached
      ).length;
      return { cacheCount, uncacheCount, usageRecord };
    } catch (error) {
      console.error("Error fetching requests for user:", error);
      return null;
    }
  }
  async getLogs(userId: string) {
    try {
      return await this.prisma.auditLog.findMany({ where: { userId },select:{
          action:true,
          details:true,
          createdAt:true,
          id:true
      } });
    } catch (error) {
      console.error("Error fetching logs for user:", error);
      return null;
    }
  }
}
