import React from "react";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserGoals } from "@/features/students";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { CreateGoalForm } from "@/components/student/create-goal-form";
import { LearningGoals } from "@/components/student/learning-goals";

export default async function GoalsPage() {
  const user = await requireAuth();
  const goals = await getUserGoals(user.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Learning Goals"
        description="Pace your learning by setting weekly or monthly lesson completion goals."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Set new goal form */}
        <div className="md:col-span-1">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Set a Goal</CardTitle>
              <CardDescription>Target a specific milestone to push your skills forward.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateGoalForm />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List of current goals */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold tracking-tight px-1">Active Targets</h3>
          <LearningGoals goals={goals} />
        </div>
      </div>
    </div>
  );
}
