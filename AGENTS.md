# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Team Time Tracking Application** with two independent packages:

- **Backend** (`/backend`): NestJS 11 API on port 3000 (auth, domains, projects, tasks, time entries, reports)
- **Frontend** (`/frontend`): Angular 21 SPA on port 4200 (connects to backend at `http://localhost:3000`)
- **Database**: PostgreSQL via Prisma ORM v7 with `@prisma/adapter-pg`

See the root `README.md` for full setup instructions, API overview, and available npm scripts.

### Running services

- **Backend**: `cd backend && npm run start:dev` (watch mode, port 3000)
- **Frontend**: `cd frontend && npm start` (dev server, port 4200)
- **PostgreSQL**: Must be running. The `DATABASE_URL` env var is provided as a secret (Neon hosted). If not set, create `backend/.env` with a local PostgreSQL connection string.

### Environment variables

- `DATABASE_URL` — PostgreSQL connection string (injected as a secret; falls back to `backend/.env`)
- `JWT_SECRET` — JWT signing key (set in `backend/.env`; defaults are fine for local dev)

### Key gotchas

- Prisma v7 uses `@prisma/adapter-pg` (driver adapter). The `PrismaClient` must be constructed with `{ adapter: new PrismaPg({ connectionString: url }) }`. Direct `PrismaClient()` without options will fail.
- After `npm install` in backend, always run `npx prisma generate` to regenerate the Prisma client.
- The `POST /users` endpoint requires ADMIN auth. To create the first admin user, insert directly via Prisma or a Node script (hash password with bcrypt, set role to `ADMIN`).
- Frontend lint (`ng lint`) is not configured; use `npx prettier --check "src/**/*.ts"` for format checking in the frontend.
- Backend lint: `npm run lint` (ESLint). Frontend has no ESLint setup.
- Backend tests: `npm test` (Jest). Frontend tests: `npx ng test` (Vitest via Angular CLI).
- The frontend has one pre-existing test failure in `app.spec.ts` (`should render title`) — the test wasn't updated after the default Angular scaffold was customized.
