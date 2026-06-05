"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCoupon, deleteCoupon } from "@/features/coupons";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2, Loader2, Percent, DollarSign, Calendar, RefreshCw } from "lucide-react";
import { cn, formatPrice } from "@/shared/lib/utils";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "PERCENTAGE" | "FIXED";
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  course?: {
    title: string;
  } | null;
}

interface CouponManagerProps {
  initialCoupons: Coupon[];
}

export function CouponManager({ initialCoupons }: CouponManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number>(10);
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Convert local date string to datetime ISOString for Zod validation
    const formattedExpiresAt = expiresAt ? new Date(expiresAt).toISOString() : undefined;
    const numericMaxUses = maxUses ? parseInt(maxUses, 10) : undefined;

    startTransition(async () => {
      const res = await createCoupon({
        code: code.toUpperCase(),
        discount,
        type,
        maxUses: numericMaxUses,
        expiresAt: formattedExpiresAt,
      });

      if (!res.success) {
        setError(res.error || "Failed to create coupon.");
      } else {
        setSuccess("Coupon code created successfully!");
        setCode("");
        setDiscount(10);
        setType("PERCENTAGE");
        setMaxUses("");
        setExpiresAt("");
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteCoupon(id);
      if (res.success) {
        router.refresh();
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Coupon Card */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Create Coupon Code</CardTitle>
          <CardDescription className="text-xs">Configure discount rules for checkouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs font-bold">Coupon Code</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PROMO50"
                required
                disabled={isPending}
                className="h-10 rounded-xl uppercase font-mono tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold">Discount Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  disabled={isPending}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-xs"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="text-xs font-bold">Discount Value</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value))}
                  required
                  disabled={isPending}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses" className="text-xs font-bold">Max Usage Limits (Optional)</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100"
                disabled={isPending}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-xs font-bold">Expiration Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={isPending}
                className="h-10 rounded-xl"
              />
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
              disabled={isPending}
              className="w-full rounded-xl h-10 text-xs font-bold"
            >
              {isPending && !deletingId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Generate Coupon"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Coupons Table List */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-0">
            {initialCoupons.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 italic text-sm">
                No active coupon codes are available on the platform.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                      <TableHead className="py-3.5 pl-6">Promo Code</TableHead>
                      <TableHead className="py-3.5">Discount</TableHead>
                      <TableHead className="py-3.5">Usage Stats</TableHead>
                      <TableHead className="py-3.5">Expiration</TableHead>
                      <TableHead className="py-3.5 pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialCoupons.map((c) => (
                      <TableRow key={c.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10 text-xs">
                        <TableCell className="py-4 pl-6 font-mono font-bold tracking-wider text-neutral-850 dark:text-neutral-50">
                          {c.code}
                        </TableCell>
                        <TableCell className="py-4 font-semibold">
                          {c.type === "PERCENTAGE" ? (
                            <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                              {c.discount}% Off <Percent className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-green-655 dark:text-green-400">
                              {formatPrice(c.discount)} Off <DollarSign className="h-3 w-3" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-neutral-500 font-medium">
                          {c.usedCount} / {c.maxUses || "∞"} uses
                        </TableCell>
                        <TableCell className="py-4 text-neutral-500">
                          {c.expiresAt ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                              {new Date(c.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">No Expiry</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            onClick={() => handleDelete(c.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                            aria-label="Delete Coupon"
                          >
                            {isPending && deletingId === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
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
