import { IOrderUpdateStatus } from "@/actions/order.action";
import { env } from "@/env";
import {
  ICreateorderData,
  IGetOrderData,
  TResponseOrderData,
} from "@/types/order/order.type";
import { Ipagination } from "@/types/pagination.type";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const api_url = env.BACKEND_URL;
export const OrderService = {
  getownorder: async (
    params?: any,
    options?: { cache?: RequestCache; revalidate?: number },
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${api_url}/api/v1/orders`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const config: RequestInit & { next?: any } = {
        credentials: "include",
        headers: { Cookie: cookieStore.toString() },
      };
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { ...config.next, revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["order", "orders"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "retrieve own orders data failed",
        };
      }
      return {
        success: data.success,
        message: data.message || "retrieve own orders data successfully",
        data: data.data.result as TResponseOrderData[],
        pagination: data.data.pagination as Ipagination,
      };
    } catch (error) {
      return {
        message: "something went wrong please try again",
      };
    }
  },

  getAllOrders: async (
    params?: any,
    options?: { cache?: RequestCache; revalidate?: number },
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${api_url}/api/v1/orders/all`);
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        }
      }
      const config: RequestInit & { next?: any } = {
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
      };
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { ...config.next, revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["order", "orders"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success ?? false,
          message: error.message || "Failed to fetch all orders (admin only).",
        };
      }

      // Validate shape, fallback empty array
      const resultList = Array.isArray(data?.data?.result)
        ? data.data.result
        : [];
      const pagination = data?.data?.pagination ?? null;

      return {
        success: data.success ?? true,
        message: data.message || "Fetched all orders (admin) successfully.",
        data: resultList as TResponseOrderData[],
        pagination: pagination as Ipagination,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.message ||
          "An unexpected error occurred while fetching all orders (admin).",
      };
    }
  },

  updateOrderStatus: async (id: string, orderdata: IOrderUpdateStatus) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${api_url}/api/v1/provider/orders/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(orderdata),
      });
      revalidateTag("order", "max");
      const data = await res.json();
      const result = data as ApiResponse<IGetOrderData>;
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "order status update failed",
        };
      }
      return {
        success: result.success,
        message: result.message || "order updated successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "An error occurred while updating the meal",
      };
    }
  },
  createorder: async (orderData: ICreateorderData) => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(`${api_url}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });
      revalidateTag("order", "max");

      const data = await res.json();

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "meals create failed",
        };
      }

      return {
        success: data.success,
        message: data.message,
        data: data.data.order as TResponseOrderData,
        paymentUrl: data.data.paymentUrl,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: `${error} Something Went Wrong` },
      };
    }
  },

  getOwnPayment: async (id:string,paymentId:any) => {
    try {
      const cookieStore=await cookies()
      const res = await fetch(`${api_url}/api/v1/order/${id}/own-payment?paymentId=${paymentId}`, {
        method: "GET",
        credentials:"include",
        cache:"no-store",
        headers:{
          Cookie:cookieStore.toString()
        }
      });
      if (!res.ok) {
        const error = await res.json();
        return {
          success: false,
          message: error.message || "Failed to fetch payment information",
        };
      }

      const data = await res.json();
      return {
        success: true,
        data: data.data,
        message: data.message || "Fetched payment information successfully",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Something went wrong while fetching payment info",
      };
    }
  },

  getorderbyid: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${api_url}/api/v1/orders/${id}`, {
        credentials: "include",

        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const body = await res.json();
      const result = body as ApiResponse<IGetOrderData>;
      if (!res.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "retrieve order by order failed",
        };
      }
      return result;
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },


  deleteOrder: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${api_url}/api/v1/order/${id}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      revalidateTag("order", "max");
      const body = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: body.message || "Failed to delete order",
        };
      }
      return {
        success: true,
        data: body.data,
        message: body.message || "Order deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.message || "Something went wrong while deleting the order",
      };
    }
  },
};
