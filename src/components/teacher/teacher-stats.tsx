import { BookOpen, Users, DollarSign, Star } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";
import { formatPrice } from "@/lib/utils";

interface TeacherStatsProps {
  coursesCount: number;
  studentsCount: number;
  earnings: number;
  averageRating: number;
}

export function TeacherStats({
  coursesCount,
  studentsCount,
  earnings,
  averageRating,
}: TeacherStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Courses"
        value={coursesCount}
        icon={BookOpen}
      />
      <StatsCard
        label="Total Students"
        value={studentsCount}
        icon={Users}
      />
      <StatsCard
        label="Total Earnings"
        value={formatPrice(earnings)}
        icon={DollarSign}
      />
      <StatsCard
        label="Average Rating"
        value={`${averageRating.toFixed(1)} / 5.0`}
        icon={Star}
      />
    </div>
  );
}
