import { auth } from "@clerk/nextjs/server";

export type Role = "petani" | "user" | null;

export const getRole = async (): Promise<Role> => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: Role })?.role;
  return role ?? null;
};