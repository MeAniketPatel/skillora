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
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Camera,
  Loader2,
  Bookmark,
  FileText,
} from "lucide-react";

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useUploadThing } from "@/shared/lib/uploadthing";
import { logoutAllSessions, logoutSession, updateUserSettings } from "@/features/auth";
import { SignOutButton } from "@/features/auth";

const settingsSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    image: z.string().url().or(z.literal("")).optional().nullable(),
    headline: z.string().max(100, "Headline must be under 100 characters").optional().nullable(),
    bio: z.string().max(1000, "Bio must be under 1000 characters").optional().nullable(),
    twitter: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
    linkedin: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
    github: z.string().url("Must be a valid URL").or(z.literal("")).optional().nullable(),
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (values) => {
      if (values.newPassword && values.newPassword.length > 0) {
        return values.newPassword === values.confirmNewPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

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
    image: string | null;
    headline: string | null;
    bio: string | null;
    socialLinks: { twitter?: string; linkedin?: string; github?: string };
    hasPassword: boolean;
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
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(user.image || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      setAvatarUploading(false);
      const url = res?.[0]?.url || res?.[0]?.ufsUrl;
      if (url) {
        setAvatarUrl(url);
        setValue("image", url, { shouldDirty: true });
        toast.success("Profile picture uploaded! Click Save Settings to save changes.");
      }
    },
    onUploadError: (error) => {
      setAvatarUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    },
    onUploadBegin: () => {
      setAvatarUploading(true);
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("File size must be less than 4MB");
        return;
      }
      startUpload([file]);
    }
  };
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [securityError, setSecurityError] = React.useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = React.useState<string | null>(null);
  const [pendingSessionId, setPendingSessionId] = React.useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      headline: user.headline || "",
      bio: user.bio || "",
      twitter: user.socialLinks?.twitter || "",
      linkedin: user.socialLinks?.linkedin || "",
      github: user.socialLinks?.github || "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";
  const confirmNewPasswordValue = watch("confirmNewPassword") || "";

  const passwordsMismatch =
    newPasswordValue.length > 0 &&
    confirmNewPasswordValue.length > 0 &&
    newPasswordValue !== confirmNewPasswordValue;

  const strengthChecks = [
    { label: "At least 12 characters", met: newPasswordValue.length >= 12 },
    { label: "Contains a number", met: /\d/.test(newPasswordValue) },
    { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(newPasswordValue) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(newPasswordValue) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(newPasswordValue) },
  ];

  const strengthScore = strengthChecks.filter(c => c.met).length;

  const onSubmit = (values: SettingsValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload: {
        name?: string;
        email?: string;
        password?: string;
        oldPassword?: string;
        image?: string | null;
        headline?: string | null;
        bio?: string | null;
        twitter?: string | null;
        linkedin?: string | null;
        github?: string | null;
      } = {
        name: values.name,
        email: values.email,
        image: values.image || null,
        headline: values.headline || null,
        bio: values.bio || null,
        twitter: values.twitter || null,
        linkedin: values.linkedin || null,
        github: values.github || null,
      };

      if (values.newPassword && values.newPassword.trim() !== "") {
        payload.password = values.newPassword;
        if (values.oldPassword) {
          payload.oldPassword = values.oldPassword;
        }
      }

      const res = await updateUserSettings(payload);
      if (!res.success) {
        setError(res.error);
        toast.error(res.error || "Failed to update settings");
      } else {
        setSuccess(res.data.success || "Settings updated successfully!");
        toast.success("Settings updated successfully!");
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
        toast.error(res.error || "Failed to revoke session");
      } else {
        setSecuritySuccess(res.data.success || "Session signed out successfully.");
        toast.success("Session revoked.");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Quick Profile Info Card & Photo Upload */}
        <div className="space-y-6 md:col-span-1">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm h-fit">
            <CardHeader className="text-center pb-4">
              {/* Interactive Avatar Container */}
              <div 
                onClick={handleAvatarClick}
                className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Avatar className="w-full h-full">
                  <AvatarImage src={avatarUrl || ""} alt={user.name || "User"} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-neutral-900/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="h-5 w-5 text-white animate-bounce" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                </div>

                {/* Uploading Spinner */}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center z-10">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={avatarUploading || isPending}
              />

              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                Click avatar to upload new photo (Max 4MB)
              </p>

              <CardTitle className="mt-4 truncate text-lg font-semibold">{user.name || "User Profile"}</CardTitle>
              <CardDescription className="uppercase text-[9px] tracking-widest font-bold px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mx-auto mt-2 text-neutral-600 dark:text-neutral-300">
                {user.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-neutral-100 dark:border-neutral-800/50 pt-4 space-y-4">
              <div className="text-xs text-neutral-500 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
                <SignOutButton />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Form column */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-6">
          {/* Card 1: Profile Details */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Configure your public display name, biography, and social links.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden input to link uploaded image to the form */}
              <input type="hidden" {...register("image")} />

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="name"
                    {...register("name")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline" className="text-xs font-semibold">Headline</Label>
                <div className="relative">
                  <Bookmark className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="headline"
                    {...register("headline")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                    placeholder="Senior Developer / Student at Skillora"
                  />
                </div>
                {errors.headline && (
                  <p className="text-xs text-red-500 font-medium">{errors.headline.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-semibold">Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    disabled={isPending}
                    rows={4}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 text-sm resize-none"
                    placeholder="Tell us about your background, skills, and goals..."
                  />
                </div>
                {errors.bio && (
                  <p className="text-xs text-red-500 font-medium">{errors.bio.message}</p>
                )}
              </div>

              {/* Social Links */}
              <div className="border-t border-neutral-100 dark:border-neutral-800/50 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Social Links
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-xs font-semibold">Twitter / X</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="twitter"
                        {...register("twitter")}
                        disabled={isPending}
                        className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9 text-xs"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    {errors.twitter && (
                      <p className="text-xs text-red-500 font-medium">{errors.twitter.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-xs font-semibold">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="linkedin"
                        {...register("linkedin")}
                        disabled={isPending}
                        className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9 text-xs"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-xs text-red-500 font-medium">{errors.linkedin.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-xs font-semibold">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="github"
                        {...register("github")}
                        disabled={isPending}
                        className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9 text-xs"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    {errors.github && (
                      <p className="text-xs text-red-500 font-medium">{errors.github.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Security & Password */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
            <CardHeader>
              <CardTitle>Security & Password</CardTitle>
              <CardDescription>
                Configure credentials, email settings, and update your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={isPending}
                    className="pl-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800/50 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Change Password
                </h3>

                {user.hasPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword" className="text-xs font-semibold">Current Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...register("oldPassword")}
                        disabled={isPending}
                        className="pl-10 pr-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.oldPassword && (
                      <p className="text-xs text-red-500 font-medium">{errors.oldPassword.message}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs font-semibold">
                      {user.hasPassword ? "New Password" : "Set a Password"}
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder={user.hasPassword ? "Enter new password" : "Create a password"}
                        {...register("newPassword")}
                        disabled={isPending}
                        className="pl-10 pr-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>
                    )}

                    {newPasswordValue.length > 0 && (
                      <div className="space-y-2 mt-2 pt-1">
                        <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                          <div className={`h-full transition-all duration-500 ${strengthScore <= 1 ? 'w-0' : strengthScore === 2 ? 'bg-red-500 w-1/3' : strengthScore === 3 ? 'bg-yellow-500 w-2/3' : strengthScore === 4 ? 'bg-yellow-500 w-full' : 'bg-green-500 w-full'}`} />
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-[10px] text-neutral-500">
                          {strengthChecks.map((check, idx) => (
                            <div key={idx} className="flex items-center gap-1 transition-colors duration-350">
                              {check.met ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                              ) : (
                                <Circle className="h-3 w-3 opacity-40 shrink-0" />
                              )}
                              <span className={check.met ? "text-neutral-700 dark:text-neutral-300" : ""}>{check.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-xs font-semibold">Confirm New Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...register("confirmNewPassword")}
                        disabled={isPending}
                        className="pl-10 pr-10 bg-white/50 dark:bg-neutral-950/50 h-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {(errors.confirmNewPassword || passwordsMismatch) && (
                      <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="space-y-4">
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
              <Button type="submit" disabled={isPending} className="h-9 gap-2 shadow-sm">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </form>

        {/* Full-width Card 3: Active Sessions */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm md:col-span-3">
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
                className="w-full gap-2 sm:w-auto text-xs"
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
              <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-850">
                No active sessions found.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {authSessions.map((authSession) => (
                  <div
                    key={authSession.sessionId}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between animate-fadeIn"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <MonitorSmartphone className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm font-semibold">
                          {getSessionLabel(authSession)}
                        </span>
                        {authSession.isCurrent && (
                          <span className="rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-350">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        Last active {formatSessionDate(authSession.lastSeenAt)}
                      </p>
                      <p className="truncate text-[11px] text-neutral-450 dark:text-neutral-500">
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
                          className="w-full gap-2 sm:w-auto text-xs"
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
