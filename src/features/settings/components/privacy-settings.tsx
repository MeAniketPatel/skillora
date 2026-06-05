"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { privacySettingsSchema, PrivacySettingsInput } from "@/features/privacy";
import { updatePrivacySettingsAction } from "@/features/privacy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { Shield, Eye, MessageSquare, ShieldAlert, Users, Ban } from "lucide-react";

interface PrivacySettingsProps {
  initialSettings: {
    profileVisible: boolean;
    activityVisible: boolean;
    messagingPreference: string;
  };
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, setValue } = useForm<PrivacySettingsInput>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisible: initialSettings.profileVisible,
      activityVisible: initialSettings.activityVisible,
      messagingPreference: initialSettings.messagingPreference as "ALL" | "FRIENDS" | "NONE",
    },
  });

  const messagingPreference = watch("messagingPreference");

  const onSubmit = (values: PrivacySettingsInput) => {
    startTransition(async () => {
      const res = await updatePrivacySettingsAction(values);
      if (res.success) {
        toast.success("Privacy settings updated successfully.");
      } else {
        toast.error(res.error || "Failed to update privacy settings");
      }
    });
  };

  const messageOptions = [
    { value: "ALL", label: "Everyone", desc: "Allow any registered student or instructor to message you", icon: Users },
    { value: "FRIENDS", label: "Friends Only", desc: "Only allow students you follow or who follow you back", icon: Shield },
    { value: "NONE", label: "No One", desc: "Block all direct messages. Keep chat channels disabled", icon: Ban },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Visibility Settings */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 rounded-xl">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-neutral-850 dark:text-neutral-100">Visibility & Discovery</CardTitle>
              <CardDescription className="text-xs text-neutral-450">Control how other members see your profile and studies.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {/* Public Profile */}
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="space-y-0.5 max-w-[80%]">
              <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Public Profile Discovery</Label>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Allow other students to find your profile, see your certificates, and browse your portfolio projects.
              </p>
            </div>
            <Switch
              checked={watch("profileVisible")}
              onCheckedChange={(checked) => setValue("profileVisible", checked)}
            />
          </div>

          {/* Activity Logs */}
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="space-y-0.5 max-w-[80%]">
              <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Public Activity Feed</Label>
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                Publish achievements, streaks, and course completions to the global social community feed.
              </p>
            </div>
            <Switch
              checked={watch("activityVisible")}
              onCheckedChange={(checked) => setValue("activityVisible", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Messaging Preferences */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-250/50 dark:border-neutral-800/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-450 rounded-xl">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-neutral-850 dark:text-neutral-100">Direct Messages</CardTitle>
              <CardDescription className="text-xs text-neutral-450">Limit who can initiate direct chats with you.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {messageOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = messagingPreference === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("messagingPreference", opt.value as any)}
                className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/20 dark:bg-purple-950/10 ring-2 ring-purple-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-purple-500" : "text-neutral-400 group-hover:text-neutral-600"}`} />
                  <span className={`text-xs font-bold ${isSelected ? "text-purple-900 dark:text-purple-200" : "text-neutral-700 dark:text-neutral-300"}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-450">{opt.desc}</p>
                {isSelected && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500" />
                )}
              </button>
            );
          })}
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
