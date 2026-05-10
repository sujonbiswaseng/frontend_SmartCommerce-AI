"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export const useFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (filters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(filters)) {
      if (value === "" || value === undefined || value === null || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    // Filter change korle page reset hoye jabe
    params.delete("page");

    startTransition(() => {
      router.push(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false }
      );
    });
  };

  const reset = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return { updateFilters, reset, isPending };
};