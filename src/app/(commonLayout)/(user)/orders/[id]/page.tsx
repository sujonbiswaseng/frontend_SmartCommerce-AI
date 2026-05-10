export const dynamic = "force-dynamic";
import OrderDetails from '@/components/modules/orders/orderdetails';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ErrorFallback from '@/components/shared/ErrorFallbace';
import { OrderService } from '@/services/order.service';

export async function generateStaticParams() {
  const data = await OrderService.getownorder();
  const orders = Array.isArray(data?.data) ? data.data : [];
  return orders.slice(0, 3).map((item: any) => ({
    id: item.id,
  }));
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  try {
    const { id } = await params;
    const res = await OrderService.getorderbyid(id);

    if (!res.data || !res.success) {
      return (
        <ErrorFallback
          message="Order not found."
          title="Sorry, we couldn't locate the order you're looking for. Please check the link or try again later."
        />
      );
    }

    const order = res.data;
    return (
      <ErrorBoundary
        fallback={
          <ErrorFallback
            message="Something went wrong while loading your order"
            title="We're having trouble displaying your order details. Please try refreshing the page or coming back later."
          />
        }
      >
        <div>
          <OrderDetails orderdetails={order} />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    return (
      <ErrorFallback
        message="Unexpected error occurred"
        title="An unexpected error happened while loading your order. Please try again later."
      />
    );
  }
};

export default OrderDetailsPage