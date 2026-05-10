import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({

  server: {
    BACKEND_URL: z.url(),
    ACCESS_TOKEN_SECRET:z.string(),
    REFRESH_TOKEN_SECRET:z.string()
  },
  client: {
    NEXT_PUBLIC_test: z.string().min(1),
    NEXT_PUBLIC_BACKEND_URL: z.url(),
  },
  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_test: process.env.NEXT_PUBLIC_test,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  },
});