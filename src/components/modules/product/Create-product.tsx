"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CreateProductSchema } from "@/validations/product.validation";
import { createProductAction } from "@/actions/product.actions";

// ShadCN UI imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CreateProductInput = z.infer<typeof CreateProductSchema>;

export default function CreateProductForm() {
  const inputId = useId();

  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(CreateProductSchema),
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createProductAction,
  });

  // Submit Handler
  const onSubmit: SubmitHandler<CreateProductInput> = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("location", data.location);
      formData.append("deliveryCharge", data.deliveryCharge);

      formData.append("brand", data.brand || "");
      formData.append("warrenty", data.warrenty);
      formData.append("category_name", data.category_name);
      formData.append("date", data.date);
      files.forEach((file) => {
        formData.append("files", file);
      });

      
      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create product");
        setErrorMessage(result.message || "Failed to create product");
        return;
      }

      toast.success(result.message || "Product created successfully");
      setSuccessMessage(result.message || "Product created successfully");

      void queryClient.invalidateQueries({ queryKey: ["products"] });
      router.refresh();

      reset();
      setPreviews([]);
      setFiles([]);
    } catch (err) {
      toast.error("Something went wrong");
      setErrorMessage("Unexpected error occurred");
    }
  };

  return (
    <section
      className={cn(
        "min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-center",
      )}
      aria-label="Add a new product"
    >
      {/* Centered RootLayout container */}
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-16">
        <motion.div
          layout
          className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-8 sm:p-12 transition-shadow duration-200"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
        >
          {/* Header */}
          <CardHeader className="mb-8 flex flex-col items-center text-center">
            <CardTitle className="font-jakarta text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Create Product
            </CardTitle>
            <CardDescription className="mt-3 text-base text-zinc-500 max-w-prose">
              Add a new product to your AI SaaS platform.
              <br className="hidden sm:block" />
              Includes images, pricing, and detailed description.
            </CardDescription>
          </CardHeader>

          {/* Feedback (success / error) */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <Alert
                  className="mb-6 rounded-xl border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 text-green-800 dark:text-green-200 shadow-sm"
                  aria-live="polite"
                >
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <Alert
                  variant="destructive"
                  className="mb-6 rounded-xl border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 text-red-800 dark:text-red-200 shadow-sm"
                  aria-live="assertive"
                >
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUCT FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
            noValidate
          >
            {/* TITLE */}
            <div>
              <Label htmlFor={`${inputId}-title`} className="font-medium">
                Product Title
              </Label>
              <Input
                id={`${inputId}-title`}
                {...register("title")}
                placeholder="e.g. MacBook Pro M3"
                type="text"
                autoFocus
                className={cn(
                  "mt-2 block w-full",
                  errors.title && "border-red-500 focus:ring-red-500",
                )}
                aria-invalid={!!errors.title}
                aria-describedby={
                  errors.title ? `${inputId}-title-error` : undefined
                }
              />
              {errors.title && (
                <p
                  id={`${inputId}-title-error`}
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label htmlFor={`${inputId}-desc`} className="font-medium">
                Description
              </Label>
              <Textarea
                id={`${inputId}-desc`}
                {...register("description")}
                placeholder="Product details, specs, highlights..."
                rows={3}
                className={cn(
                  "mt-2 block w-full",
                  errors.description && "border-red-500 focus:ring-red-500",
                )}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? `${inputId}-desc-error` : undefined
                }
              />
              {errors.description && (
                <p
                  id={`${inputId}-desc-error`}
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* PRICE */}
              <div>
                <Label htmlFor={`${inputId}-price`} className="font-medium">
                  Price
                </Label>
                <input type="number" {...register("price", { min: 0, max: 6000 })} />
                {errors.price && (
                  <p
                    id={`${inputId}-price-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.price.message}
                  </p>
                )}
              </div>
              {/* LOCATION */}
              <div>
                <Label htmlFor={`${inputId}-location`} className="font-medium">
                  Location
                </Label>
                <Input
                  id={`${inputId}-location`}
                  {...register("location")}
                  placeholder="City / Area"
                  className={cn(
                    "mt-2 block w-full",
                    errors.location && "border-red-500 focus:ring-red-500",
                  )}
                  aria-invalid={!!errors.location}
                  aria-describedby={
                    errors.location ? `${inputId}-location-error` : undefined
                  }
                />
                {errors.location && (
                  <p
                    id={`${inputId}-location-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* DELIVERY */}
              <div>
                <Label
                  htmlFor={`${inputId}-deliverycharge`}
                  className="font-medium"
                >
                  Delivery Charge
                </Label>
                <select
                  id={`${inputId}-deliverycharge`}
                  {...register("deliveryCharge", { valueAsNumber: true })}
                  className={cn(
                    "mt-2 block w-full w-full bg-background text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring shadow-md transition duration-200 appearance-none",
                    errors.deliveryCharge && "border-red-500 focus:ring-red-500 border-destructive ring-destructive",
                  )}
                  aria-invalid={!!errors.deliveryCharge}
                  aria-describedby={
                    errors.deliveryCharge
                      ? `${inputId}-deliverycharge-error`
                      : undefined
                  }
                  style={{
                    minHeight: "48px",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  <option value="">Select delivery charge</option>
                  <option
                    value={0}
                    className="text-foreground"
                    style={{
                      backgroundColor: "#23272b",
                      color: "#f5f6fa",
                      padding: "8px 12px",
                    }}
                  >
                    0
                  </option>
                  <option
                    value={120}
                    className="text-foreground"
                    style={{
                      backgroundColor: "#23272b",
                      color: "#f5f6fa",
                      padding: "8px 12px",
                    }}
                  >
                    120
                  </option>
                </select>
           
                {errors.deliveryCharge && (
                  <p
                    id={`${inputId}-deliverycharge-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.deliveryCharge.message}
                  </p>
                )}
              </div>
              {/* BRAND */}
              <div>
                <Label htmlFor={`${inputId}-brand`} className="font-medium">
                  Brand
                </Label>
                <Input
                  id={`${inputId}-brand`}
                  {...register("brand")}
                  placeholder="e.g. Apple"
                  className={cn(
                    "mt-2 block w-full",
                    errors.brand && "border-red-500 focus:ring-red-500",
                  )}
                  aria-invalid={!!errors.brand}
                  aria-describedby={
                    errors.brand ? `${inputId}-brand-error` : undefined
                  }
                />
                {errors.brand && (
                  <p
                    id={`${inputId}-brand-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.brand.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* WARRANTY */}
              <div>
                <Label htmlFor={`${inputId}-warrenty`} className="font-medium">
                  Warranty
                </Label>
                <Input
                  id={`${inputId}-warrenty`}
                  {...register("warrenty")}
                  placeholder="e.g. 1 year"
                  className={cn(
                    "mt-2 block w-full",
                    errors.warrenty && "border-red-500 focus:ring-red-500",
                  )}
                  aria-invalid={!!errors.warrenty}
                  aria-describedby={
                    errors.warrenty ? `${inputId}-warrenty-error` : undefined
                  }
                />
                {errors.warrenty && (
                  <p
                    id={`${inputId}-warrenty-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.warrenty.message}
                  </p>
                )}
              </div>
              {/* CATEGORY */}
              <div>
                <Label htmlFor={`${inputId}-category`} className="font-medium">
                  Category
                </Label>
                <Input
                  id={`${inputId}-category`}
                  {...register("category_name")}
                  placeholder="Category name"
                  className={cn(
                    "mt-2 block w-full",
                    errors.category_name && "border-red-500 focus:ring-red-500",
                  )}
                  aria-invalid={!!errors.category_name}
                  aria-describedby={
                    errors.category_name
                      ? `${inputId}-category-error`
                      : undefined
                  }
                />
                {errors.category_name && (
                  <p
                    id={`${inputId}-category-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.category_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* DATE */}
            <div>
              <Label htmlFor={`${inputId}-date`} className="font-medium">
                Date Listed
              </Label>
              <Input
                id={`${inputId}-date`}
                type="date"
                {...register("date")}
                className={cn(
                  "mt-2 block w-full",
                  errors.date && "border-red-500 focus:ring-red-500",
                )}
                aria-invalid={!!errors.date}
                aria-describedby={
                  errors.date ? `${inputId}-date-error` : undefined
                }
              />
              {errors.date && (
                <p
                  id={`${inputId}-date-error`}
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <Label htmlFor={`${inputId}-images`} className="font-medium">
                Product Images
              </Label>
              <input
                id={`${inputId}-images`}
                type="file"
                multiple
                accept="image/*"
                // use manual event handling rather than {...register("images")}
                className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                aria-describedby={
                  errors.images ? `${inputId}-images-error` : undefined
                }
                onChange={(e) => {
                  const fileList = e.target.files;
                  if (!fileList) return;

                  const fileArr = Array.from(fileList);
                  setFiles(fileArr);
                  setValue("images", fileArr as any, { shouldValidate: true });

                  const urls = fileArr.map((file) => URL.createObjectURL(file));
                  setPreviews(urls);
                }}
              />
              {errors.images && (
                <p
                  id={`${inputId}-images-error`}
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.images.message as string}
                </p>
              )}
              {previews.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-4">
                  {previews.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Preview ${i + 1}`}
                        className="object-cover w-full h-full transition-transform duration-150 hover:scale-105"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className={cn(
                  "w-full h-12 rounded-2xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white text-lg transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 disabled:opacity-60",
                  isPending && "cursor-not-allowed",
                )}
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />{" "}
                    Creating...
                  </span>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="alertdialog"
          >
            <motion.div
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col items-center"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="mb-2 inline-flex h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500" />
              <span className="text-base font-medium text-zinc-700 dark:text-zinc-200">
                Creating Product...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
