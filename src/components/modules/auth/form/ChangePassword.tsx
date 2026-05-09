"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/auth.service";
import Link from "next/link";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Current password is required and must be at least 8 characters" }),
  newPassword: z
    .string()
    .min(8, { message: "New password is required and must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      { message: "Password must contain uppercase, lowercase, number, and special character" }
    ),
});

type ChangePasswordFields = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema as any),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordFields) =>
      changePassword(data.currentPassword, data.newPassword),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      reset();
      setLoading(false);
      toast.success(data.message || "Password changed successfully", { autoClose: 2000 });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      reset();
      setLoading(false);
      toast.error(error.message || "Password change failed", { autoClose: 2000 });
    },
    onSettled: () => setLoading(false),
  });

  const onSubmit = (data: ChangePasswordFields) => {
    setLoading(true);
    mutate(data);
  };

  return (
    <div>
      {(loading || isPending) && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center shadow-xl border border-zinc-300 dark:border-zinc-700">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-indigo-300 mb-4" />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              Processing...
            </span>
          </div>
        </div>
      )}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center min-h-[calc(100vh-96px)] justify-center">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 md:p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link
              href="/"
              className="text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded transition px-0.5 py-0.5"
              tabIndex={0}
            >
              ← Home
            </Link>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-zinc-900 dark:text-zinc-100 text-center mb-8">
              Change Password
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Current Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  aria-label="Current Password"
                  placeholder="Enter current password"
                  {...register("currentPassword")}
                  className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  disabled={isPending || loading}
                  aria-invalid={!!errors.currentPassword}
                  required
                />
                {errors.currentPassword && (
                  <span className="text-xs text-rose-500 dark:text-rose-400">
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>
              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-label="New Password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  disabled={isPending || loading}
                  aria-invalid={!!errors.newPassword}
                  required
                />
                {errors.newPassword && (
                  <span className="text-xs text-rose-500 dark:text-rose-400">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || loading}
                aria-disabled={isPending || loading}
                className={`inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 ${
                  isPending || loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isPending || loading ? (
                  <span>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-indigo-400 mr-2 align-middle" />{" "}
                    Changing password...
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
            <div className="text-sm text-center w-full mt-2">
              <span className="text-muted-foreground">Back to{" "}</span>
              <Link
                className="text-primary font-semibold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded transition"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}