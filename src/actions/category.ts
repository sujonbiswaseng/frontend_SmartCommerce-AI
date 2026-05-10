'use server'
import { CategoriesService, Icategory } from "@/services/category.service";
import { ICreateCategory } from "@/types/category";

import { createCategorySchema } from "@/validations/category.validation";


export const categoryCreate = async (
  data: FormData
) => {
  const name = data.get('name') as string;
  const file = data.get('file') as File;

  const parsedPayload = createCategorySchema.safeParse({ name, image: file });
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const res = await CategoriesService.createCategory(data);
    return res;
  } catch (error: unknown) {
    return {
      success: false,
      message: ""
    };
  }
};

export const getCategory = async (params?:any) => {
  try {
    const res = await CategoriesService.getcategory(params);
    return res;
  } catch (error) {
    return null;
  }
}

export const updatecategory = async (id:string,data:Icategory) => {
    const res = await CategoriesService.updateCategory(id,data);
    return res;
}

export const deleteCategory = async (id:string) => {
    const res = await CategoriesService.deleteCategory(id);
    return res;
 
}

export const singlecategory = async (id:string) => {
    const res = await CategoriesService.singlecategory(id);
    return res;
 
}