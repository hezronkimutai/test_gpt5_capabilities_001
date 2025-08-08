# test_gpt5_capabilities_001

One-command dev for client and server, strict TS, lint/format, tests, Docker, CI.

## Quickstart

- Prereqs: Node 20+, pnpm 9
- Install deps:

```bash
pnpm install --filter ./client --filter ./server
```

- Dev (both apps):
```bash
pnpm dev
```
- Server only:
```bash
pnpm --filter server dev
```
- Client only:
```bash
pnpm --filter client dev
```

Server: Fastify + Zod, endpoints:
- GET /health -> { status: 'ok', uptime }
- POST /example/echo { message } -> { echoed }

Client: Vite + React + TS, shows API health and example call via shared types.

## Scripts
- dev, build, start, lint, format, test, typecheck across workspaces.

## Environment
See `.env.example`.

## Docker
```bash
docker compose up --build
```

## CI
GitHub Actions: lint, test, build on push/PR to main.

## License
MIT
