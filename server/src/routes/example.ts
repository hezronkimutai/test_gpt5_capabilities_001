import { FastifyInstance } from 'fastify';
import { EchoSchema, type EchoInput, type EchoResponse } from '../types/shared';

type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
};

export async function exampleRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: EchoInput; Reply: EchoResponse | ErrorResponse }>(
    '/example/echo',
    {
      schema: { 
        body: {
          type: 'object',
          properties: {
            message: { type: 'string', minLength: 1, maxLength: 1000 }
          },
          required: ['message'],
          additionalProperties: false
        }
      },
    },
    async (request, reply) => {
      // Manual validation with Zod for extra security
      const result = EchoSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: result.error.errors
        });
      }
      
      const { message } = result.data;
      // Sanitize input to prevent XSS
      const sanitized = message.replace(/[<>]/g, '');
      return { echoed: sanitized };
    },
  );
}
