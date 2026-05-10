
import z from "zod";

export const CreateCategory = z.object({
  name: z.string().min(1, "Name is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required"),
});
export const UpdateCategory = z.object({
  name: z.string().optional(),
  image:z.any().optional(),
})