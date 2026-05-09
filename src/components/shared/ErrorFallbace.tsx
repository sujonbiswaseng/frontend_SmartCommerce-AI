"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorFallback({
  title = "Something went wrong",
  message = "Please try again later.",
}: {
  title?: string;
  message?: string;
}) {
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col items-center gap-5">
              <span
                className="h-16 w-16 flex items-center justify-center rounded-full bg-destructive/10 dark:bg-red-500/15 text-destructive dark:text-red-400 mb-2"
                aria-hidden="true"
              >
                <AlertTriangle className="w-8 h-8" />
              </span>
              <h2 className="text-lg font-semibold md:text-xl text-zinc-900 dark:text-zinc-100 text-center">
                {title}
              </h2>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400 text-center md:text-base">
                {message}
              </p>
            </div>
            <div className="flex gap-4 pt-6 justify-center">
              <Button
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                aria-label="Refresh page"
                onClick={() => router.refresh()}
                size="sm"
              >
                <span aria-hidden="true" className="mr-2">🔄</span>
                Refresh
              </Button>
              <Button
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                variant="outline"
                size="sm"
                aria-label="Go to home page"
                onClick={() => router.push("/")}
              >
                <span aria-hidden="true" className="mr-2">🏠</span>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}