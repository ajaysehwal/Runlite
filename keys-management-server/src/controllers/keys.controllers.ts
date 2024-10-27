import { PrismaClient, Version } from "@prisma/client";
import { Crypto } from "../services";

export class KeysController {
  private crypto: Crypto;
  constructor(private prisma: PrismaClient) {
    this.crypto = new Crypto();
  }
  async generate(
    data: { name: string; desc: string; version: Version },
    userId: string,
  ) {
    const { name, desc, version } = data;
    const apiKey = this.crypto.generateApiKey();
    const hashedApiKey = await this.crypto.hashApiKey(apiKey);
    const newApiKey = await this.prisma.apiKey.create({
      data: {
        name,
        description: desc,
        key: hashedApiKey,
        userId,
        status: "ACTIVE",
        version,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "API_KEY_CREATED",
        details: { apiKeyId: newApiKey.id },
      },
    });
    return {
      id: newApiKey.id,
      name: newApiKey.name,
      key: apiKey,
      description: newApiKey.description,
      status: newApiKey.status,
      version: newApiKey.version,
      createdAt: newApiKey.createdAt,
    };
  }
  async getKeys(userId: string) {
    return await this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async del(id: string, userId: string) {
    await this.prisma.usageRecord.deleteMany({
      where: {
        apiKeyId: id,
      },
    });
    await this.prisma.apiKey.delete({
      where: {
        id,
        userId,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "API_KEY_DELETED",
        details: { apiKeyId: id },
      },
    });
    return true;
  }
}
