const LoadingContent = ({ data }: { data: string }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 backdrop-blur-xl"
      aria-modal="true"
      role="presentation"
      tabIndex={-1}
      data-testid="global-loading-backdrop"
    >
      <section className="w-full py-12 md:py-16 lg:py-20 pointer-events-none">
        <div className="mx-auto w-full max-w-[400px] px-4 sm:px-6 lg:px-8 flex justify-center">
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="
              flex flex-col items-center w-full gap-5
              rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm
              transition-all duration-300
              dark:border-zinc-800 dark:bg-zinc-900/80
              pointer-events-auto
            "
          >
            {/* Premium SaaS Spinner */}
            <span className="relative flex h-20 w-20 mb-3 select-none" aria-label="Loading spinner">
              <span
                className="
                  absolute inset-0 z-10 animate-spin rounded-full
                  border-[5px] border-t-indigo-600 border-b-cyan-400 border-l-transparent border-r-transparent
                  bg-gradient-to-tr from-indigo-50 via-white to-cyan-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900
                  shadow-lg
                "
                style={{ borderRightColor: "transparent", borderLeftColor: "transparent" }}
              />
              <svg
                className="absolute inset-0 w-full h-full z-0"
                viewBox="0 0 80 80"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="saasSpinnerRadial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0e7490" stopOpacity="0.07" />
                  </radialGradient>
                  <linearGradient id="saasSpinnerLinear" x1="12" y1="12" x2="68" y2="68" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="url(#saasSpinnerLinear)"
                  strokeWidth="6"
                  opacity="0.14"
                  fill="url(#saasSpinnerRadial)"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="24"
                  stroke="#e0e7ff"
                  strokeWidth="2"
                  opacity="0.30"
                  fill="none"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <span
                  className="w-4 h-4 bg-indigo-600 rounded-full opacity-80 shadow-lg animate-pulse"
                  aria-hidden="true"
                />
              </span>
            </span>
            <div className="flex flex-col gap-3 w-full items-center">
              <span className="text-2xl font-bold tracking-tight md:text-3xl text-zinc-900 dark:text-zinc-100 text-center drop-shadow-sm">
                One moment please...
              </span>
              <span className="text-sm leading-6 md:text-base text-zinc-600 dark:text-zinc-400 text-center max-w-xs">
                We&#39;re carefully preparing your&#160;
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{data}</span>.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingContent;