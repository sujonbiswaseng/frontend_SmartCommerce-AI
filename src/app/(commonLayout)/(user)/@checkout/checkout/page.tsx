import { PaymentCard } from "@/components/billingsdk/payment-card";



export default async function CheckoutPage() {
  return (
    <div className="min-h-screen mt-6 md:mt-10 lg:mt-14 xl:mt-20">
      <PaymentCard title={'payment'} description={'this is payment page'}/>
    </div>
  )
}