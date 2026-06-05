"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  KeyRound,
  LogOut,
  Mail,
  MonitorSmartphone,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  logoutAllSessions,
  logoutSession,
  updateUserSettings,
} from "@/actions/auth.actions";
import SignOutButton from "@/components/auth/signout-button";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
});

type SettingsValues = z.infer<typeof settingsSchema>;

type AuthSessionSummary = {
  sessionId: string;
  provider: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokeReason: string | null;
  isCurrent: boolean;
};

interface SettingsClientFormProps {
  user: {
    name: string | null;
    email: string | null;
    role: string | null;
  };
  authSessions: AuthSessionSummary[];
}

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSessionLabel(session: AuthSessionSummary) {
  const provider = session.provider || "credentials";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function getCompactUserAgent(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  if (userAgent.length <= 96) return userAgent;
  return `${userAgent.slice(0, 96)}...`;
}

export default function SettingsClientForm({
  user,
  authSessions,
}: SettingsClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isSecurityPending, startSecurityTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [securityError, setSecurityError] = React.useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = React.useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      password: "",
    },
  });

  const onSubmit = (values: SettingsValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload: { name?: string; email?: string; password?: string } = {
        name: values.name,
        email: values.email,
      };
      if (values.password && values.password.trim() !== "") {
        payload.password = values.password;
      }

      const res = await updateUserSettings(payload);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(res.data.success || "Profile settings updated successfully!");
        router.refresh();
      }
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    setSecurityError(null);
    setSecuritySuccess(null);
    setPendingSessionId(sessionId);

    startSecurityTransition(async () => {
      const res = await logoutSession({ sessionId });
      setPendingSessionId(null);

      if (!res.success) {
        setSecurityError(res.error);
      } else {
        setSecuritySuccess(res.data.success || "Session signed out successfully.");
        router.refresh();
      }
    });
  };

  const handleLogoutAllSessions = () => {
    setSecurityError(null);
    setSecuritySuccess(null);

    startSecurityTransition(async () => {
      await logoutAllSessions();
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account details, security preferences, and view your profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Quick Profile Info Card */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 h-fit md:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
              <User className="h-10 w-10 text-neutral-500" />
            </div>
            <CardTitle className="mt-4 truncate">{user.name || "User Profile"}</CardTitle>
            <CardDescription className="uppercase text-[10px] tracking-widest font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md w-fit mx-auto mt-2 text-neutral-600 dark:text-neutral-300">
              {user.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-neutral-100 dark:border-neutral-800/50 pt-4 space-y-3">
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
              <SignOutButton />
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Settings Update Form */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your account name, email address, or update your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="name"
                    {...register("name")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg flex items-start gap-2 border border-red-200/50">
                  <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-lg border border-green-200/50">
                  {success}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending} className="h-9 gap-2">
                  <Save className="h-4 w-4" />
                  {isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 md:col-span-3">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neutral-500" />
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Review signed-in devices and revoke access you do not recognize.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="w-full gap-2 sm:w-auto"
                onClick={handleLogoutAllSessions}
                disabled={isSecurityPending}
              >
                <LogOut className="h-4 w-4" />
                {isSecurityPending ? "Signing out..." : "Sign out everywhere"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {securityError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{securityError}</span>
              </div>
            )}

            {securitySuccess && (
              <div className="mb-4 rounded-lg border border-green-200/50 bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
                {securitySuccess}
              </div>
            )}

            {authSessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
                No active sessions found.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {authSessions.map((authSession) => (
                  <div
                    key={authSession.sessionId}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <MonitorSmartphone className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm font-semibold">
                          {getSessionLabel(authSession)}
                        </span>
                        {authSession.isCurrent && (
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        Last active {formatSessionDate(authSession.lastSeenAt)}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {authSession.ipAddress || "Unknown IP"} -{" "}
                        {getCompactUserAgent(authSession.userAgent)}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {authSession.isCurrent ? (
                        <SignOutButton />
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2 sm:w-auto"
                          onClick={() => handleRevokeSession(authSession.sessionId)}
                          disabled={
                            isSecurityPending &&
                            pendingSessionId === authSession.sessionId
                          }
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          {isSecurityPending &&
                          pendingSessionId === authSession.sessionId
                            ? "Revoking..."
                            : "Revoke"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
