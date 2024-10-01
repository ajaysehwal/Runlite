import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { admin } from "./firebase-admin";

const prisma = new PrismaClient();

export const AuthMiddleware = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await prisma.user.findUnique({
      where: { id: decodedToken.uid },
    });

    if (!user) {
      const firebaseUser = await admin.auth().getUser(decodedToken.uid);
      user = await prisma.user.create({
        data: {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          provider:
            firebaseUser.providerData[0]?.providerId === "github.com"
              ? "GITHUB"
              : "GOOGLE",
        },
      });
    }

    return { userId: user.id };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
