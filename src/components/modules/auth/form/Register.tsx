"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  image: z.any(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

export default function CreateUserForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputId = useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema as any),
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

  // API Request
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const toastId = toast.loading("Processing request...");

      const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorBody = await res.json();
        toast.dismiss(toastId);
        setPreview(null);
        toast.error(errorBody.message || "Failed to create user");
      }
      toast.dismiss(toastId);
      setPreview(null);
      return res.json();
    },

    onSuccess: (data) => {
      reset();
      setPreview(null);
      toast.success(data.message || "user created sucessfully");
    },
  });

  const onSubmit: SubmitHandler<CreateUserInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.phone) {
      formData.append("phone", data.phone);
    }

    if (data.image?.[0]) {
      formData.append("file", data.image[0]);
    }
    mutate(formData);
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-zinc-950">
           {(isPending) && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center shadow-xl border border-zinc-300 dark:border-zinc-700">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-indigo-300 mb-4" />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              Logging in...
            </span>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center min-h-[calc(100vh-96px)] justify-center">
        <div
          className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm 
            p-4 md:p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded transition px-0.5 py-0.5"
            tabIndex={0}
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-zinc-900 dark:text-zinc-100 text-center mb-8">
            Create User
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${inputId}-name`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Name
              </label>
              <input
                id={`${inputId}-name`}
                type="text"
                autoComplete="name"
                aria-label="Name"
                placeholder="Enter your name"
                {...register("name")}
                className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                disabled={isPending}
                aria-invalid={!!errors.name}
                required
              />
              {errors.name && (
                <span className="text-xs text-rose-500 dark:text-rose-400">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${inputId}-email`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Email
              </label>
              <input
                id={`${inputId}-email`}
                type="email"
                autoComplete="email"
                aria-label="Email"
                placeholder="Enter your email"
                {...register("email")}
                className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                disabled={isPending}
                aria-invalid={!!errors.email}
                required
              />
              {errors.email && (
                <span className="text-xs text-rose-500 dark:text-rose-400">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${inputId}-password`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Password
              </label>
              <input
                id={`${inputId}-password`}
                type="password"
                autoComplete="new-password"
                aria-label="Password"
                placeholder="Enter password"
                {...register("password")}
                className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                disabled={isPending}
                aria-invalid={!!errors.password}
                required
              />
              {errors.password && (
                <span className="text-xs text-rose-500 dark:text-rose-400">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${inputId}-phone`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Phone <span className="text-xs text-zinc-500">(Optional)</span>
              </label>
              <input
                id={`${inputId}-phone`}
                type="tel"
                autoComplete="tel"
                aria-label="Phone"
                placeholder="Enter phone number"
                {...register("phone")}
                className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                disabled={isPending}
                aria-invalid={!!errors.phone}
              />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${inputId}-image`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Profile Image
              </label>
              <input
                id={`${inputId}-image`}
                type="file"
                aria-label="Profile Image"
                accept="image/*"
                {...register("image")}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                disabled={isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 1 * 1024 * 1024) {
                      toast.error("Image size must be less than 1MB!");
                      e.target.value = "";
                      setPreview(null);
                      return;
                    }
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setPreview(null);
                  }
                }}
                aria-invalid={!!errors.image}
              />
              {errors.image && (
                <span className="text-xs text-rose-500 dark:text-rose-400">
                  Image is required
                </span>
              )}

              {preview && (
                <div className="w-full">
                  <div className="w-full max-w-[192px] mx-auto mt-4 aspect-[4/3] rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Category Preview"
                      className="object-cover w-full h-full rounded-lg"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
              className={`inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 ${
                isPending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? (
                <span>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-indigo-400 mr-2 align-middle" />{" "}
                  Creating...
                </span>
              ) : (
                "Create User"
              )}
            </button>
          </form>

          <div className="text-sm text-center w-full mt-2">
            <span className="text-muted-foreground">
              Already have an account?
            </span>

            <Link
              className="text-primary font-semibold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded transition"
              href="/login"
            >
              signIn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
