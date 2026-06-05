import { PageHeader } from "@/shared/components/shared/page-header";
import { getPlatformRevenue, getRecentPurchases, getRevenueTimeSeries, getRevenueByTeacher, getRevenueByCourse } from "@/features/payments";
import { StatsCard } from "@/shared/components/shared/stats-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatPrice } from "@/shared/lib/utils";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { RevenueCharts } from "@/features/admin";

export default async function AdminRevenuePage() {
  const { grossSales, platformRevenue, totalTransactions } = await getPlatformRevenue();
  const transactions = await getRecentPurchases(25);

  // Get data for past 30 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();

  const timeSeries = await getRevenueTimeSeries({
    startDate,
    endDate,
    groupBy: "day",
  });

  const byTeacher = await getRevenueByTeacher();
  const byCourse = await getRevenueByCourse();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Revenue Dashboard"
        description="Monitor sales volume, platform commissions, and recent student checkout flows."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Gross Platform Sales"
          value={formatPrice(grossSales)}
          icon={DollarSign}
        />
        <StatsCard
          label="Platform Revenue (10%)"
          value={formatPrice(platformRevenue)}
          icon={Percent}
        />
        <StatsCard
          label="Total Transactions"
          value={totalTransactions.toString()}
          icon={TrendingUp}
        />
      </div>

      <RevenueCharts
        timeSeries={timeSeries}
        byTeacher={byTeacher}
        byCourse={byCourse}
      />

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Checkout Transactions</CardTitle>
          <CardDescription className="text-xs">
            Viewing last 25 transactional sales records on Skillora.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              No transactions recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <TableHead className="py-3.5 pl-6">Course</TableHead>
                    <TableHead className="py-3.5">Student</TableHead>
                    <TableHead className="py-3.5">Transaction Date</TableHead>
                    <TableHead className="py-3.5">Gross Price</TableHead>
                    <TableHead className="py-3.5 pr-6 text-right">Commission Cut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10">
                      <TableCell className="py-4 pl-6 text-xs font-bold text-neutral-850 dark:text-neutral-50">
                        {t.enrollment?.course?.title || "Unknown Course"}
                      </TableCell>
                      <TableCell className="py-4 text-xs text-neutral-500">
                        {t.enrollment?.user?.email || "Unknown Student"}
                      </TableCell>
                      <TableCell className="py-4 text-xs text-neutral-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-bold text-neutral-750 dark:text-neutral-250">
                        {formatPrice(t.amount)}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right text-xs font-bold text-green-600 dark:text-green-400">
                        {formatPrice(t.amount * 0.1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
