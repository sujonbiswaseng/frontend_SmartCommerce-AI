import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import QueryProviders from "@/providers/QueryProviders";
import { ToastContainer } from "react-toastify";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "bitebase - Premium Food Delivery",
  description:
    "Discover and order delicious meals from top restaurants. Premium food delivery experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      lang="en"
      className={`font-${inter} font-${mono} font-sans h-full antialiased `}
    >
      <body
        suppressHydrationWarning
        data-new-gr-c-s-check-loaded="..."
        data-gr-ext-installed=""
        className={`w-full overflow-x-hidden min-h-screen font-sans antialiased bg-background text-foreground`}
      >
          <QueryProviders>
          {children}
         
          <ToastContainer  />
        </QueryProviders>
      </body>
    </html>
  );
}
