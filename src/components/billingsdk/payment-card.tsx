"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderForm } from "../modules/orders/OrderContactForm";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import useCartStore from "@/store/cart.store";

export interface PaymentCardProps {
  title: string;
  description: string;
  className?: string;
}

export function PaymentCard({
  title,
  description,
  className,
}: PaymentCardProps) {
  const {addToCart,cart } = useCartStore();
  // const subtotal = getSubtotal();
  // const deliveryCharge = getDeliveryCharge();
  // const total = subtotal + deliveryCharge;
  const [activeButton, setactiveButton] = useState(false);

  // You may want to add loading state if data is async; for demo, keep it instant.

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("max-w-[1440px] mx-auto w-full px-4 md:px-8", className)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
        {/* Order Summary Card */}
        <section className="order-2 md:order-1 flex flex-col h-full">
          <div className="space-y-6 md:sticky md:top-8">
            <Card className="bg-card border border-border rounded-2xl shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-card-foreground text-xl md:text-2xl font-bold">
                  {title || "Order Summary"}
                </CardTitle>
                {description && (
                  <div className="mt-2 text-muted-foreground text-sm font-medium">
                    {description}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-semibold text-card-foreground tabular-nums">
                      {/* ৳ {subtotal.toFixed(2)} */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Delivery Charge</span>
                    <span className="font-semibold text-card-foreground tabular-nums">
                      {/* ৳ {deliveryCharge.toFixed(2)} */}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <span className="font-bold text-primary text-base">Total</span>
                    <span className="text-xl font-bold tabular-nums text-primary">
                      {/* ৳ {total.toFixed(2)} */}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center text-xs text-muted-foreground font-medium mt-2 select-none">
              <span className="mr-2" aria-hidden>
                <svg width="16" height="16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor" className="text-primary"/><path d="M6.75 8.75v-2a1.25 1.25 0 1 1 2.5 0v2a1.25 1.25 0 1 1-2.5 0zm1.5 3.25h.09a.75.75 0 1 0 0-1.5h-.09a.75.75 0 1 0 0 1.5z" fill="white"/></svg>
              </span>
              Secure payment &amp; money back guarantee
            </div>
          </div>
        </section>
        {/* Order Form */}
        <section className="order-1 md:order-2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-card rounded-2xl shadow-sm border border-border"
          >
            {/* <div className="p-6">
              <OrderForm deliveryCharge={deliveryCharge} setactiveButton={setactiveButton} />
            </div> */}
          </motion.div>
        </section>
      </div>
    </motion.main>
  );
}
