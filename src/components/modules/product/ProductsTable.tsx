


"use client";

import { FilterPanel } from "@/components/shared/filter/FilterInput";
import { useFilter } from "@/components/shared/filter/ReuseableFilter";
import { productColumns } from "@/components/table/ columns/product.columns";
import { DataTable } from "@/components/table/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hook/products/useProduct";
import { TFilterField } from "@/types/filter.type";
import { AnimatePresence,motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function ProductsTable(initialQueryString:any) {
  const {
    data,
    isLoading,
  } = useProducts();

  const router = useRouter();
  const [tableData, setTableData] = useState(data);
  const [viewData, setViewData] = useState<typeof tableData | null>(null);
  const { updateFilters, reset, isPending } = useFilter();
  const [open, setOpen] = useState(false);
  const [selectedmealid, setSelectedmealId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);

  const [form, setForm] = useState({
    search: "",
    status: "",
    isAvailable: "",
    category_name: "",
    cuisine: "",
    price: null,
    dietaryPreference: "",
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }


  const handleChange = useCallback(
    (
      key: keyof typeof form,
      value: string | number | boolean
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleApply = () => {
    updateFilters(form);
  };

  const handleReset = () => {
    setForm({
      search: "",
      status: "",
      isAvailable: "",
      category_name: "",
      cuisine: "",
      price: null,
      dietaryPreference: "",
    });
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      label: "Search",
      placeholder: "Meal name or description",
      value: form.search,
      onChange: (val: string) => handleChange("search", val),
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      value: form.status,
      onChange: (val: string) => handleChange("status", val),
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
    {
      type: "select",
      name: "isAvailable",
      label: "Available",
      value: form.isAvailable || "",
      onChange: (val: string) => handleChange("isAvailable", val),
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    {
      type: "number",
      name: "price",
      label: "Price",
      value: form.price as any,
      onChange: (val) => handleChange("price", val),
    },
  ];

  return (
    <div className="p-8 w-full mx-auto">
       <div className="mb-8 bg-card border border-border p-6 rounded-xl shadow-sm">
        <section>
          <FilterPanel
            fields={fields}
            onApply={handleApply}
            onReset={handleReset}
            isPending={isPending}
          />
        </section>
      </div>
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <Skeleton className="w-10 h-10 rounded-full mb-4" />
              <span className="text-muted-foreground text-sm font-medium">
                Loading data...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      <DataTable
        columns={productColumns}
        data={data || []}
      />
    </div>
    </div>
  );
}
