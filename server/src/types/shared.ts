import { z } from 'zod';

export const EchoSchema = z.object({
  message: z.string().min(1).max(1000), // Add max length for security
});

export type EchoInput = z.infer<typeof EchoSchema>;
export type EchoResponse = { echoed: string };

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  uptime: z.number(),
  environment: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
