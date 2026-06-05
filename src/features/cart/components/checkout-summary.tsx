"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { Ticket, CreditCard, Sparkles, Receipt, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

interface CheckoutSummaryProps {
  userPoints: number;
  userId: string;
  userName: string;
}

export function CheckoutSummary({ userPoints, userId, userName }: CheckoutSummaryProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedItems, setCompletedItems] = useState<any[]>([]);
  const [receiptNumber, setReceiptNumber] = useState("");

  const originalTotal = getTotal();
  
  // Points discount: 100 points = $1. Max points usable is limited to the total.
  const maxPointsUsable = Math.min(userPoints, Math.floor(originalTotal * 100));
  const pointsDiscountAmount = usePoints ? maxPointsUsable / 100 : 0;
  
  const couponDiscountAmount = (originalTotal * discountPercent) / 100;
  const finalTotal = Math.max(0, originalTotal - couponDiscountAmount - pointsDiscountAmount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setDiscountPercent(10);
      setAppliedCoupon("WELCOME10 (10% Off)");
      toast.success("Coupon applied: 10% discount!");
    } else if (code === "SUPER50") {
      setDiscountPercent(50);
      setAppliedCoupon("SUPER50 (50% Off)");
      toast.success("Coupon applied: 50% discount!");
    } else {
      toast.error("Invalid coupon code.");
    }
    setCouponCode("");
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate API call to enroll user in all courses
    try {
      // Mock call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const rNum = "REC-" + Math.floor(100000 + Math.random() * 900000);
      setReceiptNumber(rNum);
      setCompletedItems([...items]);
      setOrderCompleted(true);
      toast.success("Purchase completed successfully!");
      clearCart();
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text("SKILLORA RECEIPT", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("Helvetica", "normal");
    doc.text(`Receipt Number: ${receiptNumber}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);
    doc.text(`Student: ${userName}`, 14, 40);

    // Divider
    doc.setDrawColor(220);
    doc.line(14, 45, 196, 45);

    // Items Header
    doc.setFont("Helvetica", "bold");
    doc.text("Course Title", 14, 52);
    doc.text("Price", 170, 52);

    doc.line(14, 55, 196, 55);
    doc.setFont("Helvetica", "normal");

    let y = 62;
    completedItems.forEach((item) => {
      doc.text(item.title, 14, y);
      doc.text(`$${item.price.toFixed(2)}`, 170, y);
      y += 8;
    });

    doc.line(14, y, 196, y);
    y += 8;

    // Totals
    doc.text("Subtotal:", 130, y);
    doc.text(`$${originalTotal.toFixed(2)}`, 170, y);
    
    if (discountPercent > 0) {
      y += 8;
      doc.setTextColor(220, 50, 50);
      doc.text(`Coupon Discount (${discountPercent}%):`, 130, y);
      doc.text(`-$${couponDiscountAmount.toFixed(2)}`, 170, y);
      doc.setTextColor(100);
    }

    if (usePoints) {
      y += 8;
      doc.setTextColor(16, 185, 129);
      doc.text(`Points Discount (${maxPointsUsable} XP):`, 130, y);
      doc.text(`-$${pointsDiscountAmount.toFixed(2)}`, 170, y);
      doc.setTextColor(100);
    }

    y += 10;
    doc.setFont("Helvetica", "bold");
    doc.text("Total Paid:", 130, y);
    doc.text(`$${finalTotal.toFixed(2)}`, 170, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for studying on Skillora! Start learning now in your student portal.", 14, y + 25);

    doc.save(`Invoice-${receiptNumber}.pdf`);
    toast.success("Invoice PDF downloaded!");
  };

  if (items.length === 0 && !orderCompleted) {
    return null;
  }

  if (orderCompleted) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-6 rounded-2xl shadow-lg text-center space-y-4 max-w-sm mx-auto">
        <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Order Completed!</h3>
        <p className="text-[11px] text-neutral-500">Your courses are now unlocked in your dashboard.</p>
        
        <div className="bg-neutral-50 dark:bg-neutral-950/40 p-3 rounded-xl border border-neutral-150 dark:border-neutral-850/50 flex flex-col gap-1.5 text-left">
          <span className="text-[9px] text-neutral-450 uppercase font-bold">Transaction Info</span>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-neutral-500">Paid:</span>
            <span className="text-neutral-800 dark:text-neutral-150">${finalTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>Invoice Code:</span>
            <span className="font-mono">{receiptNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1.5 font-bold"
          >
            <Receipt className="h-3.5 w-3.5" /> Invoice
          </Button>
          <Button
            onClick={() => setOrderCompleted(false)}
            size="sm"
            className="rounded-xl text-xs font-bold"
          >
            Shop More
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-150">Order Summary</h4>
      </div>

      {/* Applied Discount indicators */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span className="font-mono font-semibold">${originalTotal.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Discount ({appliedCoupon})</span>
            <span className="font-mono font-semibold">-${couponDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        {usePoints && (
          <div className="flex justify-between text-emerald-500">
            <span>Points Applied ({maxPointsUsable} XP)</span>
            <span className="font-mono font-semibold">-${pointsDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-sm text-neutral-800 dark:text-neutral-50 pt-2 border-t border-dashed border-neutral-150 dark:border-neutral-800/60">
          <span>Total</span>
          <span className="font-mono">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Points Toggle */}
      {userPoints >= 100 && (
        <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Apply Study Points
            </span>
            <p className="text-[8px] text-neutral-500">Use {maxPointsUsable} XP for a ${pointsDiscountAmount.toFixed(2)} discount.</p>
          </div>
          <input
            type="checkbox"
            checked={usePoints}
            onChange={(e) => setUsePoints(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      )}

      {/* Coupon input */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-350">Coupon Code</span>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. WELCOME10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="h-9 rounded-xl text-xs flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200/50 dark:border-neutral-800/50"
          />
          <Button
            onClick={handleApplyCoupon}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1 font-bold px-3"
          >
            <Ticket className="h-3.5 w-3.5" /> Apply
          </Button>
        </div>
      </div>

      {/* Checkout CTA */}
      <Button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full rounded-xl text-xs font-bold gap-1.5 h-10"
      >
        <CreditCard className="h-4 w-4" />
        {isCheckingOut ? "Processing..." : "Pay & Enroll"}
      </Button>
    </div>
  );
}
