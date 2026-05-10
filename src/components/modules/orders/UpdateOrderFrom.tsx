"use client";
import React, { useState } from "react";
import { updateorderstatus } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-toastify";

interface IUpdateOrderStatusFormProps {
  id: string;
  initialStatus: string;
  role: string;
}

const ORDER_STATUSES = [
  "PLACED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

export function UpdateOrderStatusForm({
  id,
  initialStatus,
  role,
}: IUpdateOrderStatusFormProps) {
  const [status, setStatus] = useState<string>(initialStatus || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ status?: string }>({});

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setErrors((prev) => ({ ...prev, status: undefined }));
  };

  const handleReset = () => {
    setStatus(initialStatus || "");
    setErrors({});
  };

  const validate = () => {
    let valid = true;
    const newErrors: { status?: string } = {};

    if (!status || (role === "Customer" && status !== "CANCELLED" && status !== "")) {
      newErrors.status =
        role === "Customer"
          ? "Customers can only cancel orders."
          : "Please select a status.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const toastId = toast.loading("Updating order status... Please wait.");
    try {
      const res = await updateorderstatus(id, { status });
      toast.dismiss(toastId);
      if (!res.success) {
        toast.error(res.message || "Failed to update order status. Please try again.");
        setLoading(false);
        return;
      }
      toast.success(res.message || "Order status updated successfully!");
      setLoading(false);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  let statusOptions: { value: string; label: string }[] = [];

  if (role === "Admin" || role === "Provider") {
    statusOptions = [
      { value: "", label: "Select Status" },
      ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
    ];
  } else if (role === "Customer") {
    statusOptions = [
      { value: "", label: "Select Status" },
      { value: "CANCELLED", label: "CANCELLED" },
    ];
  }

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center shadow-xl border border-zinc-300 dark:border-zinc-700">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-indigo-300 mb-4" />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              Updating status...
            </span>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md mx-auto border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-center">Update Order Status</CardTitle>
          <CardDescription className="text-center">Change the status for this order</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" id="update-status-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="order-status"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Status
              </label>
              <select
                id="order-status"
                value={status}
                onChange={handleStatusChange}
                className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                disabled={loading}
                required
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <span className="text-xs text-rose-500 dark:text-rose-400">
                  {errors.status}
                </span>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="update-status-form"
            disabled={loading}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}