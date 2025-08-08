import pino from 'pino';

function createLogger() {
  try {
    // Try to use validated environment if available
    const { getEnv } = require('../config/env');
    const env = getEnv();
    return pino({
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    });
  } catch {
    // Fallback logger if env not validated yet
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    });
  }
}

export const logger = createLogger();
