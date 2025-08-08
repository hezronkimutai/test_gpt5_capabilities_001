import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { validateEnvironment, getEnv } from './config/env';
import { logger } from './plugins/logger';
import { registerErrorHandler } from './middlewares/error';
import { healthRoutes } from './routes/health';
import { exampleRoutes } from './routes/example';

export async function buildServer() {
  // Validate environment first
  const env = validateEnvironment();
  
  // Create Fastify instance with logger configuration
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    requestIdLogLabel: 'reqId',
    requestIdHeader: 'x-request-id',
  });

  // Register plugins
  await app.register(sensible);
  await app.register(helmet, {
    contentSecurityPolicy: false, // Allow for development
  });
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: '1 minute',
  });

  // Register error handler
  registerErrorHandler(app);

  // Register routes
  await app.register(healthRoutes);
  await app.register(exampleRoutes);

  return app;
}

async function start() {
  try {
    const app = await buildServer();
    const env = getEnv();
    
    await app.listen({ 
      port: env.PORT, 
      host: '0.0.0.0' 
    });
    
    app.log.info(`🚀 Server listening on http://localhost:${env.PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}