import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      const status = error.statusCode || 500;
      const payload = {
        statusCode: status,
        error: error.name || 'Error',
        message: error.message,
      };
      app.log.error({ err: error }, 'Unhandled error');
      reply.status(status).send(payload);
    },
  );
}
