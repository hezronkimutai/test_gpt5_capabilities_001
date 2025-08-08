import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
});

export type Environment = z.infer<typeof envSchema>;

let env: Environment;

export function validateEnvironment(): Environment {
  if (env) return env;
  
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // Use console.error instead of logger to avoid circular dependency
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
  
  env = result.data;
  return env;
}

export function getEnv(): Environment {
  if (!env) {
    throw new Error('Environment not validated. Call validateEnvironment() first.');
  }
  return env;
}
