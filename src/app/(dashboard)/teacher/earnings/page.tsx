import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export default async function TeacherEarningsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  // Get teacher's courses
  const teacherCourses = await db.course.findMany({
    where: { teacherId: session.user.id },
    select: { id: true, title: true, price: true },
  });

  const courseIds = teacherCourses.map((c) => c.id);

  // Get sales transactions on teacher's courses
  const sales = await db.purchase.findMany({
    where: {
      enrollment: {
        courseId: { in: courseIds },
      },
      status: "COMPLETED",
    },
    include: {
      enrollment: {
        include: {
          course: true,
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalSalesCount = sales.length;
  const grossRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const platformFee = grossRevenue * 0.1; // 10% fee
  const netEarnings = grossRevenue - platformFee;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings & Revenue</h1>
        <p className="text-sm text-neutral-500">Track course sales, platform commission fees, and net payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalSalesCount}</div>
            <p className="text-[10px] text-neutral-400 mt-1">Total enrollment purchases</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Gross Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{formatPrice(grossRevenue)}</div>
            <p className="text-[10px] text-neutral-400 mt-1">Platform fee deduction: 10%</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Net Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">{formatPrice(netEarnings)}</div>
            <p className="text-[10px] text-neutral-400 mt-1">Your absolute share earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>A log of student transactions for your courses.</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              No sales have been generated yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Net share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium text-sm">
                      {sale.enrollment?.course?.title || "Unknown Course"}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {sale.enrollment?.user?.name || sale.enrollment?.user?.email || "Unknown User"}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(sale.amount)}
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-green-600 dark:text-green-400">
                      {formatPrice(sale.amount * 0.9)}
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
