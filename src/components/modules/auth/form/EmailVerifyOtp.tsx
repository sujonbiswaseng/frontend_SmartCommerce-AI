"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { forgotPasswordEmailOTPAction, resendVerificationCodeAction, userVerifyEmail } from "@/actions/auth.actions";
import { ResetPassword } from "@/services/auth.service";

import { passwordSchema } from "@/validations/auth.validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function VerifyOtp({
  email:emailaddress,
  type,
}: {
  email?:string |undefined,
  type: "email-verification" | "forget-password";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password,setpassword]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema as any),
  });

  // ------------------ OTP Change ------------------
  const handleOtpChange = (value: string) => {
    if (value.length <= 6) setOtp(value);
  };

  // ------------------ Submit ------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailVerifiy=email || emailaddress

    if (!emailVerifiy) {
      toast.error("Email is required", { theme: "dark" });
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter 6-digit OTP", { theme: "dark" });
      return;
    }

    setLoading(true);

    try {
      if (type === "email-verification") {
        const toastID = toast.loading("Verifying...", { theme: "dark" });
        try {
          const res = await userVerifyEmail({ email: email || emailaddress as string, otp });
     
          if (res.success) {
            toast.dismiss(toastID);
            setResending(false);
            toast.success(
              res.message || "Email verified successfully!",
              { theme: "dark" }
            );
            router.push("/login");
          } else {
            toast.dismiss(toastID);

            // Show user-friendly OTP invalid message
            if (
              res.message &&
              (res.message.toLowerCase().includes("invalid") ||
                res.message.toLowerCase().includes("incorrect"))
            ) {
              toast.error(
                "The verification code you entered is incorrect or expired. Please check your email and try again.",
                { theme: "dark" }
              );
            } else {
              toast.error(
                res.message || "Verification failed. Please check the code and try again.",
                { theme: "dark" }
              );
            }
          }
        } catch (err: any) {
          toast.dismiss();
          // If response has an explicit invalid OTP indication, show detailed message
          const rawMsg =
            err?.response?.data?.message ||
            err?.body?.message ||
            err?.message ||
            "";
          if (
            rawMsg &&
            (rawMsg.toLowerCase().includes("invalid") ||
              rawMsg.toLowerCase().includes("incorrect"))
          ) {
            toast.error(
              "The verification code you entered is incorrect or expired. Please check your email and try again.",
              { theme: "dark" }
            );
          } else {
            toast.error(
              rawMsg || "Verification failed. Please try again.",
              { theme: "dark" }
            );
          }
        }
      }

      if (type === "forget-password") {
        const toastID = toast.loading("Resetting password...", { theme: "dark" });
        try {
          const res = await ResetPassword({
            email,
            otp,
            newPassword:password as string
          });
          if (res.success) {
            toast.dismiss(toastID);
            setSuccess(true);
            setResending(false);
            toast.success(
              res.message || "Password reset successfully!",
              { theme: "dark" }
            );
            router.push("/login");
          } else {
            toast.dismiss(toastID);
            if (
              res.message &&
              (res.message.toLowerCase().includes("invalid") ||
                res.message.toLowerCase().includes("incorrect"))
            ) {
              toast.error(
                "The OTP you entered is incorrect or expired. Please check your email and try again.",
                { theme: "dark" }
              );
            } else {
              toast.error(
                res.message || "Password reset failed. Please check the code and try again.",
                { theme: "dark" }
              );
            }
          }
        } catch (err: any) {
          toast.dismiss();
          const rawMsg =
            err?.response?.data?.message ||
            err?.body?.message ||
            err?.message ||
            "";
          if (
            rawMsg &&
            (rawMsg.toLowerCase().includes("invalid") ||
              rawMsg.toLowerCase().includes("incorrect"))
          ) {
            toast.error(
              "The OTP you entered is incorrect or expired. Please check your email and try again.",
              { theme: "dark" }
            );
          } else {
            toast.error(
              rawMsg || "Password reset failed. Please try again.",
              { theme: "dark" }
            );
          }
        }
      }
    } catch {
      toast.error("Something went wrong", { theme: "dark" });
    }

    setLoading(false);
  };

  const handleEmailVerification = async () => {
    try {
      setResending(true);
      if (type === "email-verification") {
        const toastID = toast.loading("Resending verification code...", { theme: "dark" });
        try {
          // Call the correct resend API for email-verification
          const res = await resendVerificationCodeAction({ email:email || emailaddress as string });
          if (res.success) {
            alert("The OTP is valid for only 10 minutes. Please check your email.");
            toast.dismiss(toastID);
            toast.success(res.message || "Verification code resent successfully!", { theme: "dark" });
            setSuccess(true);
          } else {
            toast.dismiss(toastID);
            toast.error(res.message || "Failed to resend verification code", { theme: "dark" });
          }
        } catch (error: any) {
          toast.dismiss();
          // Try to extract error code/message for known API errors:
          const errorMessage =
            (error && error.body && error.body.message) ||
            error?.message ||
            "Something went wrong during code resend";
          toast.error(errorMessage, { theme: "dark" });
        }
        setResending(false);
      }
      if (type === "forget-password") {
        const toastID = toast.loading("Resending OTP...", { theme: "dark" });
        try {
          // Call the correct resend API for forgot password flow
          const res = await forgotPasswordEmailOTPAction({ email });
          if (res.success) {
            alert("The OTP is valid for only 10 minutes. Please check your email.");
            toast.dismiss(toastID);
            toast.success(res.message || "OTP resent successfully!", { theme: "dark" });
            setSuccess(true);
          } else {
            toast.dismiss(toastID);
            toast.error(res.message || "Failed to resend OTP", { theme: "dark" });
          }
        } catch (error: any) {
          toast.dismiss();
          const errorMessage =
            (error && error.body && error.body.message) ||
            error?.message ||
            "Something went wrong during OTP resend";
          toast.error(errorMessage, { theme: "dark" });
        }
        setResending(false);
      }
    } catch {
      toast.error("Something went wrong", { theme: "dark" });
      setResending(false);
    }
  };

  return (
    <form  onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto max-w-md mt-5 lg:mt-10">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Code sent to:{" "}
            <span className="font-medium break-all">
              {email || emailaddress || "your email"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Field>
            <div className="flex justify-between items-center">
              <FieldLabel>Verification code</FieldLabel>

              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={handleEmailVerification}
                disabled={resending}
              >
                <RefreshCwIcon
                  className={resending ? "animate-spin" : ""}
                />
                {resending ? "Resending..." : "Resend"}
              </Button>
            </div>

            {/* OTP Input */}
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {type === "forget-password" && (
              <div className="mt-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 pr-10"
                  autoComplete="new-password"
                  aria-label="New password"
                />
                {/* Eye icon toggle */}
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? (
                    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0112 20C7 20 2.73 16.11 1 12c.46-1.08 1.13-2.09 1.97-2.98M6.09 6.09A9.984 9.984 0 012.06 12m19.88 0A9.984 9.984 0 0017.91 6.09M16.485 16.435A6.017 6.017 0 0112 16a6 6 0 01-6-6c0-1.048.266-2.035.733-2.877M4.121 4.121L19.879 19.879" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="8" /><circle cx="12" cy="12" r="3" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                  )}
                </span>
                {!!password && (
                  <span
                    onClick={() => setpassword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-rose-400 hover:text-rose-600"
                    aria-label="Clear password"
                    role="button"
                    tabIndex={0}
                  >
                    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </span>
                )}

                {password && !passwordSchema.shape.password.safeParse(password).success && (
                  <p className="mt-2 text-xs text-rose-500">
                    Password should be at least 8 characters long.
                  </p>
                )}
              </div>
        
            )}


            <FieldDescription>
              <a href="#">No access to email?</a>
            </FieldDescription>
          </Field>
        </CardContent>

        <CardFooter>
          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading
                ? "Processing..."
                : success
                ? "Done"
                : "Verify"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="underline">
                Contact support
              </Link>
            </div>
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}

export default VerifyOtp;