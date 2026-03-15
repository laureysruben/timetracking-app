# Time Tracking App

Team time tracking with domains, projects, tasks, and basic reporting. Built with **Angular 21** (frontend) and **NestJS** (backend) using **Prisma** and **PostgreSQL**.

## Structure

- **`backend/`** – NestJS API (auth, domains, projects, tasks, time entries, reports)
- **`frontend/`** – Angular 21 SPA (track, projects, domains, reports)

## Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)
- npm

## Backend setup

1. **Install dependencies**

   ```bash
   cd backend && npm install
   ```

2. **Configure environment**

   Create or edit `backend/.env`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"
   JWT_SECRET="your-secret-key"
   ```

   Replace `USER`, `PASSWORD`, and `DATABASE` with your PostgreSQL credentials.

3. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

4. **Run migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

   (Requires a running PostgreSQL instance.)

5. **Seed an admin user (optional)**

   Create a user via Prisma Studio or a one-off script, and hash the password with bcrypt (e.g. role `ADMIN`).

6. **Start the API**

   ```bash
   npm run start:dev
   ```

   API runs at **http://localhost:3000**. CORS is enabled for the frontend.

## Frontend setup

1. **Install dependencies**

   ```bash
   cd frontend && npm install
   ```

2. **Configure API URL**

   Edit `frontend/src/environments/environment.ts` if your API is not at `http://localhost:3000`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000',
   };
   ```

3. **Serve the app**

   ```bash
   npm start
   ```

   App is at **http://localhost:4200**.

## Scripts

| Location   | Command           | Description              |
|-----------|-------------------|--------------------------|
| Backend   | `npm run start:dev` | API with watch           |
| Backend   | `npm run build`     | Build API                |
| Backend   | `npm test`          | Unit tests               |
| Frontend  | `npm start`         | Dev server               |
| Frontend  | `npm run build`     | Production build         |

## API overview

- **Auth:** `POST /auth/login` (body: `email`, `password`) → `{ accessToken, user }`
- **Domains:** `GET/POST/PATCH/DELETE /domains` (write: admin only)
- **Projects:** `GET/POST/PATCH/DELETE /projects`, `GET/POST /projects/:id/tasks`
- **Tasks:** `GET/PATCH/DELETE /tasks/:id`
- **Time entries:** `GET/POST/PATCH/DELETE /time-entries` (query: `from`, `to`, `projectId`, `domainId`, `userId` for admins)
- **Reports:** `GET /reports/users`, `GET /reports/projects`, `GET /reports/domains` (query: `from`, `to`, `domainId`, `projectId`)

All routes except `POST /auth/login` require the `Authorization: Bearer <accessToken>` header.

## Roles

- **ADMIN** – Full access: domains CRUD, users list/update, all time entries and reports.
- **MEMBER** – Track time, manage projects/tasks, view own entries and reports; domains and user list are restricted.
