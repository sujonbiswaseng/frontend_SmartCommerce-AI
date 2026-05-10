"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { IGetOrderData, TResponseOrderData } from "@/types/order/order.type";
import { useRouter } from "next/navigation";
import { useFilter } from "@/components/shared/filter/ReuseableFilter";
import { createOrderColumns } from "./CreateordersColumns";
import { FilterPanel } from "@/components/shared/filter/FilterInput";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ViewOrdersData from "./ViewOrdersData";
import { UpdateOrderStatusForm } from "./UpdateOrderFrom";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable } from "@/components/table/DataTable";
import { TFilterField } from "@/types/filter.type";

export interface IOrderUpdateStatus {
  status: string;
}

const CustomerOrderTable = ({
  role,
  initialorder,
}: {
  role: string;
  initialorder: IGetOrderData[];
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState<TResponseOrderData[]>(initialorder);
  const [viewData, setViewData] = useState<TResponseOrderData | null>(null);
  const { updateFilters, reset, isPending } = useFilter();
  const [open, setOpen] = useState(false);
  const [selectedmealid, setSelectedmealId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);

  const [form, setForm] = useState({
    search: "",
    status: "",
    phone: "",
    paymentStatus: "",
    totalPrice: 5000000,
    createdAt: "",
  });

  const columns = createOrderColumns();

  useEffect(() => {
    setTableData(initialorder ?? []);
  }, [initialorder, form]);

  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number | boolean) => {
      setForm((prev) => ({
        ...prev,
        [key]: typeof value === "string" ? value : String(value),
      }));
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
      phone: "",
      paymentStatus: "",
      totalPrice: 5000000,
      createdAt: "",
    });
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      label: "Search",
      placeholder: "Search by name...",
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
        { label: "All", value: "" },
        { label: "Placed", value: "PLACED" },
        { label: "Preparing", value: "PREPARING" },
        { label: "Ready", value: "READY" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      type: "select",
      name: "paymentStatus",
      label: "Payment Status",
      value: form.paymentStatus,
      onChange: (val: string) => handleChange("paymentStatus", val),
      options: [
        { label: "All", value: "" },
        { label: "Paid", value: "PAID" },
        { label: "Unpaid", value: "UNPAID" },
      ],
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
      placeholder: "Search by phone",
      value: form.phone,
      onChange: (val: string) => handleChange("phone", val),
    },
    {
      type: "date",
      name: "createdAt",
      label: "Created At",
      placeholder: "YYYY-MM-DD",
      value: form.createdAt,
      onChange: (val: string) => handleChange("createdAt", val),
    },
    {
      type: "number",
      name: "totalPrice",
      label: "Total Price",
      value: form.totalPrice,
      onChange: (val) => handleChange("totalPrice", Number(val)),
    },
  ];

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (item: any) => {
        setViewData(item);
        setViewMode(true);
        setOpen(true);
      },
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (item: any) => {
        setSelectedmealId(item.id);
        setViewMode(false);
        setViewData(item);
        setOpen(true);
      },
    },
  ];

  return (
    <div className="w-full mx-auto w-full px-0 py-0" style={{ width: '100%' }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage, filter, and update your orders with ease.
          </p>
        </div>
        <div className="text-sm rounded-md bg-secondary px-4 py-2 text-secondary-foreground font-semibold border border-border">
          Total Orders: {tableData.length}
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mb-8 bg-card rounded-2xl border border-border shadow-md p-6"
        style={{ width: "100%" }}
      >
        <FilterPanel
          fields={fields}
          onApply={handleApply}
          onReset={handleReset}
          isPending={isPending}
        />
      </motion.section>

      <div className="relative w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden" style={{ width: "100%" }}>
        <AnimatePresence>
          {isPending && (
            <motion.div
              key="loading"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
              <p className="text-base font-medium text-muted-foreground">
                Filtering data...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="overflow-x-auto pb-2" style={{ width: "100%" }}>
          {tableData && Array.isArray(tableData) && tableData.length > 0 ? (
            <DataTable
              columns={columns as any}
              data={tableData}
             
            />
          ) : (
            <div className="p-8 text-center text-muted-foreground text-base select-none">
              No meals data found.
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setSelectedmealId(null);
            setViewData(null);
          }
        }}
      >
        <DialogContent className="max-w-xl w-full rounded-2xl bg-card p-0">
          <DialogHeader className="px-6 pt-8 pb-2 border-b border-border bg-card rounded-t-2xl shadow-none items-center">
            <DialogTitle className="text-2xl font-bold text-foreground mb-1 tracking-tight text-center">
              {viewMode ? "Order Details" : "Edit Order"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mb-2 text-center">
              {viewMode
                ? "View all details about this order below."
                : "Update the details of your order below as needed."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 px-4 sm:px-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>
            <ViewOrdersData
              viewData={
                Array.isArray(viewData) ? viewData[0] : viewData ?? undefined
              }
              viewMode={viewMode}
            />
            {!viewMode && selectedmealid && (
              <div className="mt-8">
                <UpdateOrderStatusForm
                  role={role as string}
                  initialStatus={tableData[0].status as string}
                  id={selectedmealid}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerOrderTable;