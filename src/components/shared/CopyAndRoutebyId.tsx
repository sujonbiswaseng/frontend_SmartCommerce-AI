// components/CopyableId.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  href?: string;
  showShort?: string;
  className?:string;
}

const CopyableId: React.FC<Props> = ({
  id,
  href,
  showShort = true,
  className
}) => {
  const router = useRouter();

  const handleClick = async (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.stopPropagation();

    // 🔹 ALT → Copy only
    if (event.altKey) {
      try {
        await navigator.clipboard.writeText(id);
        toast.success("Copied ID!");
      } catch {
        toast.error("Copy failed!");
      }
      return;
    }

    // 🔹 Normal click → Navigate
    if (href) {
      router.push(href);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={cn("group inline-flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-700 transition-all",className)}
      title="Click → View | Alt + Click → Copy"
    >
      <span className="hover:underline">
        {showShort ? `${id.slice(0,6)}...` : id}
      </span>

      {/* Hover copy hint */}
      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition">
        📋
      </span>
    </span>
  );
};

export default CopyableId;