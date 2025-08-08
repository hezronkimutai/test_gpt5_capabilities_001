import { FastifyInstance } from 'fastify';
import { getEnv } from '../config/env';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const env = getEnv();
    return { 
      status: 'ok' as const, 
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  });
}
