import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is missing");
}

const secretKey = new TextEncoder().encode(secret);

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);

    return payload.role === "admin";
  } catch {
    return false;
  }
}