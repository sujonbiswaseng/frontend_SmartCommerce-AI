"use client";

import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";
import { getAllProductsAction } from "@/actions/product.actions";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],

    queryFn: async () => {
      const res = await getAllProductsAction();
      console.log(res, 'sdfsdfsdfsdfsf');
      
      if (!res || !res.success) {
        throw new Error(res?.message || 'Failed to fetch products');
      }
      
      return res.data || [];
    },
  });
};