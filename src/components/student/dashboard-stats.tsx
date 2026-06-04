import { BookOpen, CheckCircle, Award } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";

interface DashboardStatsProps {
  enrolledCount: number;
  completedCount: number;
  certificatesCount: number;
}

export function DashboardStats({
  enrolledCount,
  completedCount,
  certificatesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        label="Enrolled Courses"
        value={enrolledCount}
        icon={BookOpen}
      />
      <StatsCard
        label="Completed Lessons"
        value={completedCount}
        icon={CheckCircle}
      />
      <StatsCard
        label="Certificates Earned"
        value={certificatesCount}
        icon={Award}
      />
    </div>
  );
}
