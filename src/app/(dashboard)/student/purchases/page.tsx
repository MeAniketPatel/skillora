import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export default async function PurchasesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
        <p className="text-sm text-neutral-500">View your transactions, orders, and receipts.</p>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>A list of courses you have purchased on Skillora.</CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              You haven't made any purchases yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium text-sm">
                      {purchase.enrollment?.course?.title || "Unknown Course"}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(purchase.amount)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        purchase.status === "COMPLETED" 
                          ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}>
                        {purchase.status}
                      </span>
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
