import { NextRequest } from "next/server";
import { admin } from "../lib/firebase-admin";
export const generateApiKey = (): string => {
  return (
    "ak_" +
    Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join(
      ""
    )
  );
};

export const validateHeader = async (req: NextRequest) => {
  const header = req.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  const token = header.split("Bearer ")[1];
  const decode = await admin.auth().verifyIdToken(token);
  return decode.uid;
};
