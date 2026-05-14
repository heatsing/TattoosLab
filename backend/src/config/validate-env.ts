import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(4000),
  NEST_ALLOWED_ORIGINS: z.string().optional(),
  API_JWT_ACCESS_SECRET: z.string().min(32),
  API_JWT_REFRESH_SECRET: z.string().min(32),
  API_JWT_ACCESS_TTL: z.string().default("15m"),
  API_JWT_REFRESH_TTL: z.string().default("30d"),
});

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(
      `Invalid backend environment configuration: ${parsed.error.message}`
    );
  }

  return parsed.data;
}