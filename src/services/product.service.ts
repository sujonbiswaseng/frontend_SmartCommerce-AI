import { env } from "@/env";
import { cookies } from "next/headers";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { revalidateTag } from "next/cache";
import { TResponseProduct } from "@/types/product.type";
const api_url = env.BACKEND_URL;

export interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export interface ProductStatusUpdateData {
  status: string;
}

export const productService = {
  // Create a product
  createProduct: async (productData: any) => {
    try {
      const cookieStore = await cookies();
      const formData = new FormData();
      const { images, ...rest } = productData;

      formData.append("data", JSON.stringify(rest));
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((image: File) => formData.append("files", image));
      }

      const res = await fetch(`${api_url}/api/v1/product`, {
        method: "POST",
        headers: { Cookie: cookieStore.toString() },
        body: formData,
      });

      revalidateTag("product", "max");
      const data = await res.json();
      const result = data as ApiResponse<TResponseProduct>;

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Product creation failed",
        };
      }

      return {
        success: result.success,
        message: result.message || "Product created successfully",
        data: result.data,
      };
    } catch (error) {
      return { success: false, error: { message: "Something went wrong" } };
    }
  },

  // Get all products
  getAllProducts: async (params?: Record<string, any>, options?: ServiceOptions) => {
    try {
      const url = new URL(`${api_url}/api/v1/products`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const config: RequestInit = {};
      if (options?.cache) config.cache = options.cache;
      if (options?.revalidate)
        config.next = { revalidate: options.revalidate };
      config.next = { ...config.next, tags: ["product", "products"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      const result = data.data?.data as TResponseProduct[];

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Failed to get products",
        };
      }

      return {
        success: data.success,
        message: data.message || "Products retrieved successfully",
        data: result,
        pagination: data.data?.pagination,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  // Get a product by ID
  getProductById: async (productId: string) => {
    try {
      const res = await fetch(`${api_url}/api/v1/product/${productId}`);
      const data = await res.json();
      const result = data as ApiResponse<TResponseProduct>;

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Failed to get product",
        };
      }

      return {
        success: result.success,
        message: result.message || "Product retrieved successfully",
        data: result.data,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update a product
  updateProduct: async (productId: string, updateData: any) => {
    try {
      const cookieStore = await cookies();
      const formData = new FormData();
      const { images, ...rest } = updateData;

      formData.append("data", JSON.stringify(rest));
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((image: File) => formData.append("files", image));
      }

      revalidateTag("product", "max");
      const res = await fetch(`${api_url}/api/v1/product/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: { Cookie: cookieStore.toString() },
        body: formData,
      });

      const data = await res.json();
      const result = data as ApiResponse<TResponseProduct>;

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Product update failed",
        };
      }

      return {
        success: result.success,
        message: result.message || "Product updated successfully",
        data: result.data,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Delete a product
  deleteProduct: async (productId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${api_url}/api/v1/product/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });

      revalidateTag("product", "max");
      const data = await res.json();
      const result = data as ApiResponse<TResponseProduct>;

      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return { success: error.success, message: error.message };
      }

      return { success: result.success, message: result.message, data: result.data };
    } catch (error: any) {
      return { success: false, message: "Something went wrong, please try again" };
    }
  },
};