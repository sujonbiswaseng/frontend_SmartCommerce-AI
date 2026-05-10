import { env } from "@/env";
import {ICreateCategory, IUpdateCategory, TGetCategory, TResponseCategoryData } from "@/types/category";
import { TResponseProduct } from "@/types/product.type";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { TUser } from "@/types/user.type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
const api_url = env.BACKEND_URL

export interface Icategory {
  name?: string,
  image?: string
}
export const CategoriesService = {
  getcategory: async (params?: any) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${api_url}/api/v1/category`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const res = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
        next: {
          tags: ["category","categories"]
        },
      });
      const data = await res.json();
      const result = data.data.result as TResponseCategoryData<{ product: TResponseProduct; user: TUser; }>[]
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "categories retrieve failed",
        };
      }
      return {
        success: data.success,
        message: data.message || "categories retrieve successfully",
        data: result,
        pagination: data.data.pagination
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        message: "something went wrong, please try again",
      };
    }
  },
  createCategory: async (value: FormData) => {
    console.log(value,'vlaud')

    try {
      const cookieStore = await cookies();
  
      const response = await fetch(`${api_url}/api/v1/category`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        method: "POST",
        body: value
      })
      revalidateTag('category', 'max')
      const data = await response.json()
        const result =data as ApiResponse<ICreateCategory> 
          if (!result.data) {
            const error=data as ApiErrorResponse
             return { message: error.message || "category create failed" }
          }
          return { success: true, message: "category created successfully", result };

    } catch (error) {
      return {
        success: false,
        message: "something went wrong please try again"
      }

    }

  },
  updateCategory: async (id: string, updateUser: IUpdateCategory) => {
    try {
      const cookieStore = await cookies()
      const formData = new FormData();

      const { image, ...rest } = updateUser;
  
      formData.append("data", JSON.stringify(rest));
      if (image) {
        formData.append("file", image);
      }
    
      const res = await fetch(`${api_url}/api/v1/admin/category/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body:formData,
      });
      revalidateTag('category', 'max')
      const data = await res.json();
    
      const result = data as ApiResponse<TGetCategory>
      if (!res.ok) {
        const error = data as ApiErrorResponse
        return {success:error.success ,message:error.message || "category data update fail" }
      }
      return { success: result.success, message:result.message ||  "category data update successfully", data };
    } catch (error: any) {
  
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const cookieStore = await cookies()
      const res = await fetch(`${api_url}/api/v1/admin/category/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      revalidateTag("category", 'max')
      const data = await res.json();
      const result = data as ApiResponse<TGetCategory>
      if (!res.ok) {
        const error =data as ApiErrorResponse
        return { success: error.success, message:error.message || "category data delete fail" }
      }
      return {success:result.success,message:result.message || "category deleted sucessfully",data:result};
    } catch (error: any) {
    
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },
  singlecategory: async (id: string) => {
    try {
      const cookieStore = await cookies()
      const res = await fetch(`${api_url}/api/v1/category/${id}`, {
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
        next: {
          tags: ['category']
        }
      })
      const data = await res.json();
      const result = data as ApiResponse<any>
      if (!res.ok) {
        const error=data as ApiErrorResponse
        return { success: false, message: error.message || "category data retrieve fail" }
      }
      return {success:result.success,message:result.message,data:result};
    } catch (error: any) {
    
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },
}