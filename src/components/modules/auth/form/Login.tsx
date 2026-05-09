"use client";
import { forgotPasswordEmailOTPAction, userLogin } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Ilogin } from "@/types/auth.type";
import { loginSchema } from "@/validations/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UserLogin = () => {
  const router = useRouter();
  const [email,setemail]=useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Ilogin>({
    resolver: zodResolver(loginSchema as any),
  });

  const authClient = createAuthClient();
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };
  console.log(signIn, "sing");
  const [loading, setLoading] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Ilogin) => userLogin(payload),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      reset();
      setLoading(false);
      toast.success(data.message || "user login sucessfully", {
        autoClose: 2000,
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      reset();
      setLoading(false);
      toast.error(error.message || "user login failed", { autoClose: 2000 });
      router.push("/");
    },
    onSettled: () => {
      setLoading(false);
    },
  });



  const handleForgetPassword = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email first.", { theme: "dark" });
      return { success: false };
    }
    try {
      const toastId = toast.loading("Sending reset OTP...");
      const res = await forgotPasswordEmailOTPAction({ email });
      toast.dismiss(toastId);

      if (res.success) {
        toast.success(res.message || "Password reset OTP sent!", {
          theme: "dark",
        });
        alert("You have only 10 minutes to validate the OTP sent to your email.");
        return { success: true };
      } else {
        toast.error(res.message || "Failed to send OTP.", { theme: "dark" });
        return { success: false };
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.", { theme: "dark" });
      return { success: false };
    }
  };

  const onSubmit: SubmitHandler<Ilogin> = (data) => {
    setLoading(true);
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div>
      {(loading || isPending) && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 flex flex-col items-center shadow-xl border border-zinc-300 dark:border-zinc-700">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-indigo-300 mb-4" />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              Logging in...
            </span>
          </div>
        </div>
      )}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-zinc-950">
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
              login User
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`email`}
                  className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Email
                </label>
                <input
                  id={`email`}
                  type="email"
                  value={email}
                  autoComplete="email"
                  aria-label="Email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  disabled={isPending || loading}
                  onChange={(e) => {
                    setemail(e.target.value as string);
                  }}
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
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                 <label
                   htmlFor="password"
                   className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1 sm:mb-0"
                 >
                   Password
                 </label>
                 <button
                   type="button"
                   className="text-xs font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded transition px-0.5 py-0.5"
                   aria-label="Forgot password"
                   onClick={async () => {
                     if (!email) {
                       toast.error("Please enter your email first.", {
                         theme: "dark",
                       });
                       return;
                     }
                     const res = await handleForgetPassword(email);
                     if (res?.success) {
                       const encodedEmail = encodeURIComponent(email);
                       router.push(`/reset-password?email=${encodedEmail}`);
                     }
                   }}
                 >
                   Forgot password?
                 </button>
               </div>
          
                <input
                  id={`password`}
                  type="password"
                  autoComplete="new-password"
                  aria-label="Password"
                  placeholder="Enter password"
                  {...register("password")}
                  className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  disabled={isPending || loading}
                  aria-invalid={!!errors.password}
                  required
                />
                {errors.password && (
                  <span className="text-xs text-rose-500 dark:text-rose-400">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full min-h-[40px] flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring transition-colors font-medium"
                onClick={signIn}
                aria-label="Sign in with Google"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <circle
                      cx="12"
                      cy="12"
                      r="12"
                      fill="currentColor"
                      className="text-input"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 10.8v3.6h5.1c-.225 1.2-1.35 3.525-5.1 3.525-3.075 0-5.625-2.55-5.625-5.625s2.55-5.625 5.625-5.625c1.755 0 2.94.75 3.615 1.425l2.46-2.4C16.62 4.05 14.55 3 12 3a8.996 8.996 0 000 18c5.175 0 8.55-3.675 8.55-8.85 0-.6-.075-1.05-.165-1.5H12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21c2.43 0 4.47-.81 5.94-2.19l-2.88-2.34c-.81.54-1.86.87-3.06.87-2.355 0-4.35-1.59-5.07-3.72H3.06v2.34A8.97 8.97 0 0012 21z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.93 13.62A5.38 5.38 0 016.6 12c0-.57.09-1.13.25-1.62v-2.34H3.06A9.02 9.02 0 003 12c0 1.41.33 2.76.93 3.96l2.88-2.34z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 6.75c1.305 0 2.47.45 3.39 1.32l2.55-2.55C16.47 3.87 14.43 3 12 3 9.24 3 6.81 4.53 5.19 6.66l2.94 2.34C8.37 8.19 10.05 6.75 12 6.75z"
                    />
                    <path fill="none" d="M3 3h18v18H3z" />
                  </g>
                </svg>
                <span>Sign in with Google</span>
              </Button>

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
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="text-sm text-center w-full mt-2">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                className="text-primary font-semibold hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded transition"
                href="/register"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserLogin;
