"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

import { updateUserRole } from "@/features/auth/actions/auth.actions";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type RoleOption = "STUDENT" | "TEACHER";

export default function WelcomeForm() {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedRole) return;

    setError(null);
    startTransition(async () => {
      const res = await updateUserRole({ role: selectedRole });
      if (!res.success) {
        setError(res.error);
      } else {
        await update();
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 dark:from-neutral-950 dark:to-neutral-900">
      <Card className="w-full max-w-lg border border-neutral-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-900/70">
        <CardHeader className="text-center">
          <CardTitle className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-neutral-50 dark:to-neutral-400">
            Welcome to Skillora
          </CardTitle>
          <CardDescription className="text-base">
            Tell us about yourself to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-neutral-500">
            How would you like to use Skillora?
          </p>

          <button
            type="button"
            onClick={() => setSelectedRole("STUDENT")}
            className={`w-full rounded-xl border-2 p-6 text-left transition-all duration-200 ${
              selectedRole === "STUDENT"
                ? "border-neutral-900 bg-neutral-50 shadow-md dark:border-neutral-300 dark:bg-neutral-800"
                : "border-neutral-200 bg-white/50 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-950/50 dark:hover:border-neutral-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  I&apos;m a Student
                </h3>
                <p className="text-sm text-neutral-500">
                  Browse courses, learn at your own pace
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("TEACHER")}
            className={`w-full rounded-xl border-2 p-6 text-left transition-all duration-200 ${
              selectedRole === "TEACHER"
                ? "border-neutral-900 bg-neutral-50 shadow-md dark:border-neutral-300 dark:bg-neutral-800"
                : "border-neutral-200 bg-white/50 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-950/50 dark:hover:border-neutral-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  I&apos;m a Teacher
                </h3>
                <p className="text-sm text-neutral-500">
                  Create courses, manage students, earn revenue
                </p>
              </div>
            </div>
          </button>

          {error && (
            <div className="rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full gap-2 font-semibold"
            disabled={!selectedRole || isPending}
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
