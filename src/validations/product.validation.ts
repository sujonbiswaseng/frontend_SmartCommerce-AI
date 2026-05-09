import z from "zod";


  export const CreateProductSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    price: z
    .preprocess((val) => {
      if (val === "" || val === null) return 0;
      return Number(val);
    }, z
      .number()
      .min(60, { message: "Fee must be at least 60 Taka." })
      .max(6000, { message: "Fee cannot exceed 6000 Taka." })
      .optional()
    ),
    location: z.string().min(2, "Location is required"),
    deliverycharge: z.number(),
    brand: z.string().nullable().optional(),
    warrenty: z.string().min(1, "Warranty information is required"),
    images: z
    .union([z.array(z.instanceof(File)).min(1, "At least 1 image is required"), z.array(z.string()).min(1, "At least 1 image is required")]),
    category_name: z.string().min(1, "Category name is required"),
    date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val).toISOString())
  });
  

  export const UpdateProductShema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    location: z.string().optional(),
    deliveryCharge: z.number().optional(),
    brand: z.string().nullable().optional(),
    warrenty: z.string().optional(),
    images: z.any().optional(),
    category_name: z.string().optional(),
    date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val).toISOString()).optional()
  });