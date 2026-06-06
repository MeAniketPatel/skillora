"use client";

import { useTransition, useState } from "react";
import {
  featureFlagSchema,
  createFeatureFlagAction,
  toggleFeatureFlagAction,
  updateFeatureFlagRolloutAction,
  deleteFeatureFlagAction,
} from "@/features/feature-flags";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Slider } from "@/shared/components/ui/slider";
import { Loader2, Trash2, Key, Info, Plus } from "lucide-react";

interface FormValues {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPct: number;
}


interface FeatureFlagType {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  rolloutPct: number;
  createdAt: Date;
}

interface FeatureFlagsPanelProps {
  initialFlags: FeatureFlagType[];
}

export function FeatureFlagsPanel({ initialFlags }: FeatureFlagsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(featureFlagSchema) as any,
    defaultValues: {
      key: "",
      name: "",
      description: "",
      isEnabled: false,
      rolloutPct: 100,
    },
  });


  const onSubmit = (data: FormValues) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await createFeatureFlagAction(data);
      if (!res.success) {
        setError(res.error || "Failed to create feature flag.");
      } else {
        setSuccess("Feature flag created successfully!");
        reset();
        router.refresh();
      }
    });
  };

  const handleToggle = (id: string, isEnabled: boolean) => {
    startTransition(async () => {
      const res = await toggleFeatureFlagAction({ id, isEnabled });
      if (!res.success) {
        alert(res.error || "Failed to toggle feature flag.");
      } else {
        router.refresh();
      }
    });
  };

  const handleRolloutChange = (id: string, value: number[]) => {
    startTransition(async () => {
      const res = await updateFeatureFlagRolloutAction({ id, rolloutPct: value[0] });
      if (!res.success) {
        alert(res.error || "Failed to update rollout percentage.");
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this feature flag?")) return;
    startTransition(async () => {
      const res = await deleteFeatureFlagAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete feature flag.");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Create Flag Form */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm lg:col-span-1">
        <CardContent className="p-6">
          <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-500" />
            Add Feature Flag
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key" className="text-xs font-bold">Flag Key (snake_case)</Label>
              <Input
                id="key"
                placeholder="e.g. ai_tutor_enabled"
                {...register("key")}
                disabled={isPending}
                className="h-10 rounded-xl"
              />
              {errors.key && (
                <p className="text-[10px] text-red-500 font-medium">{errors.key.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold">Display Name</Label>
              <Input
                id="name"
                placeholder="e.g. AI Tutor Integration"
                {...register("name")}
                disabled={isPending}
                className="h-10 rounded-xl"
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold">Description</Label>
              <Input
                id="description"
                placeholder="Briefly state what this controls..."
                {...register("description")}
                disabled={isPending}
                className="h-10 rounded-xl"
              />
              {errors.description && (
                <p className="text-[10px] text-red-500 font-medium">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-850 rounded-xl border border-neutral-200/40 dark:border-neutral-800/40">
              <div className="space-y-0.5">
                <Label htmlFor="isEnabled" className="text-xs font-bold cursor-pointer">Enabled by default</Label>
                <p className="text-[10px] text-neutral-400">Activate this flag immediately</p>
              </div>
              <Switch
                id="isEnabled"
                disabled={isPending}
                onCheckedChange={(checked) => setValue("isEnabled", checked)}
              />
            </div>

            {error && (
              <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p className="text-[11px] font-semibold text-green-500 bg-green-50 dark:bg-green-950/30 p-2.5 rounded-lg">
                {success}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="w-full h-10 rounded-xl text-xs gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Flag
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Flag List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
          <Key className="h-4 w-4 text-indigo-500" />
          Active Feature Toggles
        </h2>

        {initialFlags.length === 0 ? (
          <Card className="border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-8 text-center bg-white dark:bg-neutral-900 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
              <div className="h-10 w-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                <Info className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-sm font-semibold text-neutral-850 dark:text-neutral-50">No feature flags defined</p>
              <p className="text-xs text-neutral-400">
                Register flags to control access to experimental features dynamically.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {initialFlags.map((flag) => (
              <Card
                key={flag.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 font-mono font-bold rounded text-neutral-600 dark:text-neutral-350">
                          {flag.key}
                        </span>
                        <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">
                          {flag.name}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {flag.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id={`toggle-${flag.id}`}
                        checked={flag.isEnabled}
                        disabled={isPending}
                        onCheckedChange={(checked) => handleToggle(flag.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(flag.id)}
                        disabled={isPending}
                        className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl animate-fade-in"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rollout slider */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
                      <span>Rollout Target: {flag.rolloutPct}% of users</span>
                      <span>Gradual Rollout</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        defaultValue={[flag.rolloutPct]}
                        max={100}
                        step={5}
                        disabled={isPending}
                        onValueCommit={(val) => handleRolloutChange(flag.id, val)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
