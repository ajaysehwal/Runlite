import { validateHeader } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = await validateHeader(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing API key ID" },
        { status: 400 }
      );
    }

    const deletedKey = await prisma.apiKey.delete({
      where: { id, userId },
    });

    if (!deletedKey) {
      return NextResponse.json(
        {
          error: "API key not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "API key deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the API key" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
