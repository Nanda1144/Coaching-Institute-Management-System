# Merge Plan: faculty-dashboard + ECE tasks (CIMS)

## Overview

| Aspect | faculty-dashboard (Current / Main) | ECE tasks (Incoming) |
|--------|-----------------------------------|---------------------|
| **Focus** | Faculty-specific features (Attendance, Timetable, Faculty CRUD) | Full CIMS system (Auth, Role-based Dashboards, User Mgmt, Reports, Settings) |
| **Frontend** | React 19 + Vite 8 + TailwindCSS v4 + React Router v7 | Same stack + Zustand + Zod v4 + Husky/Prettier/ESLint |
| **Backend** | Express + Prisma 6 (PostgreSQL only) | Express + Mongoose (MongoDB) + Prisma 7 (PostgreSQL) — dual DB |
| **Auth** | JWT + bcrypt, roles: SUPER_ADMIN, ADMIN, HOD, FACULTY, STUDENT, PARENT | JWT + bcrypt + OTP, roles: Student, Parent, Faculty, CollegeManagement, Admin |
| **Status** | Working (Prisma 6 downgraded, SKIP_AUTH=true) | Has MongoDB models, Prisma 7 schema, needs migration |

---

## 1. Files That Will Conflict

### Direct name/path conflicts — MUST be manually resolved:

| File | faculty-dashboard | ECE tasks | Resolution |
|------|-------------------|-----------|------------|
| `package.json` (root) | Frontend deps (faculty-specific) | Same frontend deps | Merge — keep all deps from both, dedupe versions |
| `tsconfig.json` (root) | No path aliases | Has `@/*` path alias | **Adopt** ECE's path alias config (add `baseUrl` and `paths`) |
| `vite.config.ts` | Has API proxy, no `@` alias | Has `@` alias, no proxy | **Combine** — keep proxy from faculty, alias from ECE |
| `backend/package.json` | Prisma 6, express 4.21, zod 3.23 | Prisma 7, express 4.19, zod 3.23, mongoose 8.5, winston, nodemailer | **Merge carefully** — express downgrade ok, keep Prisma 6, add mongoose/winston/nodemailer |
| `backend/.env` | Supabase DATABASE_URL, SKIP_AUTH=true | Local DATABASE_URL | **Combine** — add ECE vars, keep faculty's Supabase URL |
| `.env` (root) | VITE_USE_MOCK, VITE_API_BASE_URL for localhost:5000 | VITE_API_BASE_URL, VITE_APP_NAME, VITE_APP_VERSION | **Merge** — keep all vars |
| `backend/tsconfig.json` | Different backend tsconfig | Different backend tsconfig | **Choose faculty's** (more complete paths/outDir setup) |
| `src/main.tsx` | Simple bootstrap | Simple bootstrap + `@/styles/index.css` import | **Merge** — add ECE import path if needed |
| `src/index.css` | Tailwind directives | (in `src/styles/index.css` in ECE) | **Keep faculty's**, ignore ECE's different path |
| `src/contexts/ToastContext.tsx` | ToastContext (faculty) | Toast component in `src/components/ui/Toast.tsx` (ECE) | **Duplicate component** — choose one pattern |

### Backend conflict — DIFFERENT logic, same file purpose:

| File | faculty-dashboard | ECE tasks | Resolution |
|------|-------------------|-----------|------------|
| `backend/src/app.ts` | Full Express setup with 14 modules | Clean Express setup with 8 modules | **Merge manually** — keep faculty's routing, add ECE's compression/logger |
| `backend/src/server.ts` | DB connect + health check | DB connect + Prisma connect + session sweep | **Merge** — add ECE's session sweep + graceful shutdown |
| `backend/src/config/database.ts` | Prisma singleton with retry | Mongoose connection (MongoDB) | **Keep both** — name faculty's as `prismaDatabase`, ECE's as `mongoDatabase` |
| `backend/src/config/env.ts` | Typed env with all module vars | Typed env with SMTP, Mongo vars | **Merge into one** — combine all vars |
| `backend/prisma/schema.prisma` | 33 models (faculty-centered) | 12 models (auth/org-centered) | **Must merge schemas** — 5 overlapping models (User, Session, etc.) |
| `backend/src/routes/auth.routes.ts` | 5 endpoints (login/register/refresh/logout/me) | 7+ endpoints (includes forgot/reset/OTP) | **Merge** — add ECE's forgot/reset/OTP to faculty's auth |
| `backend/src/middlewares/auth.middleware.ts` | JWT + SKIP_AUTH bypass + DB lookup via Prisma | JWT + Mongoose UserModel lookup | **Keep faculty's** (uses Prisma, SKIP_AUTH dev bypass) |
| `src/components/Sidebar.tsx` | Faculty nav (11 items) | Different sidebar in `components/layout/Sidebar.tsx` (ECE) | **Keep faculty's** — ECE has its own layout system |
| `src/App.tsx` | React Router with 28 routes | Just `<Providers />` (routes in `routes/AppRoutes.tsx`) | **Keep faculty's** — different routing architecture |

---

## 2. Files That Are Safe to Merge

**No name conflicts, different directories, or obviously additive:**

| File | Destination | Notes |
|------|------------|-------|
| ECE: `frontend/src/hooks/useBreakpoint.ts` | `src/hooks/` | New responsive hook |
| ECE: `frontend/src/lib/query-client.ts` | `src/lib/` | React Query client config |
| ECE: `frontend/src/lib/providers.tsx` | `src/lib/` | Provider composition pattern |
| ECE: `frontend/src/store/index.ts` | `src/store/` | Zustand theme store |
| ECE: `frontend/src/features/auth/store/index.ts` | `src/features/auth/store/` | Auth state management (Zustand) |
| ECE: `frontend/src/features/auth/pages/*` | `src/features/auth/pages/` | Auth pages (Login, Register, ForgotPassword, ResetPassword) |
| ECE: `frontend/src/features/auth/components/*` | `src/features/auth/components/` | Auth form components |
| ECE: `frontend/src/features/auth/validations/*` | `src/features/auth/validations/` | Zod schemas for auth |
| ECE: `frontend/src/features/auth/hooks/*` | `src/features/auth/hooks/` | Auth mutation hooks |
| ECE: `frontend/src/features/auth/api/*` | `src/features/auth/api/` | Auth API calls |
| ECE: `frontend/src/features/auth/constants/*` | `src/features/auth/constants/` | Auth constants |
| ECE: `frontend/src/features/auth/types/*` | `src/features/auth/types/` | Auth type definitions |
| ECE: `frontend/src/features/auth/utils/*` | `src/features/auth/utils/` | Auth utilities |
| ECE: `frontend/src/features/dashboard/*` | `src/features/dashboard/` | New dashboard module (Profile, Settings pages) |
| ECE: `frontend/src/features/admin/*` | `src/features/admin/` | New admin module |
| ECE: `frontend/src/features/reports/*` | `src/features/reports/` | New reports module |
| ECE: `frontend/src/features/settings/*` | `src/features/settings/` | New settings module |
| ECE: `frontend/src/features/cims/*` | `src/features/cims/` | CIMS role-based dashboard pages |
| ECE: `frontend/src/features/user-management/*` | `src/features/user-management/` | New user management module |
| ECE: `frontend/src/components/ui/*` | `src/components/ui/` | UI component library (Button, Card, Modal, Table, Input, Badge, etc.) |
| ECE: `frontend/src/components/common/*` | `src/components/common/` | Common components (Header, ErrorBoundary, PageLoader, etc.) |
| ECE: `frontend/src/components/layout/*` | `src/components/layout/` | Layout components (Breadcrumb, Footer, etc.) |
| ECE: `frontend/src/layouts/*` | `src/layouts/` | New layout wrappers (AuthLayout, DashboardLayout, CimsLayout) |
| ECE: `frontend/src/routes/guards/*` | `src/routes/guards/` | Route guards (ProtectedRoute, PublicRoute, RoleBasedRoute) |
| ECE: `frontend/src/routes/route-constants.ts` | `src/routes/` | Route constants |
| ECE: `frontend/src/config/*` | `src/config/` | Config files |
| ECE: `frontend/src/validations/*` | `src/validations/` | Shared validations |
| ECE: `frontend/src/constants/index.ts` | `src/constants/` | API endpoints, storage keys |
| ECE: `frontend/src/types/*` | `src/types/` | Shared types |
| ECE: `frontend/src/utils/*` | `src/utils/` | Utility functions (cn.ts) |
| ECE: `frontend/src/api/client.ts` | `src/api/` | Axios client (different from faculty's `src/services/api.ts`) |
| ECE: `frontend/src/pages/*` (demos) | `src/pages/` | Dev demo pages (InputDemo, CardDemo, etc.) |
| ECE: `backend/src/routes/settings.routes.ts` | `backend/src/routes/` | New settings module |
| ECE: `backend/src/routes/reports.routes.ts` | `backend/src/routes/` | New reports module |
| ECE: `backend/src/routes/session.routes.ts` | `backend/src/routes/` | New session management |
| ECE: `backend/src/routes/cims.routes.ts` | `backend/src/routes/` | CIMS role-based stats endpoints |
| ECE: `backend/src/services/settings.service.ts` | `backend/src/services/` | Settings service |
| ECE: `backend/src/services/reports.service.ts` | `backend/src/services/` | Reports service |
| ECE: `backend/src/services/session.service.ts` | `backend/src/services/` | Session management service (Mongoose) |
| ECE: `backend/src/services/cims.service.ts` | `backend/src/services/` | CIMS stats service |
| ECE: `backend/src/models/*` | `backend/src/models/` | Mongoose models (User, Session, Item) |
| ECE: `backend/src/utils/mailer.ts` | `backend/src/utils/` | Email service (nodemailer) |
| ECE: `backend/src/config/logger.ts` | `backend/src/config/` | Winston logger |
| ECE: `backend/prisma.config.ts` | `backend/` | Prisma config for v7 (faculty uses Prisma 6, may need this) |
| ECE: `frontend/.husky/*` | `.husky/` | Git hooks |
| ECE: `frontend/.prettierrc` | `.prettierrc` | Code formatting config |
| ECE: `frontend/.prettierignore` | `.prettierignore` | Prettier ignore |
| ECE: `frontend/eslint.config.js` | `eslint.config.js` | ESLint flat config |
| ECE: `frontend/.oxlintrc.json` | `.oxlintrc.json` | Oxlint config |
| ECE: `frontend/tailwind.config.ts` | `tailwind.config.ts` | Tailwind config (if needed, v4 is different) |
| ECE: `frontend/src/styles/index.css` | `src/styles/` | CSS entry point (if using ECE's import path) |

---

## 3. Duplicate Components

| Component | faculty-dashboard | ECE tasks | Action |
|-----------|-------------------|-----------|--------|
| `Toast` | `src/components/Toast.tsx` (Animated, auto-dismiss) | `src/components/ui/Toast.tsx` (Different implementation) | **Keep faculty's** — it's already integrated with ToastContext |
| `ErrorBoundary` | `src/components/ErrorBoundary.tsx` | `src/components/common/ErrorBoundary.tsx` | **Keep both** — same concept, different implementations |
| `Sidebar` | `src/components/Sidebar.tsx` (Faculty nav) | `src/components/layout/Sidebar.tsx` (Different nav structure) | **Keep both** — different layouts serve different routes |
| `Navbar` | `src/components/Navbar.tsx` | `src/components/layout/Navbar.tsx` | **Keep both** — different designs |
| `EmptyState` | `src/components/EmptyState.tsx` | `src/components/ui/EmptyState.tsx` | **Keep faculty's** — it's what existing code imports |
| `LoadingSpinner` / `Loader` | `src/components/LoadingSpinner.tsx` | `src/components/ui/Loader.tsx` | **Keep both** — different names, different usage patterns |
| `Card` / `DashboardCard` | `src/components/DashboardCard.tsx` | `src/components/ui/Card.tsx` | **Keep both** — faculty is dashboard-specific, ECE is generic |
| `QuickActions` | `src/components/QuickActions.tsx` | `src/features/cims/components/QuickActions.tsx` | **Keep both** — different context (faculty vs cims) |
| Error/Status pages | `src/components/ErrorMessage.tsx`, `FallbackUI.tsx` | `src/pages/NotFoundPage.tsx`, `ServerErrorPage.tsx`, `UnauthorizedPage.tsx` | **Keep both** — faculty has inline components, ECE has full pages |

---

## 4. Duplicate Routes

### Frontend Routes:

| Path | faculty-dashboard | ECE tasks | Conflict |
|------|-------------------|-----------|----------|
| `/` | Dashboard (eager) | Redirect to /dashboard | **Minor** — ECE uses `/` as redirect, faculty shows dashboard |
| `/dashboard` | N/A | DashboardPage | **Add ECE route** |
| `/login` | N/A | LoginPage | **Add ECE route** (faculty has no login) |
| `/register` | N/A | RegisterPage | **Add ECE route** |
| `/faculty/*` | 7 faculty routes | N/A | **No conflict** |
| `/attendance/*` | 9 attendance routes | N/A | **No conflict** |
| `/timetable/*` | 5 timetable routes | N/A | **No conflict** |
| `/users` | N/A | UserListPage | **Add ECE route** |
| `/admin` | N/A | AdminPage | **Add ECE route** |
| `/reports` | N/A | ReportsPage | **Add ECE route** |
| `/cims/*` | N/A | 4 CIMS dashboards | **Add ECE routes** |
| `/dev/*` | N/A | 7 dev demo pages | **Add ECE routes** (dev only) |

### Overall assessment: **Zero route conflicts** — the two sets of routes are completely disjoint.

---

## 5. Duplicate APIs

### Backend API Endpoints:

| Endpoint Group | faculty-dashboard | ECE tasks | Conflict? |
|----------------|-------------------|-----------|-----------|
| `POST /api/auth/login` | Yes | Yes (more fields) | **Direct conflict** — different implementations, **must merge logic** |
| `POST /api/auth/register` | Yes | Yes (more fields) | **Direct conflict** — different data models |
| `POST /api/auth/logout` | Yes | Yes | **Same** — minor impl diff |
| `GET /api/auth/me` | Yes (profile) | Yes (profile) | **Same** |
| `POST /api/auth/refresh-token` | Yes | No (handled differently) | **No conflict** |
| `POST /api/auth/forgot-password` | No | Yes | **Add ECE** |
| `POST /api/auth/verify-otp` | No | Yes | **Add ECE** |
| `POST /api/auth/reset-password` | No | Yes | **Add ECE** |
| `GET /api/dashboard/*` | 3 endpoints | 2 endpoints | **Some overlap** — different data shapes |
| `GET /api/health` | Yes | Yes | **Same purpose** — merge into one |
| `GET/POST/DELETE /api/users/*` | No | Yes (CRUD) | **Add ECE** |
| `GET/PATCH /api/settings/*` | No | Yes | **Add ECE** |
| `GET/POST /api/reports/*` | No | Yes | **Add ECE** |
| `GET/DELETE /api/auth/sessions/*` | No | Yes | **Add ECE** |
| `GET /api/admin/*` | No | Yes | **Add ECE** |
| `GET /api/cims/*` | No | Yes | **Add ECE** |

### Conflicting endpoints: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/health`, `GET /api/dashboard/*`

---

## 6. Duplicate Prisma Models

### Overlapping models between faculty-dashboard (33 models) and ECE (12 models):

| Model Name | faculty-dashboard Fields | ECE Fields | Action |
|-----------|------------------------|------------|--------|
| **User** | Not a model (Faculty model used instead) | `id, fullName, username, email, mobileNumber, password, role, isVerified, refreshTokens[], otp, otpExpiresAt, otpVerified, status, avatar, createdAt, updatedAt` | **Merge into Faculty or create User** — faculty uses Faculty model for users |
| **Faculty** | 30+ fields (full profile) | Not in ECE schema | **Keep faculty's** — no conflict |
| **Department** | `id, name, code, createdAt, updatedAt` | `id, name, code, description, createdAt, updatedAt` (has courses relation) | **Merge** — add `description` field, add `Course` relation |
| **Course** | Not in faculty schema (in API routes) | `id, code, name, description, credits, departmentId, semester` | **Add to schema** from ECE |
| **Session** | Not in faculty schema | `id, userId, refreshTokenHash, ip, device, loginTime, lastActivity, expiresAt, isActive` | **Add to schema** from ECE (for auth) |
| **Notification** | Not in faculty schema | `id, userId, title, message, type, read, link, createdAt` | **Add to schema** from ECE |

### Models with NO overlap (safe to add from ECE):
- `PasswordReset` (ECE)
- `AppSettings` (ECE)
- `Enrollment` (ECE)
- `Activity` (ECE)
- `SystemConfig` (ECE)
- `Report` (ECE)
- `LoginHistory` (ECE)

### Models unique to faculty-dashboard (33 total, all safe):
Subject, Batch, Classroom, Faculty, Student, Attendance, Timetable, FacultyTransfer, AssignmentLog, Holiday, FaceRecognition, FingerprintAttendance, QRSession, QRScan, AttendanceCorrection, Assignment, AssignmentAttachment, Homework, HomeworkAttachment, AssignmentSubmission, SubmissionAttachment, Evaluation, Chapter, StudyMaterial, MaterialCategory, MaterialAttachment, MaterialDownload, MaterialSearchLog, AssignmentReminder, Upload, Department, Course, Semester

### **Resolution**: Merge both schema.prisma files with renaming of any overlapping model (User vs Faculty). ECE's User model represents auth accounts, faculty's Faculty represents staff profiles. They may be different entities.

---

## 7. Duplicate Environment Variables

### Overlapping Env Vars:

| Variable | faculty-dashboard | ECE tasks | Conflict? |
|----------|-------------------|-----------|-----------|
| `PORT` | 5000 (in code) | 5000 (in code) | **Same** — no conflict |
| `DATABASE_URL` | Supabase PostgreSQL | local PostgreSQL | **Different values** — keep both, use one at a time |
| `JWT_SECRET` | `@cCnanda141144111918815195` | (from env) | **Different** — use faculty's for consistency |
| `JWT_EXPIRES_IN` | `24h` | `15m` | **Different** — use faculty's (longer session) |
| `JWT_REFRESH_SECRET` | `@cCnandakishore141144111918815195` | (from env) | **Different** — use faculty's |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | `7d` | **Different** — use faculty's |
| `CORS_ORIGIN` | `http://localhost:5173` | `http://localhost:3000` (in code) | **Different** — use faculty's |
| `BCRYPT_SALT_ROUNDS` | `12` | Not set | **Add from faculty** |
| `SKIP_AUTH` | `true` | Not set | **Keep from faculty** (dev bypass) |
| `NODE_ENV` | `development` | `development` | **Same** |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | `http://localhost:5000/api` | **Same** |
| `VITE_USE_MOCK` | `true` | Not set | **Keep from faculty** |

### ECE-only vars to add:
| Variable | Value |
|----------|-------|
| `MONGO_URI` | Required by ECE (MongoDB connection) |
| `SMTP_HOST` | Email config (if needed) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | (to be set) |
| `SMTP_PASS` | (to be set) |
| `SMTP_FROM` | `No-Reply <no-reply@yourapp.com>` |
| `LOG_LEVEL` | `info` |
| `VITE_APP_NAME` | `sprint1` |
| `VITE_APP_VERSION` | `1.0.0` |
| `API_PREFIX` | `/api` |

---

## 8. Required Package Installations

### Packages from ECE NOT in faculty-dashboard:

**Frontend:**
```bash
npm install zustand@^5.0.14 @hookform/resolvers@^5.4.0
npm install --save-dev husky@^9.1.7 lint-staged@^17.0.8 prettier@^3.9.5 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 oxlint@^1.71.0
```

**Backend:**
```bash
cd backend
npm install mongoose@^8.5.1 winston@^3.13.1 nodemailer@^6.10.1 compression@^1.7.4 express-validator@^7.1.0
npm install --save-dev @types/compression@^1.7.5 @types/nodemailer@^6.4.24
```

### Packages in faculty-dashboard NOT in ECE:
Already installed: `framer-motion`, `recharts`, `xlsx`, `react-hook-form`, `react-icons` — all present in faculty-dashboard.

### Version conflicts to resolve:

| Package | faculty-dashboard | ECE tasks | Resolution |
|---------|-------------------|-----------|------------|
| `@prisma/client` | `^6.5.0` | `^7.8.0` | **Keep 6.5.0** (downgraded for compatibility) |
| `prisma` | `^6.5.0` | `^7.8.0` | **Keep 6.5.0** |
| `express` | `^4.21.0` | `^4.19.2` | **Keep 4.21.0** |
| `zod` | `^3.23.8` | `^3.23.8` + `^4.4.3` (frontend) | **Keep faculty's 3.23.8** (backend), **frontend uses ECE's zod v4?** — different versions, may conflict |
| `typescript` | `~6.0.2` (frontend), `^5.6.2` (backend) | `~6.0.2` (frontend), `^5.5.3` (backend) | **Align** — use `~6.0.2` frontend, `^5.6.2` backend |
| `jsonwebtoken` | `^9.0.2` | `^9.0.3` | **Keep 9.0.2** |
| `@types/node` | `^22.5.5` | `^24.13.2` (frontend), `^20.14.10` (backend) | **Keep higher** — use 22.5.5 for backend |

---

## 9. Migration Order

| Step | Module | Description | Dependency |
|------|--------|-------------|------------|
| 1 | **Config & Dependencies** | Merge package.json files, install new deps, merge tsconfig, vite.config | None |
| 2 | **Backend: Config** | Merge `config/env.ts`, `config/database.ts`, `config/index.ts`, `config/logger.ts` | Step 1 |
| 3 | **Backend: Mongoose Models** | Add `models/user.model.ts`, `models/session.model.ts` from ECE | Step 2 |
| 4 | **Backend: Prisma Schema Merge** | Merge ECE's Prisma models into faculty's schema, run `prisma generate` | Step 2 |
| 5 | **Backend: Auth Enhancement** | Merge auth routes (add forgot/reset/OTP), merge auth service | Step 3, 4 |
| 6 | **Backend: New Modules** | Add settings, reports, session, cims, admin, user modules | Step 4 |
| 7 | **Backend: Auth Middleware Merge** | Combine ECE's authenticate/authorize into faculty's auth middleware | Step 5 |
| 8 | **Backend: Server Entry** | Merge `server.ts`, `app.ts` — add compression, winston logger, session sweep | Step 2-7 |
| 9 | **Frontend: Config & Utils** | Add `@` alias, `src/config/`, `src/utils/cn.ts`, `src/types/`, `src/constants/` | Step 1 |
| 10 | **Frontend: Zustand Stores** | Add `src/store/` (theme), `src/features/auth/store/` (auth) | Step 9 |
| 11 | **Frontend: UI Library** | Add `src/components/ui/*` (Button, Card, Modal, Input, Table, etc.) | Step 9 |
| 12 | **Frontend: Common Components** | Add `src/components/common/*`, `src/components/layout/*` | Step 11 |
| 13 | **Frontend: Layouts** | Add `src/layouts/AuthLayout`, `DashboardLayout`, `CimsLayout` | Step 12 |
| 14 | **Frontend: Route Guards** | Add `src/routes/guards/*` (ProtectedRoute, PublicRoute, RoleBasedRoute) | Step 10 |
| 15 | **Frontend: Auth Module** | Add auth pages, components, hooks, API, validations, types | Step 13, 14 |
| 16 | **Frontend: Dashboard Module** | Add Profile, Settings pages | Step 14 |
| 17 | **Frontend: CIMS Module** | Add CIMS role-based dashboards | Step 14 |
| 18 | **Frontend: Admin/User/Reports** | Add admin, user management, reports pages | Step 14 |
| 19 | **Frontend: Route Integration** | Register all new routes in `src/App.tsx`, integrate with existing routes | Step 15-18 |
| 20 | **Build & Verify** | Run build, lint, tests on both frontend and backend | Step 19 |

---

## 10. Testing Order

| Step | Module | Test Type | Verification |
|------|--------|-----------|--------------|
| 1 | **Config & Dependencies** | Build | `npm run build` (frontend), `tsc --noEmit` (backend) |
| 2 | **Backend Config** | Unit | Backend starts without errors: `npm run dev` |
| 3 | **Mongoose Models** | Compile | TypeScript compilation passes |
| 4 | **Prisma Schema** | Database | `npx prisma generate` succeeds |
| 5 | **Auth Enhancement** | Integration | POST /api/auth/login works, POST /api/auth/register works, forgot/reset flow |
| 6 | **New Backend Modules** | Integration | GET /api/settings, GET /api/reports, GET /api/admin/metrics return correct data |
| 7 | **Server Entry** | E2E | Server starts, health endpoint returns 200, graceful shutdown works |
| 8 | **Frontend Config** | Build | `npm run build` succeeds with `@` alias |
| 9 | **Zustand Stores** | Unit | Theme toggle persists, auth store login/logout cycle works |
| 10 | **UI Library** | Visual | Components render correctly (Button, Card, Modal, Toast demos) |
| 11 | **Layouts** | Visual | AuthLayout renders login page, DashboardLayout renders sidebar |
| 12 | **Route Guards** | Integration | Authenticated routes redirect to login, role guards block unauthorized |
| 13 | **Auth Pages** | E2E | Login flow: fill form -> API call -> redirect to dashboard |
| 14 | **Dashboard Module** | E2E | Profile page loads, settings update works |
| 15 | **CIMS Module** | E2E | Admin dashboard loads, student dashboard loads, role-based access works |
| 16 | **Admin Module** | E2E | User list loads, admin only accessible by admin role |
| 17 | **Full Route Integration** | E2E | All 28 faculty routes + all new ECE routes work without 404 |
| 18 | **Full Build & Lint** | CI | `npm run build`, `npm run lint`, backend `tsc --noEmit` all pass |

---

## 11. Rollback Strategy

### Git-Based Rollback:

```bash
# Before any merge step:
git checkout -b merge-ece-tasks
git tag pre-merge-v1

# After each successful module merge:
git add .
git commit -m "merge: ECE Module X — Auth enhancement"
git tag merge-module-X

# Rollback to pre-merge state:
git checkout pre-merge-v1
git branch -D merge-ece-tasks  # only after confirming rollback works
```

### Per-Module Rollback:

| Scenario | Rollback Action |
|----------|----------------|
| **Config merge breaks build** | `git checkout -- package.json tsconfig.json vite.config.ts .env` for frontend, same for backend |
| **Prisma schema merge fails** | `git checkout -- backend/prisma/schema.prisma`, re-run `npx prisma generate` |
| **Auth merge breaks login** | `git checkout -- backend/src/routes/auth.routes.ts backend/src/services/auth.service.ts backend/src/middlewares/auth.middleware.ts` |
| **Frontend build fails** | `git checkout -- src/App.tsx src/main.tsx`, remove new directories |
| **New module causes runtime error** | Roll back that module's route registration, unregister from app.ts / App.tsx |

### Database Rollback:

Since neither codebase has a `prisma/migrations` folder yet:
```bash
# Before changing schema, dump current:
npx prisma db pull  # sync schema from DB if connected
npx prisma migrate dev --name pre-merge-snapshot --create-only

# If merge fails:
npx prisma migrate reset  # if local DB
# Or manually restore from backup
```

### Key Safety Rules:
1. Tag before every merge step (`git tag pre-merge-<module-name>`)
2. Test frontend AND backend builds after EVERY module
3. Keep ALL original files until merge is fully verified
4. Never delete a file in the first pass — only add new files and modify as needed
5. If a step fails, rollback that step only, not the entire merge

---

## 12. Files Requiring Manual Review

### HIGH priority (must be manually reviewed/merged — significant logic differences):

| # | File | Reason |
|---|------|--------|
| 1 | `backend/src/middlewares/auth.middleware.ts` | faculty uses Prisma + SKIP_AUTH; ECE uses Mongoose. Must merge into one that checks DB (Prisma) + supports SKIP_AUTH. |
| 2 | `backend/src/routes/auth.routes.ts` | faculty: 5 endpoints; ECE: 7+ endpoints (OTP, forgot/reset). Must integrate ECE's endpoints into faculty's structure. |
| 3 | `backend/src/services/auth.service.ts` | faculty uses Prisma Faculty model; ECE uses Mongoose User model + sessions. Different data models + flow. |
| 4 | `backend/prisma/schema.prisma` | faculty: 33 models; ECE: 12 models. 5+ overlapping models. Must merge while handling User vs Faculty duality. |
| 5 | `backend/src/app.ts` | faculty: 14 module routes + helmet/cors/rate-limit; ECE: 8 module routes + compression/logger. Must combine cleanly. |
| 6 | `backend/src/server.ts` | faculty: simple Prisma connect; ECE: dual DB connect + session sweep + graceful shutdown + Winster. |
| 7 | `backend/src/config/env.ts` | faculty: Supabase-specific vars; ECE: MongoDB + SMTP vars. Must merge into unified config. |
| 8 | `backend/src/config/database.ts` | faculty: Prisma singleton with retry; ECE: Mongoose connection. Two different DBs — keep both, separate files. |
| 9 | `src/App.tsx` (frontend) | faculty: 28 routes inline; ECE: separate routing architecture with guards/layouts. Must integrate ECE's routes WITHOUT breaking faculty's existing routes. |
| 10 | `src/services/api.ts` vs `src/api/client.ts` | faculty: Axios with dedup, mock fallback, auto-refresh; ECE: simpler Axios. Two different clients serving same purpose. Must unify. |

### MEDIUM priority (logic differences, but more straightforward):

| # | File | Reason |
|---|------|--------|
| 11 | `backend/src/routes/dashboard.routes.ts` | Different endpoints — faculty: admin/faculty/recent-activities; ECE: stats/activity. Merge into one. |
| 12 | `backend/src/routes/user.routes.ts` (ECE) vs faculty's faculty routes | ECE has generic user CRUD. faculty has faculty-specific CRUD. May be overlap in purpose. |
| 13 | `backend/src/services/user.service.ts` (ECE) | Uses Prisma. Must verify it works with faculty's Prisma 6 setup. |
| 14 | `backend/src/services/dashboard.service.ts` (ECE) | Uses Prisma. Should integrate with faculty's dashboard service. |
| 15 | `frontend/src/features/auth/hooks/index.ts` | ECE's auth hooks use Zustand store. faculty has no auth hooks. These are new additions. |
| 16 | `frontend/src/routes/guards/*` | ECE's route guards (ProtectedRoute, RoleBasedRoute). Must integrate with faculty's route system. |
| 17 | `frontend/src/layouts/*` | ECE's layout system (AuthLayout, DashboardLayout, CimsLayout). Different from faculty's current layout. |
| 18 | `package.json` (both frontend/backend) | Version conflicts for shared deps (zod, typescript, express, prisma). Must resolve carefully. |
| 19 | `vite.config.ts` | Must combine API proxy (faculty) with `@` alias (ECE). |
| 20 | `tsconfig.json` | ECE uses path aliases, strict mode, `noUncheckedIndexedAccess`. faculty does not. Adding strict mode may break existing code. |

### LOW priority (pure additions, no conflicts):

| # | File | Reason |
|---|------|--------|
| 21-30 | All ECE `features/*/pages/*` | New page components. Pure additions. |
| 31-40 | All ECE `components/ui/*` | New UI components. Pure additions. |
| 41-45 | All ECE `backend/src/models/*` (Mongoose) | New Mongoose models. No overlap with faculty (faculty uses Prisma). |
| 46-50 | All ECE `backend/src/utils/mailer.ts`, `config/logger.ts` | New utilities. No conflicts. |
| 51-55 | All ECE `frontend/src/pages/*` demos | Dev demo pages. No conflicts. |
| 56-60 | All ECE `.husky/*`, `.prettierrc`, `.eslintrc` | Config files. Pure additions. |

---

## Merge Execution Strategy (Recommended Order)

```
Phase 1: Foundation (Steps 1-2)
  ├── Merge package.json, tsconfig, vite.config
  ├── Install new deps (zustand, mongoose, winston, nodemailer, compression)
  └── Verify build passes

Phase 2: Backend Core (Steps 3-8)
  ├── Add Mongoose models + logger + mailer
  ├── Merge Prisma schema
  ├── Merge env config
  ├── Add new backend modules (settings, reports, session, cims, admin, user)
  ├── Merge auth enhancement
  ├── Merge app.ts + server.ts
  └── Verify backend starts

Phase 3: Frontend Core (Steps 9-14)
  ├── Add config, utils, types, constants
  ├── Add Zustand stores
  ├── Add UI library components
  ├── Add layouts
  ├── Add route guards
  └── Verify frontend builds

Phase 4: Frontend Features (Steps 15-18)
  ├── Add auth module (pages, forms, hooks, API)
  ├── Add dashboard module (profile, settings)
  ├── Add CIMS module (role-based dashboards)
  ├── Add admin/user/reports modules
  └── Verify each module independently

Phase 5: Integration (Steps 19-20)
  ├── Register all routes in App.tsx
  ├── Run full build
  ├── Run full lint
  ├── Test all 28 faculty routes + all new routes
  ├── Verify backend API endpoints
  ├── Verify CRUD operations on all modules
  └── Verify database connectivity
```

---

## Pre-Merge Checks (Run Before Starting)

```bash
# 1. Ensure clean git state
cd C:\nanda\ramp msme\coaching-instiution-management-system\Mytasks\faculty-dashboard
git status  # should be clean

# 2. Tag pre-merge state
git tag pre-merge-v1

# 3. Create merge branch
git checkout -b merge-ece-tasks

# 4. Verify current builds work
cd backend && npx tsc --noEmit
cd .. && npm run build

# 5. Record dependency snapshots
npm list --depth=0 > pre-merge-frontend-deps.txt
cd backend && npm list --depth=0 > pre-merge-backend-deps.txt
```
