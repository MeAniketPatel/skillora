"use client";

import { CartItem as CartItemType, useCartStore } from "../stores/cart.store";
import { Button } from "@/shared/components/ui/button";
import { Trash2, BookOpen } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-150 dark:border-neutral-800/60 last:border-0 group">
      {item.thumbnail ? (
        <div className="h-12 w-20 relative rounded-lg overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-850">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-12 w-20 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-lg flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
          <BookOpen className="h-5 w-5" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-150 line-clamp-1 leading-snug">
          {item.title}
        </h4>
        <span className="text-[10px] text-neutral-450 font-medium">
          {item.teacherName || "Instructor"}
        </span>
      </div>

      <div className="text-right shrink-0 flex flex-col items-end gap-1">
        <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-100">
          ${item.price.toFixed(2)}
        </span>
        <Button
          onClick={() => removeItem(item.id)}
          variant="ghost"
          size="icon-xs"
          className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-md"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
