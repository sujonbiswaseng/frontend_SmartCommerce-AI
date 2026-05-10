"use client";

import React, { useState } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TFilterField } from "@/types/filter.type";

export const FilterPanel = ({
  fields,
  onReset,
  onApply,
  isPending,
  className,
  classRoot,
  buttonClassName,
  tk=false,
}: {
  fields: TFilterField[];
  onReset?: () => void;
  onApply?: () => void;
  isPending?: boolean;
  className?: string;
  classRoot?: string;
  buttonClassName?: string;
  tk?:boolean
}) => {
  const [isApplySpinning, setIsApplySpinning] = useState(false);
  const [isResetSpinning, setIsResetSpinning] = useState(false);

  const handleApplyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!onApply) return;
    setIsApplySpinning(true);
    try {
      await Promise.resolve(onApply());
    } finally {
      setIsApplySpinning(false);
    }
  };

  const handleResetClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!onReset) return;
    setIsResetSpinning(true);
    try {
      await Promise.resolve(onReset());
    } finally {
      setIsResetSpinning(false);
    }
  };

  // Layout container with max width for enterprise design system
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full max-w-[1440px] mx-auto p-4 sm:p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg transition-all duration-300",
        classRoot,
      )}
      aria-label="Filter options"
    >
      <form
        className={cn(
          // Responsive grid with controlled columns for all breakpoints
          "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
          className,
        )}
        autoComplete="off"
        style={{ position: "relative", zIndex: 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          onApply?.();
        }}
      >
        {fields.map((field) => {
          const inputBase =
            "bg-input text-foreground border border-input rounded-lg px-4 py-2 w-full text-base shadow-sm outline-none transition focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground";
          const card =
            "flex flex-col gap-4 p-4 bg-background rounded-xl border border-border shadow-sm min-h-[120px] transition hover:shadow-md focus-within:ring-2 focus-within:ring-ring";

          if (
            field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ||
            field.type === "search" ||
            field.type === "url" ||
            field.type === "tel"
          ) {
            return (
              <div key={field.name} className={card} tabIndex={-1}>
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-foreground mb-1"
                >
                  {field.label ?? field.name}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <input
                    id={field.name}
                    type={field.type}
                    value={field.value}
                    aria-label={field.label ?? field.name}
                    placeholder={field.placeholder || "Search..."}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={cn(inputBase, "pl-11")}
                  />
                </div>
              </div>
            );
          }

          if (field.type === "number") {
            return (
              <div key={field.name} className={card} tabIndex={-1}>
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-foreground mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type="number"
                  inputMode="numeric"
                  value={field.value ?? ""}
                  aria-label={field.label}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue <= 5000000) {
                      field.onChange(newValue);
                    }
                  }}
                  className={inputBase}
                />
              </div>
            );
          }

          if (
            field.type === "date" ||
            field.type === "time" ||
            field.type === "datetime-local" ||
            field.type === "month" ||
            field.type === "week"
          ) {
            return (
              <div key={field.name} className={card} tabIndex={-1}>
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-foreground mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  value={field.value}
                  aria-label={field.label}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={inputBase}
                />
              </div>
            );
          }

          if (field.type === "checkbox") {
            return (
              <div
                key={field.name}
                className={cn(
                  "flex items-center gap-4",
                  "bg-background rounded-xl border border-border shadow-sm min-h-[64px] px-4 py-4",
                )}
              >
                <input
                  id={field.name}
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-5 h-5 rounded border-input accent-primary focus:ring-2 focus:ring-ring transition checked:scale-110"
                  aria-checked={field.value}
                  aria-label={field.label}
                />
                <label
                  htmlFor={field.name}
                  className="text-base font-medium text-foreground select-none"
                >
                  {field.label}
                </label>
              </div>
            );
          }

          if (field.type === "select") {
            const selectedValue = field.value ? String(field.value) : "__all__";
            return (
              <div key={field.name} className={card} tabIndex={-1}>
                <label
                  htmlFor={`${field.name}-select`}
                  className="text-sm font-medium text-foreground mb-1"
                >
                  {field.label}
                </label>
                <Select
                  value={selectedValue}
                  onValueChange={(value) => field.onChange(value === "__all__" ? "" : value)}
                >
                  <SelectTrigger
                    id={`${field.name}-select`}
                    className={cn(
                      inputBase,
                      "bg-background cursor-pointer h-[44px]",
                    )}
                    aria-label={field.label}
                  >
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px] bg-background text-foreground rounded-lg shadow-lg border border-border">
                    <SelectItem
                      value="__all__"
                      className="font-normal py-2 hover:bg-accent hover:text-accent-foreground rounded"
                    >
                      All
                    </SelectItem>
                    {field.options
                      .filter((opt) => String(opt.value) !== "")
                      .map((opt) => (
                        <SelectItem
                          key={String(opt.value)}
                          value={String(opt.value)}
                          className="font-normal py-2 hover:bg-accent hover:text-accent-foreground rounded"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          if (field.type === "range") {
            return (
              <div key={field.name} className={cn(card, "gap-6")} tabIndex={-1}>
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-foreground mb-1"
                >
                  {field.label}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id={field.name}
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={field.value}
                    aria-label={field.label}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full h-2 accent-primary bg-input rounded"
                  />
                  <span className="ml-2 text-base font-semibold text-primary min-w-[48px] text-right">
                   {tk && "৳"}{field.value}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>{tk && "৳"}{field.min}</span>
                  <span>{tk && "৳"}{field.max}</span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </form>
      <div className="mt-8 flex flex-wrap justify-center gap-4 w-full">
        <Button
          type="button"
          onClick={handleApplyClick}
          disabled={isPending}
          variant="default"
          className={cn(
            "min-w-[144px] h-12 flex items-center justify-center rounded-lg text-base font-semibold shadow-md transition-all",
            buttonClassName,
          )}
          aria-label="Apply filters"
        >
          {isApplySpinning && isPending && onApply ? (
            <span className="mr-2 flex items-center">
              <span className="inline-block h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </span>
          ) : (
            <Filter className="mr-2 w-5 h-5" />
          )}
          Apply Filters
        </Button>
        <Button
          type="button"
          onClick={handleResetClick}
          disabled={isPending}
          variant="secondary"
          className={cn(
            "min-w-[144px] h-12 flex items-center justify-center rounded-lg text-base font-semibold shadow-md border border-border transition-all",
            "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            buttonClassName
          )}
          aria-label="Reset filters"
        >
          {isResetSpinning && isPending && onReset ? (
            <span className="mr-2 flex items-center">
              <span
                className="inline-block h-5 w-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin"
                aria-label="Reseting"
                role="status"
              />
            </span>
          ) : (
            <RotateCcw className="mr-2 w-5 h-5" aria-hidden="true" />
          )}
          <span className="sr-only md:not-sr-only">Reset</span>
        </Button>
  
      </div>
    </motion.section>
  );
};