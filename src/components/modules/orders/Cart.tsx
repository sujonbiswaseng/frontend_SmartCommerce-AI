'use client'

import { MessageSquareX, Trash, Plus, Minus, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart.store";

export default function CartComponent() {
    const {cart,addToCart,clearCart,decreaseQuantity,deleteFromCart,increaseQuantity, removeFromCart}=useCartStore()
    const router = useRouter()
    
    return (
        <main className="min-h-screen bg-background py-10 px-4 md:px-10">
            {/* Main Grid */}
            <div className="max-w-[1440px] mx-auto grid lg:grid-cols-3 gap-8">

                {/* Left Section */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-foreground flex items-center justify-between">
                        Your Cart
                        {cart.length > 0 && (
                             <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                                 {cart.length} items
                             </span>
                        )}
                    </h2>

                    {cart.length === 0 ? (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquareX className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-card-foreground mb-2">Your cart is empty</h3>
                            <p className="text-muted-foreground mb-6">Looks like you haven't added any meals yet.</p>
                            <Button onClick={() => router.push("/meals")}>
                                Browse Meals
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item: any, index: number) => (
                                <CartItem
                                    key={index}
                                    title={item.name}
                                    image={item.image}
                                    value={item.quantity}
                                    increase={increaseQuantity}
                                    decrease={decreaseQuantity}
                                    removechat={removeFromCart}
                                    deliverycharge={item.deliverycharge ?? 0}
                                    quantity={item.id}
                                    clearchat={clearCart}
                                    price={item.price}
                                />
                            ))}
                        </div>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-6 bg-muted/30 p-3 rounded-lg w-fit">
                        <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                        100% Secure • Money Back Guarantee
                    </div>
                </section>

                {/* Right Section */}
                <aside className="bg-card rounded-2xl shadow-md p-6 h-fit sticky top-24 border border-border flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-4">
                        Order Summary
                    </h3>
                    
                    <div className="space-y-3">
                        {/* <div className="flex justify-between font-medium text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="text-foreground font-semibold">৳{subtotal.toFixed(2)}</span>
                        </div> */}
                        {/* <div className="flex justify-between font-medium text-muted-foreground">
                            <span>Delivery charge</span>
                            <span className="text-foreground font-semibold">৳{deliveryCharge.toFixed(2)}</span>
                        </div> */}
                    </div>

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between font-bold text-xl text-foreground">
                            <span>Total</span>
                            {/* <span className="text-primary">৳{total.toFixed(2)}</span> */}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">Including VAT & Taxes</p>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full text-lg shadow-md"
                        disabled={cart.length === 0}
                        onClick={() => router.push("/checkout")}
                    >
                        Proceed to Checkout
                    </Button>
                </aside>
            </div>
        </main>
    );
}

function CartItem({
    title,
    image,
    value,
    clearchat,
    deliverycharge,
    increase,
    decrease,
    removechat,
    quantity,
    price,
}: {
    title: string;
    image: string;
    clearchat: any;
    deliverycharge: number;
    increase: any;
    decrease: any;
    removechat: any;
    quantity: number;
    value: number;
    price: number;
}) {
    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">

                {/* Image */}
                <div className="w-full sm:w-24 h-40 sm:h-24 relative flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                        <h3 className="font-bold text-lg text-card-foreground line-clamp-1 mb-1">
                            {title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                            Delivery: <span className="font-medium text-foreground">৳{deliverycharge?.toFixed ? deliverycharge.toFixed(2) : deliverycharge}</span>
                        </div>
                    </div>
                    
                    {/* Controls on mobile vs desktop */}
                    <div className="flex items-center justify-between sm:justify-start gap-4 mt-4 sm:mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden h-9">
                            <button 
                                className="w-9 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" 
                                onClick={() => decrease(quantity)}
                                disabled={value <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-10 text-center font-semibold text-sm text-foreground">
                                {value}
                            </div>
                            <button 
                                className="w-9 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" 
                                onClick={() => increase(quantity)}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* Remove Action */}
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removechat(quantity)} title="Remove Item">
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-xl sm:text-lg font-bold text-primary sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t border-border sm:border-0 mt-4 sm:mt-0">
                    ৳{(price * value).toFixed(2)}
                    <div className="text-xs font-normal text-muted-foreground mt-1">
                        ৳{price.toFixed(2)} / each
                    </div>
                </div>
                
            </div>
        </div>
    );
}