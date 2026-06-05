"use client";

import { useEffect, useState } from "react";
import { getCourseInsightsAction } from "@/features/courses";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Users, GraduationCap, Star, DollarSign, Loader2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface CourseInsightsProps {
  courseId: string;
}

interface InsightsData {
  totalEnrolled: number;
  completionRate: number;
  rating: number;
  revenue: number;
  sparklineData: { date: string; students: number }[];
}

export function CourseInsights({ courseId }: CourseInsightsProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsights() {
      const res = await getCourseInsightsAction(courseId);
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || "Failed to load course insights.");
      }
      setLoading(false);
    }
    loadInsights();
  }, [courseId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 animate-pulse">
            <CardContent className="h-20 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-4 rounded-xl">
        {error || "No data available."}
      </div>
    );
  }

  const statCards = [
    {
      title: "Enrolled Students",
      value: data.totalEnrolled,
      icon: Users,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
      sparkline: true,
    },
    {
      title: "Completion Rate",
      value: `${Math.round(data.completionRate)}%`,
      icon: GraduationCap,
      color: "text-green-500 bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Average Rating",
      value: data.rating > 0 ? data.rating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-955/30",
    },
    {
      title: "Total Revenue",
      value: `$${data.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <Card key={card.title} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-4 flex flex-col justify-between h-full min-h-[110px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-neutral-850 dark:text-neutral-50">
                {card.value}
              </span>

              {card.sparkline && data.sparklineData.length > 0 && (
                <div className="h-8 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sparklineData}>
                      <defs>
                        <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="#3b82f6"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#sparklineGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
