"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { z } from "zod";

import { requestPasswordReset } from "../actions/auth.actions";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await requestPasswordReset(values);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(res.data.success || "Password reset email sent.");
      }
    });
  };

  return (
    <Card className="w-full max-w-md border border-neutral-200/50 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900/70">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-neutral-50 dark:to-neutral-400">
          Forgot password
        </CardTitle>
        <CardDescription>
          Enter your account email to receive a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                disabled={isPending}
                className="bg-white/50 pl-10 dark:bg-neutral-950/50"
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-red-500">
                {errors.email.message}
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

          <Button type="submit" className="w-full gap-2 font-semibold" disabled={isPending}>
            <Mail className="h-4 w-4" />
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-neutral-100 py-4 dark:border-neutral-800/50">
        <p className="text-sm text-neutral-500">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-neutral-950 transition-all hover:underline dark:text-neutral-50"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
