import { cookies } from "next/headers";

const IMPERSONATION_COOKIE = "impersonate_user_id";

export async function getImpersonatedUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(IMPERSONATION_COOKIE)?.value || null;
}

export async function setImpersonatedUserId(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(IMPERSONATION_COOKIE, userId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  });
}

export async function clearImpersonatedUserId() {
  const cookieStore = await cookies();
  cookieStore.delete(IMPERSONATION_COOKIE);
}
