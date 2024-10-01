import { PrismaClient, Version } from "@prisma/client";
import { Crypto } from "../services/crypto";

export class KeysController {
  private crypto: Crypto;
  constructor(private prisma: PrismaClient) {
    this.crypto = new Crypto();
  }
  async generate(
    data: { name: string; desc: string; version: Version },
    userId: string
  ) {
    const { name, desc, version } = data;
    const apiKey = this.crypto.generateApiKey();
    const hashedApiKey = await this.crypto.hashApiKey(apiKey);
    const newApiKey = await this.prisma.apiKey.create({
      data: {
        name,
        description: desc,
        key: hashedApiKey,
        userId: userId,
        status: "ACTIVE",
        version,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        id: userId,
        userId: userId,
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
    const deleteKey = await this.prisma.apiKey.deleteMany({
      where: {
        id,
        userId,
        status: { not: "INACTIVE" },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: userId,
        userId,
        action: "API_KEY_DELETED",
        details: { apiKeyId: id },
      },
    });
    if (deleteKey.count === 0) {
      return false;
    }
    return true;
  }
}
