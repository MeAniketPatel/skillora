"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailPreferenceSchema, type EmailPreferenceInput } from "@/features/email-preferences/contracts/email-preference.contract";;
import { updateEmailPreferencesAction } from "@/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { Mail, Bell, Calendar, Sparkles, MessageSquare, ShieldCheck } from "lucide-react";

interface NotificationSettingsProps {
  initialPreferences: {
    digestType: string;
    enrollment: boolean;
    certificates: boolean;
    promotions: boolean;
    forumReplies: boolean;
  };
}

export function NotificationSettings({ initialPreferences }: NotificationSettingsProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, setValue } = useForm<EmailPreferenceInput>({
    resolver: zodResolver(emailPreferenceSchema),
    defaultValues: {
      digestType: initialPreferences.digestType as "DAILY" | "WEEKLY" | "NEVER",
      enrollment: initialPreferences.enrollment,
      certificates: initialPreferences.certificates,
      promotions: initialPreferences.promotions,
      forumReplies: initialPreferences.forumReplies,
    },
  });

  const digestType = watch("digestType");

  const onSubmit = (values: EmailPreferenceInput) => {
    startTransition(async () => {
      const res = await updateEmailPreferencesAction(values);
      if (res.success) {
        toast.success("Notification settings updated successfully.");
      } else {
        toast.error(res.error || "Failed to update notification settings");
      }
    });
  };

  const digestOptions = [
    { value: "DAILY", label: "Daily Summary", desc: "Get compiled digest reports of updates every day", icon: Mail },
    { value: "WEEKLY", label: "Weekly Recap", desc: "Get one master recap of events every Sunday", icon: Calendar },
    { value: "NEVER", label: "Never", desc: "Disable automatic compiled email digest sheets entirely", icon: ShieldCheck },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Digest Preference Selection */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 rounded-xl">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-neutral-850 dark:text-neutral-100">Email Digest Schedule</CardTitle>
              <CardDescription className="text-xs text-neutral-450">Choose how frequently you would like to receive recap emails.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {digestOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = digestType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("digestType", opt.value as any)}
                className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 ring-2 ring-blue-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-blue-500" : "text-neutral-400 group-hover:text-neutral-600"}`} />
                  <span className={`text-xs font-bold ${isSelected ? "text-blue-900 dark:text-blue-200" : "text-neutral-700 dark:text-neutral-300"}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-450">{opt.desc}</p>
                {isSelected && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Email Preferences / Categories */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 rounded-xl">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-neutral-850 dark:text-neutral-100">Subscription Topics</CardTitle>
              <CardDescription className="text-xs text-neutral-450">Decide what updates prompt immediate notifications.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {/* Topic 1: Course Enrollments */}
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Course & Classroom Activity</Label>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Receive emails when courses publish lessons, assignment updates, or direct announcements are broadcasted.
              </p>
            </div>
            <Switch
              checked={watch("enrollment")}
              onCheckedChange={(checked) => setValue("enrollment", checked)}
            />
          </div>

          {/* Topic 2: Certificates */}
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Certificates & Milestones</Label>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Get notified instantly when you earn a verifiable graduation certificate or complete significant path milestones.
              </p>
            </div>
            <Switch
              checked={watch("certificates")}
              onCheckedChange={(checked) => setValue("certificates", checked)}
            />
          </div>

          {/* Topic 3: Promotions */}
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Offers & Weekly Recommendations</Label>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Receive coupon offers, instructor announcements, and tailored course suggestions aligned with your career interests.
              </p>
            </div>
            <Switch
              checked={watch("promotions")}
              onCheckedChange={(checked) => setValue("promotions", checked)}
            />
          </div>

          {/* Topic 4: Forum Replies */}
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Discussion Forum & Blog Activity</Label>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Receive updates when another student responds to your questions or replies to comments on your blog posts.
              </p>
            </div>
            <Switch
              checked={watch("forumReplies")}
              onCheckedChange={(checked) => setValue("forumReplies", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 active:translate-y-px"
        >
          {isPending ? "Saving changes..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
