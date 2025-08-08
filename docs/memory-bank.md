# Project Memory Bank

A lightweight, versioned place to remember decisions, context, and notes.

- Use the helper scripts in `scripts/` to add and list entries.
- Entries are appended to `docs/memory-bank.md` with a timestamp and author (if provided).

## Usage

Add a note (bash):

```bash
./scripts/memory.sh add "Switched server to Fastify; health and echo routes defined."
```

Add a note (PowerShell):

```powershell
./scripts/memory.ps1 add "Configured CI to run lint, test, build."
```

List recent notes:

```bash
./scripts/memory.sh list 10
```

---

## Log

<!-- New entries will be appended below by the helper scripts -->

### 2025-08-08T05:11:51Z — Hezron Kimutai

- Initialized memory bank; added scripts mem:add/mem:list and docs/memory-bank.md.

### 2025-08-08T05:13:37Z — Hezron Kimutai

- Starting security audit of GPT-5 generated codebase - found major issues

### 2025-08-08T05:56:23Z — Hezron Kimutai

- Continuing security refactor - fixing TS errors and completing server hardening

### 2025-08-08T06:05:55Z — Hezron Kimutai

- Completed major refactor: removed NestJS security issues, cleaned deps, improved validation, added env validation, simplified Fastify setup
