import request from 'supertest';
import { buildServer } from './index';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

it('GET /health returns ok', async () => {
  const res = await request(app.server).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
  expect(res.body.uptime).toBeTypeOf('number');
});

it('POST /example/echo validates and echoes', async () => {
  const res = await request(app.server)
    .post('/example/echo')
    .send({ message: 'hello world' })
    .set('Content-Type', 'application/json');
  expect(res.status).toBe(200);
  expect(res.body.echoed).toBe('hello world');
});

it('POST /example/echo 400 on invalid body', async () => {
  const res = await request(app.server)
    .post('/example/echo')
    .send({ message: '' })
    .set('Content-Type', 'application/json');
  expect(res.status).toBeGreaterThanOrEqual(400);
});
