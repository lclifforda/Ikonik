import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.string().optional(),
  BASE_URL_OTHER_PORT: z.string().optional(),
  ADMIN_PASSWORD: z.string(),
  OPENAI_API_KEY: z.string(),
  JWT_SECRET: z.string().optional().default("admin-jwt-secret-key-2024"),
});

export const env = envSchema.parse(process.env);
