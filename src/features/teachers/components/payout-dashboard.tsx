"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { payoutSchema } from "@/features/payouts/contracts/payout.contract";
import { requestPayoutAction } from "@/features/payouts/actions/payout.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { DollarSign, ArrowUpRight, History, Calendar, CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { z } from "zod";

type FormValues = z.infer<typeof payoutSchema>;

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  processedAt: Date | null;
}

interface PayoutDashboardProps {
  balance: {
    totalEarnings: number;
    totalRequested: number;
    availableBalance: number;
  };
  history: PayoutRequest[];
}

export function PayoutDashboard({ balance, history }: PayoutDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(payoutSchema) as any,
    defaultValues: {
      amount: 10,
    },
  });

  const onSubmit = (data: any) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await requestPayoutAction(data);
      if (!res.success) {
        setError(res.error || "Failed to submit payout request.");
      } else {
        setSuccess("Payout request submitted successfully!");
        reset();
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Balance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Earnings (Net)</span>
              <span className="text-2xl font-extrabold text-neutral-850 dark:text-neutral-50">
                ${balance.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Requested</span>
              <span className="text-2xl font-extrabold text-neutral-850 dark:text-neutral-50">
                ${balance.totalRequested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-sm border-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">Available Balance</span>
              <span className="text-2xl font-extrabold">
                ${balance.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 text-white">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Request Form */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Request Payout</CardTitle>
            <CardDescription className="text-[11px]">
              Transfer your available balance to your connected account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs font-bold">Withdraw Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min={10}
                    max={balance.availableBalance}
                    placeholder="0.00"
                    {...register("amount")}
                    disabled={isPending || balance.availableBalance < 10}
                    className="pl-9 h-10 rounded-xl"
                  />
                </div>
                {errors.amount?.message && (
                  <p className="text-[10px] text-red-500 font-medium">{String(errors.amount.message)}</p>
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

              <Button
                type="submit"
                disabled={isPending || balance.availableBalance < 10}
                className="w-full h-10 rounded-xl text-xs gap-2"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Request Withdrawal
              </Button>

              {balance.availableBalance < 10 && (
                <p className="text-[10px] text-center text-neutral-400 italic">
                  You need a minimum balance of $10.00 to request a payout.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-neutral-500" />
                Payout History
              </CardTitle>
              <CardDescription className="text-[11px]">
                A log of all your previous withdrawal requests.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 italic text-xs">
                No payout requests made yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                      <TableHead className="py-3 pl-6 text-xs font-bold text-neutral-500">Date Requested</TableHead>
                      <TableHead className="py-3 text-xs font-bold text-neutral-500">Amount</TableHead>
                      <TableHead className="py-3 text-xs font-bold text-neutral-500">Status</TableHead>
                      <TableHead className="py-3 pr-6 text-right text-xs font-bold text-neutral-500">Processed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((req) => (
                      <TableRow key={req.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10">
                        <TableCell className="py-3.5 pl-6 text-xs text-neutral-700 dark:text-neutral-300">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-bold text-neutral-850 dark:text-neutral-50">
                          ${req.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-3.5">
                          {req.status === "PAID" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-none font-bold rounded-xl gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Paid
                            </Badge>
                          )}
                          {req.status === "PENDING" && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-none font-bold rounded-xl gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                          {req.status === "REJECTED" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-none font-bold rounded-xl gap-1">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5 pr-6 text-right text-xs text-neutral-500">
                          {req.processedAt ? new Date(req.processedAt).toLocaleDateString() : "—"}
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
    </div>
  );
}
