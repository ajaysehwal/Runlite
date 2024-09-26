import { validateHeader } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const userId = await validateHeader(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }
    const keys = await prisma.apiKey.findMany({ where: { userId } });
    return NextResponse.json(keys, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong while fetching API keys ${error}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
