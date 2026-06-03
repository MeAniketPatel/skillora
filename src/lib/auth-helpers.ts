import { auth } from "@/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
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
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}

export async function requireStudent() {
  const user = await requireAuth();
  // All roles can be students; just ensure auth
  return user;
}

export async function getOptionalUser() {
  const session = await auth();
  return session?.user ?? null;
}
