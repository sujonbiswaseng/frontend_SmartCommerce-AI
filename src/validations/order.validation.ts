import z from "zod";

export const CreateorderData = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z
    .string({
      error: () => ({
        message: "must be a valid phone number with 11 or 12 digits",
      }),
    })
    .min(11, { message: "must be a valid phone number with 11 or 12 digits" })
    .max(12, { message: "must be a valid phone number with 11 or 12 digits" })
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "must be a valid phone number"
    ),
  address: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});
