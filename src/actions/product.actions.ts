import { productService } from "@/services/product.service";

export const createProductAction = async (productData: any) => {
  return await productService.createProduct(productData);
};

// Get All Products Action
export const getAllProductsAction = async (params?: Record<string, any>, options?: { cache?: RequestCache; revalidate?: number }) => {
  return await productService.getAllProducts(params, options);
};

// Get Product by ID Action
export const getProductByIdAction = async (productId: string) => {
  return await productService.getProductById(productId);
};

// Update Product Action
export const updateProductAction = async (productId: string, updateData: any) => {
  return await productService.updateProduct(productId, updateData);
};

// Delete Product Action
export const deleteProductAction = async (productId: string) => {
  return await productService.deleteProduct(productId);
};