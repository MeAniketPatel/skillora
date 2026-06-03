"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { z } from "zod";

import { resetPassword } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    token ? null : "This password reset link is missing a token."
  );
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    if (!token) {
      setError("This password reset link is missing a token.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await resetPassword({
        token,
        password: values.password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(res.success || "Password updated successfully.");
        setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <Card className="w-full max-w-md border border-neutral-200/50 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900/70">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-neutral-50 dark:to-neutral-400">
          Reset password
        </CardTitle>
        <CardDescription>Choose a new password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
                disabled={isPending || !token}
                className="bg-white/50 pl-10 dark:bg-neutral-950/50"
              />
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...register("confirmPassword")}
                disabled={isPending || !token}
                className="bg-white/50 pl-10 dark:bg-neutral-950/50"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm font-medium text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200/50 bg-green-50 p-3 text-sm font-medium text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full gap-2 font-semibold"
            disabled={isPending || !token}
          >
            <KeyRound className="h-4 w-4" />
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-neutral-100 py-4 dark:border-neutral-800/50">
        <Link
          href="/login"
          className="text-sm font-semibold text-neutral-950 transition-all hover:underline dark:text-neutral-50"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
