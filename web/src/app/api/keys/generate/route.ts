import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateApiKey, validateHeader } from "../../../../utils";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const userId = await validateHeader(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }
    const { name, desc, version } = await req.json();
    if (!version) {
      return NextResponse.json({ error: "Invalid version" }, { status: 404 });
    }
    const key = generateApiKey();

    const newApiKey = await prisma.apiKey.create({
      data: {
        name,
        desc,
        key,
        userId,
        status: "ACTIVE",
        version,
      },
    });

    return NextResponse.json(
      {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key,
        desc: newApiKey.desc,
        status: newApiKey.status,
        version: newApiKey.version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
