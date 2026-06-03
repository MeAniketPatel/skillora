"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, School, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser } from "@/actions/auth.actions";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TEACHER"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    },
  });

  const selectedRole = watch("role");

  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const roleParam = searchParams?.get("role") ?? new URLSearchParams(window.location.search).get("role");
      if (roleParam && roleParam.toLowerCase() === "teacher") {
        setValue("role", "TEACHER");
      }
    } catch (e) {
      // ignore
    }
  }, [searchParams, setValue]);

  const onSubmit = (values: RegisterValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await registerUser(values);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Account created! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <Card className="w-full max-w-md border border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
          Create an account
        </CardTitle>
        <CardDescription>
          Choose your role and enter your details to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Custom Role Selector */}
          <div className="space-y-2">
            <Label>I want to join as a</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("role", "STUDENT")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                  selectedRole === "STUDENT"
                    ? "border-neutral-950 bg-neutral-50/50 dark:border-neutral-50 dark:bg-neutral-800/50 font-semibold"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-transparent"
                }`}
              >
                <GraduationCap
                  className={`h-6 w-6 mb-2 ${selectedRole === "STUDENT" ? "text-neutral-950 dark:text-neutral-50" : "text-neutral-400"}`}
                />
                <span className="text-sm">Student</span>
                <span className="text-xs text-neutral-500 mt-1">
                  To enroll & learn
                </span>
              </button>

              <button
                type="button"
                onClick={() => setValue("role", "TEACHER")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                  selectedRole === "TEACHER"
                    ? "border-neutral-950 bg-neutral-50/50 dark:border-neutral-50 dark:bg-neutral-800/50 font-semibold"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-transparent"
                }`}
              >
                <School
                  className={`h-6 w-6 mb-2 ${selectedRole === "TEACHER" ? "text-neutral-950 dark:text-neutral-50" : "text-neutral-400"}`}
                />
                <span className="text-sm">Teacher</span>
                <span className="text-xs text-neutral-500 mt-1">
                  To create & sell
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              disabled={isPending}
              className="bg-white/50 dark:bg-neutral-950/50"
            />
            {errors.name && (
              <p className="text-sm text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              disabled={isPending}
              className="bg-white/50 dark:bg-neutral-950/50"
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                disabled={isPending}
                className="bg-white/50 dark:bg-neutral-950/50 pr-10"
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
              <p className="text-sm text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isPending}
                className="bg-white/50 dark:bg-neutral-950/50 pr-10"
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
              <p className="text-sm text-red-500 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200/50 dark:border-red-900/50 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-lg border border-green-200/50 dark:border-green-900/50 font-medium">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full font-semibold relative overflow-hidden group"
            disabled={isPending}
          >
            <span className="absolute inset-0 bg-neutral-950/10 dark:bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" disabled={isPending}>
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Google
          </Button>
          <Button variant="outline" className="w-full" disabled={isPending}>
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-neutral-100 dark:border-neutral-800/50 py-4">
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-neutral-950 dark:text-neutral-50 hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
