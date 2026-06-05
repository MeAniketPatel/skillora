import { auth } from "@/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import { cookies } from "next/headers";
import { getUserById } from "@/data/user.data";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  // If the user is admin, check for impersonation cookie
  if (session.user.role === "ADMIN") {
    const cookieStore = await cookies();
    const impersonateUserId = cookieStore.get("impersonate_user_id")?.value;
    if (impersonateUserId) {
      const impersonatedUser = await getUserById(impersonateUserId);
      if (impersonatedUser) {
        return {
          id: impersonatedUser.id,
          name: impersonatedUser.name,
          email: impersonatedUser.email,
          image: impersonatedUser.image,
          role: impersonatedUser.role,
        };
      }
    }
  }

  return session.user;
}

export async function requireTeacher() {
  const user = await requireAuth();
  if (user.role !== "TEACHER" && user.role !== "ADMIN") {
    throw new ForbiddenError("Teacher access required");
  }
  return user;
}

export async function requireAdmin() {
  // Impersonated user can't perform admin actions, so check the raw session here
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return session.user;
}

export async function requireStudent() {
  const user = await requireAuth();
  return user;
}

export async function getOptionalUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  if (session.user.role === "ADMIN") {
    const cookieStore = await cookies();
    const impersonateUserId = cookieStore.get("impersonate_user_id")?.value;
    if (impersonateUserId) {
      const impersonatedUser = await getUserById(impersonateUserId);
      if (impersonatedUser) {
        return {
          id: impersonatedUser.id,
          name: impersonatedUser.name,
          email: impersonatedUser.email,
          image: impersonatedUser.image,
          role: impersonatedUser.role,
        };
      }
    }
  }

  return session.user;
}

