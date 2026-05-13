"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useCartStore from "@/store/cart.store";

const SHEET_SIDES = ["right"] as const;

function CartBadge({ count }: { count: number }) {
  return (
    <span
      className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-indigo-600 text-white w-5 h-5 text-xs font-bold transition-opacity ${
        count === 0 ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
    >
      {count > 0 ? count : null}
    </span>
  );
}


export function CartModal() {
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart
  } = useCartStore();

  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button
              aria-label="Open cart"
              variant="ghost"
              size="icon"
              className="relative focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span className="text-2xl">🛒</span>
              <CartBadge count={cart.length} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={side}
            className="w-full max-w-full sm:w-[400px] flex flex-col px-0 bg-white dark:bg-zinc-900/80 border-l border-zinc-200 dark:border-zinc-800"
          >
            <SheetHeader className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-6 py-4">
              <SheetTitle className="text-lg md:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Cart
              </SheetTitle>
              <SheetDescription asChild>
                <p className="text-sm md:text-base leading-6 text-zinc-600 dark:text-zinc-400">
                  Your selected meals and order summary.
                </p>
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 md:px-6 md:py-5">
              <AnimatePresence>
                {cart.length === 0 && (
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.24, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 py-12"
                  >
                    <span className="text-4xl mb-2">🛒</span>
                    <span className="text-base md:text-lg font-medium">No items added.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-col gap-6">
                {cart.map((item) => {
                  const restaurantName =
                    (item as any).restaurantName ||
                    (item as any).provider?.restaurantName ||
                    (item as any).resturantName ||
                    (item as any).restaurant_name;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group flex gap-5 md:gap-6 p-4 md:p-5 items-stretch min-h-[110px] shadow-sm transition-all duration-300"
                    >
                      <div className="flex-shrink-0 flex items-center">
                        <div className="aspect-square w-16 h-16 md:w-20 md:h-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title || "Meal image"}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full rounded-xl"
                              priority={false}
                            />
                          ) : (
                            <span className="text-2xl text-zinc-300 dark:text-zinc-600">🍽️</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3
                              className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100 truncate"
                              title={item.title}
                            >
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              className="ml-2 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-red-600 hover:bg-zinc-100 dark:hover:text-red-400 dark:hover:bg-zinc-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                              tabIndex={0}
                            >
                              <span className="text-xl leading-none">&times;</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mt-1 text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium">Meal ID:</span>
                            <span className="font-mono tracking-tight text-zinc-700 dark:text-zinc-300">
                              {item.id}
                            </span>
                          </div>
                          <div className="mt-1 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium">Restaurant:</span>{" "}
                            {restaurantName || "Unknown"}
                          </div>
                        </div>

                        <div className="flex flex-row items-end gap-4 mt-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8"
                              aria-label={`Decrease quantity of ${item.title}`}
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              <span className="font-bold">–</span>
                            </Button>
                            <span className="text-sm font-medium text-foreground min-w-[26px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8"
                              aria-label={`Increase quantity of ${item.title}`}
                              onClick={() => increaseQuantity(item)}
                            >
                              <span className="font-bold">+</span>
                            </Button>
                          </div>
                          <div className="text-sm text-right font-semibold text-foreground min-w-[64px]">
                            ৳ {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                          <span>Delivery:</span>
                          <span className="font-mono text-zinc-700 dark:text-zinc-200">
                            {/* Delivery charge logic here */}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* 
                Professional summary can be added here using standard card summary rows.
                Add subtotal, delivery, and total here in future.
              */}
            </div>
            <SheetFooter className="sticky bottom-0 left-0 right-0 bg-white dark:bg-zinc-900/80 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 z-10 flex flex-col gap-4">
              <div className="flex items-center w-full gap-4">
                <Button
                  onClick={clearCart}
                  aria-label="Clear cart"
                  variant="secondary"
                  className="flex-1 h-12 rounded-xl font-semibold text-base shadow-none transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  disabled={cart.length === 0}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="default"
                  aria-label="Go to checkout"
                  className="flex-1 h-12 rounded-xl font-semibold text-base shadow-none transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onClick={() => router.push("/checkout")}
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </div>
              <Button
                variant="ghost"
                aria-label="View full cart"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 mt-1 text-base font-medium py-2 h-12 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => router.push("/cart")}
                disabled={cart.length === 0}
              >
                View Cart
              </Button>
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  aria-label="Close cart"
                  className="w-full rounded-xl mt-1 text-base font-medium py-2 h-12 mb-1 border border-zinc-200 dark:border-zinc-800 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}