import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch counts
  const usersCount = await db.user.count();
  const coursesCount = await db.course.count();
  const enrollmentsCount = await db.enrollment.count();

  // Fetch all transactions
  const transactions = await db.purchase.findMany({
    where: { status: "COMPLETED" },
    include: {
      enrollment: {
        include: {
          course: true,
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const grossSales = await db.purchase.aggregate({
    where: { status: "COMPLETED" },
    _sum: {
      amount: true,
    },
  });

  const platformRevenue = (grossSales._sum.amount || 0) * 0.1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
        <p className="text-sm text-neutral-500">Manage users, audit course submissions, and monitor platform transaction flows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{usersCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{coursesCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Gross Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatPrice(grossSales._sum.amount || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Platform Cut (10%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
              {formatPrice(platformRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Recent Platform Purchases</CardTitle>
          <CardDescription>Auditing last 10 global transactions across courses.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              No transactions have been recorded.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Platform Cut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-sm">
                      {t.enrollment?.course?.title || "Unknown Course"}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {t.enrollment?.user?.email || "Unknown User"}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(t.amount)}
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-green-600 dark:text-green-400">
                      {formatPrice(t.amount * 0.1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
