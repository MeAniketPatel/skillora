"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { APP } from "@/shared/constants/app";

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchInput({
  placeholder = "Search...",
  paramName = "title",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get(paramName) || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }
      // Reset page to 1 on new search
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    }, APP.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [value, paramName, router, pathname, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-white/70 dark:bg-neutral-950/70 border-neutral-200 dark:border-neutral-800 h-10 rounded-xl w-full"
      />
    </div>
  );
}
