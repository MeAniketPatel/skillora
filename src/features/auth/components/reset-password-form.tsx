"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { z } from "zod";

import { resetPassword } from "../actions/auth.actions";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";

  useEffect(() => {
    if (watch("confirmPassword")) {
      trigger("confirmPassword");
    }
  }, [passwordValue, trigger, watch]);

  const strengthChecks = [
    { label: "At least 12 characters", met: passwordValue.length >= 12 },
    { label: "Contains a number", met: /\d/.test(passwordValue) },
    { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(passwordValue) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(passwordValue) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(passwordValue) },
  ];

  const strengthScore = strengthChecks.filter(c => c.met).length;

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

      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(res.data.success || "Password updated successfully.");
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
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...register("password")}
                disabled={isPending || !token}
                className="bg-white/50 pl-10 pr-10 dark:bg-neutral-950/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-red-500">
                {errors.password.message}
              </p>
            )}

            {passwordValue.length > 0 && (
              <div className="space-y-2 mt-2 pt-1">
                <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <div className={`h-full transition-all duration-500 ${strengthScore <= 1 ? 'w-0' : strengthScore === 2 ? 'bg-red-500 w-1/3' : strengthScore === 3 ? 'bg-yellow-500 w-2/3' : strengthScore === 4 ? 'bg-yellow-500 w-full' : 'bg-green-500 w-full'}`} />
                </div>
                <div className="grid grid-cols-1 gap-1 text-xs text-neutral-500">
                  {strengthChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 transition-colors duration-300">
                      {check.met ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 opacity-40" />
                      )}
                      <span className={check.met ? "text-neutral-700 dark:text-neutral-300" : ""}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                {...register("confirmPassword")}
                disabled={isPending || !token}
                className="bg-white/50 pl-10 pr-10 dark:bg-neutral-950/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
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
