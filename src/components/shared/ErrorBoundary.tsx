"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorKey: number;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true, errorKey: 0 };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Optionally integrate error logging here (Sentry, etc.)
  }

  handleReset = () => {
    try {
      window.location.reload();
    } catch {
      this.setState(prev => ({
        hasError: false,
        errorKey: prev.errorKey + 1,
      }));
    }
  };

  renderFallback() {
    return (
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-[400px]">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  <CardHeader className="flex flex-col items-center gap-5 pb-0">
                    <span
                      className="h-12 w-12 flex items-center justify-center rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mb-2"
                      aria-hidden="true"
                    >
                      <svg
                        width={32}
                        height={32}
                        fill="none"
                        stroke="currentColor"
                        className="text-indigo-600 dark:text-indigo-400"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth={2} />
                      </svg>
                    </span>
                    <CardTitle className="text-lg font-semibold md:text-xl text-zinc-900 dark:text-zinc-100 text-center">
                      Something went wrong
                    </CardTitle>
                    <CardDescription className="text-sm leading-6 text-zinc-600 dark:text-zinc-400 text-center">
                      We couldn’t load this content.<br />Please try again.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pt-0">
                    <Button
                      className="w-full mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={this.handleReset}
                      aria-label="Retry loading content"
                    >
                      <span aria-hidden="true" className="mr-2">🔄</span>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderFallback();
    }

    return (
      <React.Fragment key={this.state.errorKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}