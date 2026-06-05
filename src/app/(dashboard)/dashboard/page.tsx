import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isTeacherOrAdmin } from "@/features/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (isTeacherOrAdmin(session.user.role as any)) {
    redirect("/teacher/courses");
  } else {
    redirect("/student/courses");
  }
}
