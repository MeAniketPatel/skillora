"use client";

import { useCartStore } from "../stores/cart.store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { CartItem } from "@/features/cart";
import { CheckoutSummary } from "@/features/cart";
import { ShoppingCart, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface CartSidebarProps {
  userPoints: number;
  userId: string;
  userName: string;
}

export function CartSidebar({ userPoints, userId, userName }: CartSidebarProps) {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // Avoid hydration mismatch since cart is persisted in localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white z-40 flex items-center justify-center p-0"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-3.5 -right-3.5 bg-red-500 text-white font-bold text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 font-mono">
                {items.length}
              </span>
            )}
          </div>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
        <SheetHeader className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <SheetTitle className="text-sm font-bold flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-emerald-500" />
            Your Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto" />
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-205">Your cart is empty</h4>
              <p className="text-[10px] text-neutral-450 max-w-[180px] mx-auto">Add courses or bundles to your cart to checkout.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
            <CheckoutSummary
              userPoints={userPoints}
              userId={userId}
              userName={userName}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
