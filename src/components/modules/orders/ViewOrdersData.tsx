import React from "react";
import Link from "next/link";
import CopyableId from "@/components/shared/CopyAndRoutebyId";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OrderItem {
  createdAt: string;
  id: string;
  meal: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  price: number;
  quantity: number;
  updatedAt: string;
}

interface OrderData {
  address: string;
  createdAt: string;
  customerId: string;
  first_name: string;
  last_name: string;
  paymentStatus: string;
  id: string;
  orderitem: OrderItem[];
  phone: string;
  status: string;
  totalPrice: number;
  updatedAt: string;
}

const statusVariants: Record<
  string,
  { label: string; variant: "secondary" | "success" | "destructive" | "outline" }
> = {
  PLACED: { label: "Placed", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

const paymentVariants: Record<
  string,
  { label: string; variant: "secondary" | "success" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  PAID: { label: "Paid", variant: "success" },
  FAILED: { label: "Failed", variant: "destructive" },
};

function formatDate(d?: string) {
  if (!d) return "-";
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const OrderCard: React.FC<{
  item: OrderItem;
}> = ({ item }) => (
  <Card className="w-full flex flex-col h-full bg-card border border-border rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg group">
    <CardContent className="p-6 flex flex-col gap-4 grow">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-input flex items-center justify-center overflow-hidden">
          {/* Placeholder icon; replace with actual images as needed */}
          <Image
            src="/placeholders/meal.svg"
            width={48}
            height={48}
            alt=""
            className="object-contain w-8 h-8 opacity-70"
            priority={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-card-foreground font-semibold text-base md:text-lg truncate group-hover:text-primary transition-colors">
            {item.meal.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground text-xs flex-shrink-0">Meal ID:</span>
            <CopyableId
              href={item.meal.id}
              showShort={item.meal.id as any}
              id={item.meal.id}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 grow">
        <div className="line-clamp-2 text-muted-foreground text-sm md:text-[15px]">
          {item.meal.description || "-"}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            Price: <span className="font-semibold ms-2 text-card-foreground">{item.price}</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            Qty: <span className="font-semibold ms-2 text-card-foreground">{item.quantity}</span>
          </Badge>
        </div>
      </div>
      {/* Optional CTA goes here */}
    </CardContent>
  </Card>
);

const SkeletonOrderCard: React.FC = () => (
  <Card className="w-full h-full animate-pulse bg-card border border-border rounded-xl shadow-sm flex flex-col">
    <CardContent className="p-6 flex flex-col gap-4 grow">
      <div className="flex items-center gap-4 mb-2">
        <div className="rounded-lg w-12 h-12 bg-muted" />
        <div className="grow flex flex-col gap-2">
          <div className="h-4 w-2/3 bg-muted-foreground/10 rounded" />
          <div className="h-3 w-1/3 bg-muted-foreground/10 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-muted-foreground/10 rounded mb-2" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-20 bg-muted-foreground/10 rounded" />
        <div className="h-6 w-16 bg-muted-foreground/10 rounded" />
      </div>
    </CardContent>
  </Card>
);

const ViewOrdersData: React.FC<{
  viewMode: boolean;
  viewData?: OrderData;
}> = ({ viewMode, viewData }) => {
  if (!viewMode || !viewData) return null;

  const statusBadge = statusVariants[viewData.status] || {
    label: viewData.status,
    variant: "outline",
  };
  const paymentBadge = paymentVariants[viewData.paymentStatus] || {
    label: viewData.paymentStatus ?? "-",
    variant: "outline",
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full">
      <motion.div
        className="rounded-2xl border border-border bg-card shadow-xl px-6 py-8 space-y-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {/* Profile Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary/5 to-accent/10 shadow-inner border border-primary/10">
            <span
              role="img"
              aria-label={`${viewData.first_name} ${viewData.last_name} avatar`}
              className="text-5xl text-primary/50"
            >
              👤
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-2xl text-primary leading-snug truncate">{viewData.first_name} {viewData.last_name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground font-medium">Order ID:</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <Link
                      href={`/orders/${viewData.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Order details"
                      className="font-mono text-sm text-primary hover:underline select-all truncate"
                      tabIndex={0}
                    >
                      {viewData.id.slice(0, 10)}....
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 py-1"
                      aria-label="Copy Order ID"
                      onClick={() => {
                        navigator.clipboard.writeText(viewData.id ?? "");
                        if (typeof window !== "undefined") {
                          import("react-toastify").then(({ toast }) => {
                            toast.success("Order ID copied to clipboard!");
                          });
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground">
                    <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                      <path
                        d="M15 2v2m-6-2v2m-5 4h16M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"
                        stroke="currentColor"
                        strokeWidth={1.3}
                      />
                    </svg>
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {formatDate(viewData.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground font-medium">Status:</span>
                  <Badge variant={statusBadge.variant as any}>{statusBadge.label}</Badge>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground font-medium">
                    Payment Status:
                  </span>
                  <Badge variant={paymentBadge.variant as any}>{paymentBadge.label}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground font-medium">Phone:</span>
                  <span className="font-mono text-sm text-card-foreground select-all">
                    {viewData.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground font-medium">Address:</span>
                  <span className="font-mono text-sm text-card-foreground select-all truncate">
                    {viewData.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border" />

        {/* Ordered Items */}
        <section>
          <span className="text-muted-foreground font-medium text-lg block mb-4">
            Ordered Items ({viewData.orderitem?.length || 0})
          </span>
          <div className="flex flex-wrap">
            {viewData.orderitem.length === 0 && (
              <div className="text-muted-foreground">No items found for this order.</div>
            )}
            <AnimatePresence>
              {viewData.orderitem.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <OrderCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <div className="h-px w-full bg-border" />

        {/* Footer summary */}
        <section className="flex flex-col sm:flex-row flex-wrap gap-6 items-center justify-between">
          <div>
            <span className="text-muted-foreground mr-1">Total Price: </span>
            <span className="text-primary font-bold text-xl">
              ৳{viewData.totalPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Customer ID:</span>
            <span className="font-mono text-sm text-card-foreground select-all flex items-center gap-2">
              <Link
                href={`/profile/user/${viewData.customerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {viewData.customerId.slice(0, 10)}....
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 py-1"
                aria-label="Copy Customer ID"
                onClick={() => {
                  navigator.clipboard.writeText(viewData.customerId ?? "");
                  if (typeof window !== "undefined") {
                    import("react-toastify").then(({ toast }) => {
                      toast.success("Customer ID copied to clipboard!");
                    });
                  }
                }}
              >
                Copy
              </Button>
            </span>
          </div>
          <div>
            <span className="text-muted-foreground mr-1">Last Updated: </span>
            <span className="text-card-foreground">
              {formatDate(viewData.updatedAt)}
            </span>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default ViewOrdersData;