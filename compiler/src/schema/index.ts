import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().optional().transform(Number).pipe(z.number().min(1).max(65535)),
  NODE_ENV: z.enum(["development", "production", "test", "staging"]),
  ADMIN_USER: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  API_VERSION: z.string().optional().default("v1"),
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().optional().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().optional().default("7d"),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional().transform(Number),
  REDIS_PASSWORD: z.string().optional().optional(),
  REDIS_USERNAME: z.string().optional().optional(),
  REDIS_TLS_ENABLED: z
    .string().optional()
    .transform((val) => val === "true")
    .default("false"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FORMAT: z.enum(["json", "pretty"]).default("json"),
  CORS_ORIGIN: z.string().transform((val) => val.split(",")),
  CORS_METHODS: z
    .string()
    .transform((val) => val.split(","))
    .default("GET,POST,PUT,DELETE,PATCH"),
  RATE_LIMIT_WINDOW_MS: z.string().optional().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional().transform(Number).default("100"),
});

export type EnvConfig = z.infer<typeof envSchema>;
