# Agent Context — EduManage Faculty Dashboard

## Architecture
- **Frontend**: React + Vite + TypeScript SPA (root directory)
- **Backend**: Express + PostgreSQL (`backend/` directory, uses `pg` not Prisma at runtime)
- Frontend Axios instance (`src/services/api.ts`) uses `VITE_API_BASE_URL || '/api'` as base URL
- **Local dev**: Vite proxies `/api` → `http://localhost:5000` (see `vite.config.ts:8`)

## Deployment (Single Vercel Project)
Both frontend and backend are deployed together in one Vercel project:

- **Serverless function**: `api/index.ts` — imports Express app from `backend/src/app.ts`
- **Frontend static build**: Vite outputs to `dist/`
- **Build command** (in `vercel.json`): `npm run build`
  - Only builds the frontend with Vite
  - Backend TypeScript is compiled on-the-fly by `@vercel/node` when processing `api/index.ts`
- **Env vars** (set in Vercel dashboard — these are REQUIRED or the app crashes):
  - `DATABASE_URL` — PostgreSQL connection string (Supabase)
  - `JWT_SECRET` — random secret string (do NOT use default values)
  - `JWT_REFRESH_SECRET` — another random secret
  - `CORS_ORIGIN` — the Vercel deployment URL itself (e.g. `https://faculty-dashboard.vercel.app`)
  - `COOKIE_SECRET` — random secret
  - `VITE_API_BASE_URL` — leave empty (defaults to `/api` on same origin)
  - `BREVO_API_KEY` — Brevo (Sendinblue) API key for transactional emails
  - `BREVO_FROM_EMAIL` — verified sender email for Brevo
  - `BREVO_FROM_NAME` — sender display name

### How routing works
- `vercel.json` rewrites `/api/(.*)` → serverless function at `/api` (Express app handles all API routes)
- Everything else → `index.html` (SPA client-side routing)

## Critical Decisions & Fixes

### Mock adapter (disabled in production)
- **`src/services/api.ts`**: Mock only enabled when `VITE_USE_MOCK=true` or `VITE_API_BASE_URL=''`
- **Don't enable mock in production** — real backend is deployed in same project

### SPA routing
- `vercel.json` has rewrite `"/(.*)" → "/index.html"` for client-side routing

### Role-aware navigation
- `QuickActions.tsx` and `QuickTimetableActions.tsx` use `useAuth()` to generate role-prefixed routes

### Sidebar resize
- CSS var `--sidebar-width` on `<html>` element; `.sidebar-resizing` class disables transitions

### Settings localStorage fallback
- `settings.service.ts`: If `/api/settings` fails, reads/writes from `localStorage` key `app_settings`
- This is a **development fallback only** — real settings persist in backend DB

### Logo upload
- Settings → Institute section uploads logo; stored in localStorage
- Not yet backed by backend (no upload endpoint for institute logo)

### Removed features (intentional)
- Reports, Advanced Search, My Schedule, My Timetable removed from admin sidebar
- Theme toggle removed from Navbar

### JWT permissions
- `auth.service.ts`: FACULTY/ADMIN/HOD JWT now includes `ROLE_PERMISSIONS[role]` (all `['*']`)
- `enums/index.ts`: ROLE_PERMISSIONS.STUDENT missing READ_FACULTY, READ_STUDENT; PARENT missing READ_STUDENT

### 502 fixes — Table/column name mismatches
- `dashboard.service.ts`: `attendance` → `attendances`, `notifications` → `notification_broadcasts`, `studentId` → `student` (fee tables). Wrapped unprotected queries in try-catch.
- `student-dashboard.service.ts`: Same fixes for `attendance`, `notifications`, `studentId` → `student`.
- `faculty.service.ts`: `operator: 'is'` → `operator: 'IS NULL'` (unsupported operator bug).
- `student.service.ts`: Added pagination (limit/offset) to prevent timeout on large datasets.

### 403 fixes — Role-based access
- `timetable.routes.ts`: Added FACULTY, STUDENT, PARENT to GET /.
- `settings.routes.ts`: Added STUDENT, PARENT to GET endpoints for settings sync.
- `notification.routes.ts`: Added HOD, FACULTY to POST / for faculty notifications.
- `parent.routes.ts`: Added HOD, FACULTY to POST / for faculty to create parents.
- `RecentActivities.tsx`: Only fetches faculty list for admin/faculty roles; shows empty state for students/parents.
- `useSharedData.ts`: Each hook accepts `enabled` param (destructured from query params) to prevent unauthorized API calls.

### Email service (EmailJS → Brevo)
- `env.ts`: Replaced `EMAILJS_*` vars with `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME`.
- `email.service.ts`: Rewrote to call Brevo SMTP API (`POST https://api.brevo.com/v3/smtp/email`) with styled HTML template.

### Frontend fixes
- `StudentNotificationsPage.tsx`: Fixed data shape — API returns `{ notifications, unreadCount }`, not a plain array.
- `ParentNotificationsPage.tsx`: Same data shape fix as StudentNotificationsPage — `useEffect` now handles both array and `{ notifications, unreadCount }` response shapes.
- `PersonalInfo.tsx` + `FacultyProfilePage.tsx`: Address object `{street, city, state, pincode}` now stringified before rendering.
- `Sidebar.tsx`: Removed Registration Requests from admin nav; Settings restricted to `isAdmin`.
- `FacultyNotificationsPage.tsx`: Added Send Notification modal with STUDENT/PARENT target picker.
- `StudentRegistrationPage.tsx`: Removed broken department filter on courses API call; added `name="phone"` + `autoComplete="tel-national"` to fix autofill.
- `AssignmentsPage.tsx`: New Assignment button now navigates to create page.

## Backend Structure
- Express server in `backend/src/server.ts` (only used locally)
- Routes mounted under `/api/` prefix (e.g. `/api/auth`, `/api/faculty`, `/api/timetable`)
- PostgreSQL via `pg` (node-postgres) — Prisma only used in seed scripts (not at runtime)
- Health check at `GET /api/health`
- Serverless entry: `api/index.ts` at project root (exports Express app for Vercel)

## Common Pitfalls
- If adding new API endpoints, add corresponding route in `backend/src/app.ts` and controller/service
- If adding new frontend pages, ensure route follows role-prefixed pattern (`/dashboard/:role/…`)
- **Required env vars** must be set in Vercel dashboard — without them the Express app crashes on startup
- File uploads won't persist on Vercel without Cloudinary/S3 config
- Run `npm run build` locally (frontend only) for quick verification
- Vercel automatically compiles `api/index.ts` and its TypeScript dependencies
- Table name mismatches: use `attendances` (plural), `notification_broadcasts` (not `notifications`), `student` (not `student_id`) in fee tables
- `db.ts` `buildWhereClause` only recognizes `'IS NULL'` and `'IS NOT NULL'` as operators, not `'is'`
- `extraWhere` in `db.ts count` does NOT reindex `$N` placeholders — avoid combining extraWhere with where clause conditions

## Work State
### Completed
- **Subscription system (Pro/Premium):** Complete subscription module with trial period, plans, and payment flow:
  - **DB Migration:** `backend/prisma/migrations/20260730000000_add_subscription/` — `subscription_plans` and `admin_subscriptions` tables
  - **Backend module:** `backend/src/modules/subscription/` — routes (GET /plans, GET /my, GET /status, POST /trial, POST /subscribe), controller, service, validator
  - **Frontend SubscriptionPage:** `frontend/src/pages/SubscriptionPage.tsx` — displays 4 plans (Monthly ₹499, Quarterly ₹1199, Half-Yearly ₹1999, Yearly ₹3499), subscribe → UPI redirect to owner account
  - **Admin sidebar:** Added "Subscription" nav item with `MdCrown` icon + "Pro" badge
  - **Admin dashboard banner:** Amber trial-warning when ≤30 days remain; full-screen pause overlay with "View Plans" CTA when expired
  - **Seed script:** `backend/src/scripts/seed-subscription-plans.ts`
- **ParentNotificationsPage data shape:** Same fix as StudentNotificationsPage — `useEffect` now handles both array and `{notifications, unreadCount}` shapes
- **Header hash nav fix:** `MainLayout.tsx` `handleNavClick` now redirects to `/#id` when `pathname !== '/'` — fixes hash links (Home, Overview, About, Services, Usage, Contact) not working on non-root pages
- **Section scroll offset:** Added `scroll-mt-20` to `Section.tsx` for fixed header offset
- **Faculty Send Notification:** Modal with STUDENT/PARENT target picker in `FacultyNotificationsPage.tsx`; HOD+FACULTY added to `POST /notifications`
