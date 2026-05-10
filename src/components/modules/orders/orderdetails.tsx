'use client'
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { IGetOrderData } from "@/types/order/order.type";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrderDetails({ orderdetails }: { orderdetails: IGetOrderData }) {
  const order = orderdetails;
  const defaultProfile =
    "https://res.cloudinary.com/drmeagmkl/image/upload/v1766941482/chatgpt_m8tmep.png";

  if (!order) return notFound();

  return (
    <main className="max-w-[1440px] mx-auto w-full px-4 py-8 sm:px-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        <Card className="w-full bg-card text-card-foreground border border-border rounded-2xl shadow-md">
          <CardHeader className="flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-border">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Order Details
              </h1>
              <div>
                {order.status === "CANCELLED" ? (
                  <Status variant="error" className="bg-destructive text-destructive-foreground">
                    <StatusIndicator />
                    <span className="capitalize font-semibold">{order.status}</span>
                    <StatusLabel />
                  </Status>
                ) : (
                  <Status variant="success" className="bg-success text-success-foreground">
                    <StatusIndicator />
                    <span className="capitalize font-semibold">{order.status}</span>
                    <StatusLabel />
                  </Status>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-base font-semibold">
                    {order.id?.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="text-foreground font-medium text-lg">
                  {order.first_name} {order.last_name}
                </div>
                <div className="flex flex-col gap-1 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground font-medium">Phone:&nbsp;</span>
                    <span>{order.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Address:&nbsp;</span>
                    <span>{order.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Total Price:&nbsp;</span>
                    <span className="font-bold text-primary">
                      ৳ {Number(order.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end gap-1 text-right text-muted-foreground text-xs">
                <div>
                  <span>Created: </span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span>Updated: </span>
                  <span>{new Date(order.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 tracking-tight">
                Items
              </h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                role="list"
              >
                {order.orderitem.map((item: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card className="bg-background border border-border rounded-xl shadow-sm flex flex-col h-full hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-4 px-6 pt-6">
                        <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.meal.image || defaultProfile}
                            alt={item.meal.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={defaultProfile}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/meals/${item.meal.id}`}
                            className="text-primary font-semibold hover:underline focus:underline break-all"
                          >
                            {item.meal.title}
                          </Link>
                          <div className="text-muted-foreground text-xs mt-1">
                            {item.meal.category_name}
                          </div>
                          {item.meal.cuisine && (
                            <div className="text-muted-foreground text-xs">
                              {item.meal.cuisine}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-end px-6 pb-6 pt-4 gap-1">
                        <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
                          <span>Quantity</span>
                          <span className="text-foreground font-semibold">{item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
                          <span>Unit Price</span>
                          <span className="text-foreground font-semibold">
                            ৳ {Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-base font-bold mt-1 border-t border-border pt-2">
                          <span>Total</span>
                          <span className="text-primary">
                            ৳ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}