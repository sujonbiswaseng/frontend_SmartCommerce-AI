import { CreateOrder } from "@/actions/order.action"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import useCartStore from "@/store/cart.store"
import { ICreateorderData, IOrderItem } from "@/types/order/order.type"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

export function OrderForm({
    deliveryCharge,
    setactiveButton,
}: {
    deliveryCharge: any,
    setactiveButton: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const router = useRouter()
    const [orderdata, setorderdata] = useState<ICreateorderData | {}>({})
    const { removeFromCart, cart, clearCart, addToCart,decreaseQuantity,deleteFromCart,increaseQuantity } = useCartStore()

    const items: IOrderItem[] = cart.map(item => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity
    }))

    const formData = {
        ...orderdata,
        items
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const toastid = toast.loading("order creating.....")
        const response = await CreateOrder(formData as ICreateorderData)
        if (response.error || !response.success) {
            toast.dismiss(toastid)
            toast.error(response.message)
            return
        }

        toast.dismiss(toastid)
        toast.success(response.message || 'order created successfully')
        setactiveButton(true)

        if (response.paymentUrl) {
            window.location.href = response.paymentUrl
        }

    }
    return (
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="form-name">First Name</FieldLabel>
                    <Input
                        onChange={(e) => setorderdata({ ...orderdata, first_name: e.target.value })}
                        id="form-name"
                        type="text"
                        placeholder="Evil Rabbit"
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="form-name">Last Name</FieldLabel>
                    <Input
                        onChange={(e) => setorderdata({ ...orderdata, last_name: e.target.value })}
                        id="last_name"
                        type="text"
                        placeholder="Evil Rabbit"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
                    <Input
                        id="form-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="^(\+?\d{1,3}[- ]?)?\d{11,12}$"
                        maxLength={12}
                        minLength={11}
                        placeholder="01*********"
                        required
                        onChange={(e) => setorderdata({ ...orderdata, phone: e.target.value })}
                    />

                </Field>
                <Field>
                    <FieldLabel htmlFor="form-address">Address</FieldLabel>
                    <Input id="form-address" onChange={(e) => setorderdata({ ...orderdata, address: e.target.value })} type="text" placeholder="123 Main St" />
                </Field>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit">{deliveryCharge == 0 ? "submit" : "Submit & pay"}</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
