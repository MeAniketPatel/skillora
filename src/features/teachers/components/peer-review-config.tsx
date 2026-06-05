"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { peerReviewConfigSchema } from "@/features/peer-reviews/contracts/peer-review.contract";
import { savePeerReviewConfig } from "@/actions/peer-review.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Loader2, Users, Calendar } from "lucide-react";

interface PeerReviewConfigProps {
  lessonId: string;
  initialConfig?: {
    requiredReviews: number;
    dueDate: Date;
  } | null;
}

export function PeerReviewConfig({ lessonId, initialConfig }: PeerReviewConfigProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Format date to local datetime string for input field value (YYYY-MM-DDThh:mm)
  const defaultDueDate = initialConfig?.dueDate
    ? new Date(initialConfig.dueDate).toISOString().slice(0, 16)
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(peerReviewConfigSchema) as any,
    defaultValues: {
      requiredReviews: initialConfig?.requiredReviews || 3,
      dueDate: defaultDueDate,
    },
  });

  const onSubmit = (data: any) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await savePeerReviewConfig(lessonId, data);
      if (!res.success) {
        setError(res.error || "Failed to save peer review configuration.");
      } else {
        setSuccess("Peer review configuration saved!");
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-neutral-500" />
          Peer Review Configuration
        </CardTitle>
        <CardDescription className="text-[11px]">
          Configure how student submissions are peer-reviewed before being finalized.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requiredReviews" className="text-xs font-bold flex items-center gap-1">
              Required Reviews Per Student
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="requiredReviews"
                type="number"
                min={1}
                max={10}
                placeholder="3"
                {...register("requiredReviews")}
                disabled={isPending}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            {errors.requiredReviews?.message && (
              <p className="text-[10px] text-red-500 font-medium">{String(errors.requiredReviews.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-xs font-bold flex items-center gap-1">
              Peer Review Due Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="dueDate"
                type="datetime-local"
                {...register("dueDate")}
                disabled={isPending}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            {errors.dueDate?.message && (
              <p className="text-[10px] text-red-500 font-medium">{String(errors.dueDate.message)}</p>
            )}
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
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
