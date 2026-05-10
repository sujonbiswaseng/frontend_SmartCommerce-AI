"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { createCategorySchema } from "@/validations/category.validation";
import { categoryCreate } from "@/actions/category";
import { useRouter } from "next/navigation";
type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * CreateCategoryForm
 * Enterprise-grade, RootLayout-centered category create form.
 */
export default function CreateCategoryForm() {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: categoryCreate,
  });

  // Enterprise Submit Handler
  const onSubmit: SubmitHandler<CreateCategoryInput> = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    const formData = new FormData();
    const file = data.image?.[0];
    formData.append("name", data.name);
    formData.append("file", file as File);
    try {
      const result = await mutateAsync(formData);
      if (!result.success) {
        toast.error(result.message || "Failed to create category");
        setErrorMessage(result.message || "Failed to create category");
        return;
      }

      setSuccessMessage(result.message || "Category created successfully");
      toast.success(result.message || "Category created successfully");

      void queryClient.invalidateQueries({ queryKey: ["cetagoriess"] });
      void queryClient.refetchQueries({ queryKey: ["cetagoriess"], type: "active" });
      router.refresh();
      reset();
      setPreview(null);
      return 
    } catch (error) {
      setErrorMessage("Unexpected error occurred. Please try again.");
      toast.error("Unexpected error occurred. Please try again.");
    }
  };

  // Drop shadow, smooth border, enterprise card style
  return (
    <section className="relative flex flex-col min-h-screen bg-white dark:bg-zinc-950 py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[70vh]">
        <motion.div
          layout
          className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-12 transition-shadow"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
        >
          {/* Heading */}
          <div className="mb-12">
            <h1
              className="font-jakarta font-bold text-4xl sm:text-[2.5rem] leading-tight text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ fontFamily: `'Plus Jakarta Sans', Geist, Inter, sans-serif` }}
            >
              Create Category
            </h1>
            <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-prose">
              Add a new category and logo image to your workspace.
              <span className="block text-sm text-zinc-400 mt-2">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Requirements:</span>{" "}
                Unique name & JPG/PNG/WEBP (max 2MB)
              </span>
            </p>
          </div>

          {/* Feedback/Alerts */}
          <AnimatePresence mode="wait">
            {successMessage && (
              <motion.div
                className="mb-8 flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-6 py-4 shadow transition-all"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                role="status"
                aria-live="polite"
              >
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {successMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-6 py-4 shadow transition-all"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                role="alert"
                aria-live="assertive"
              >
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-medium text-red-800 dark:text-red-300">
                  {errorMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10"
            aria-label="Create new category form"
            autoComplete="off"
            noValidate
          >
            {/* Category Name Field */}
            <div className="space-y-2">
              <label
                htmlFor={`${inputId}-name`}
                className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Category Name
              </label>
              <input
                id={`${inputId}-name`}
                type="text"
                placeholder="Enter category name"
                disabled={isPending}
                autoComplete="off"
                {...register("name")}
                className={`h-12 w-full rounded-2xl border bg-white dark:bg-zinc-900 px-4 text-base font-medium outline-none transition-all duration-200
                  ${errors.name
                    ? "border-red-500 ring-2 ring-red-100 dark:ring-red-900"
                    : "border-zinc-300 dark:border-zinc-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                  } placeholder:text-zinc-400 dark:placeholder:text-zinc-600`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${inputId}-name-error` : undefined}
                spellCheck={false}
              />
              {errors.name && (
                <motion.p
                  id={`${inputId}-name-error`}
                  className="text-xs font-medium text-red-500 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="space-y-2">
              <label
                htmlFor={`${inputId}-image`}
                className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Category Image
              </label>
              <input
                id={`${inputId}-image`}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={isPending}
                {...register("image")}
                className={`block w-full rounded-2xl border bg-white dark:bg-zinc-900 px-4 py-3 text-base file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-indigo-700 hover:file:bg-indigo-200
                  ${errors.image
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                  } transition-all duration-200`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
                    if (file.size > maxSizeInBytes) {
                      toast.error("File size exceeds 2MB. Please choose a file 2MB or less.");
                      e.target.value = "";
                      setPreview(null);
                      return;
                    }
                  }
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setPreview(null);
                  }
                }}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? `${inputId}-image-error` : undefined}
                tabIndex={0}
              />
              {errors.image && (
                <motion.p
                  id={`${inputId}-image-error`}
                  className="text-xs font-medium text-red-500 mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {errors.image.message as string}
                </motion.p>
              )}

              {/* Image Preview (Animated, styled) */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-56 w-full object-cover bg-zinc-100 dark:bg-zinc-800 transition-opacity"
                      style={{ borderRadius: "inherit" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`flex h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 dark:bg-indigo-600 text-base font-semibold text-white shadow transition-all duration-150
                  ${
                    isPending
                      ? "cursor-not-allowed opacity-70"
                      : "hover:bg-indigo-500 active:scale-[0.98]"
                  }`}
                aria-busy={isPending}
                aria-label={isPending ? "Creating..." : "Create Category"}
                tabIndex={0}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </span>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Loading overlay"
            aria-live="polite"
            tabIndex={-1}
          >
            <motion.div
              className="rounded-2xl bg-white dark:bg-zinc-900 p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6"
              initial={{ scale: 0.97, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Creating Category...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}