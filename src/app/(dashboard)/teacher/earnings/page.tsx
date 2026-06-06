import { requireTeacher } from "@/shared/lib/auth-helpers";
import { getTeacherEarnings } from "@/features/payments/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign } from "lucide-react";

export default async function TeacherEarningsPage() {
  const user = await requireTeacher();
  const { totalEarnings, earningsByCourse } = await getTeacherEarnings(user.id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Earnings & Payouts</h1>
        <p className="text-muted-foreground">Track your revenue and course sales.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Lifetime Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After platform fees</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Earnings by Course</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(earningsByCourse).map(([courseId, data]) => (
          <Card key={courseId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base truncate">{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Revenue:</span>
                <span className="font-semibold">${data.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sales:</span>
                <span className="font-semibold">{data.sales}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
