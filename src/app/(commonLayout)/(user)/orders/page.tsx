import { getownorder } from '@/actions/order.action';
import CustomerOrderTable from '@/components/modules/orders/customerordertable';
import { IGetOrderData } from '@/types/order/order.type';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

import { getSession } from '@/services/auth.service';
import ErrorFallback from '@/components/shared/ErrorFallbace';

const MyOrders = async ({
  searchParams,
}: {
  searchParams:Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const res =await getSession()
  const role =res?.data?.role
  if (!res?.success || !res?.data || role==null || !role) {
    return (
      <ErrorFallback
        title="Access Denied"
        message="You do not have permission to view this page."
      />
    );
  }
  try {

    const search =await searchParams
    const res = await getownorder(search);
    if (!res.data || !res.success) {
      return (
        <ErrorFallback
          title="Unable to load your orders"
          message="We couldn't retrieve your order history at the moment. Please refresh the page or try again later."
        />
      );
    }
    const orders = res.data as IGetOrderData[];
    return (
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Error displaying your orders"
            message="An unexpected issue occurred while showing your orders. Please try again in a few minutes."
          />
        }
      >
        <div className='mt-6 md:mt-10 lg:mt-14 xl:mt-20'>
          <CustomerOrderTable role={role as string} initialorder={orders} />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    return (
      <ErrorFallback
        title="Unexpected error"
        message="There was a problem loading your orders. Please try again later."
      />
    );
  }
};

export default MyOrders;
