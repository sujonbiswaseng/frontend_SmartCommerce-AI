
import { createUserSchema } from "@/validations/auth.validations";
import z from "zod"


// user type
export type TUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: any| string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  status: string;
  phone: string | null;
  isActive: boolean;
  bgimage: string | null;
};
export type UserCreateInput = z.infer<typeof createUserSchema>;

export type TResponseUserData<T = unknown> = TUser & T;
