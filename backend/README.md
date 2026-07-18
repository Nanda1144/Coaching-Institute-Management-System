# College ERP - Backend API

College ERP Management System backend built with Node.js, Express, TypeScript, and Prisma.

## Architecture

Microservice-style modular architecture:

```
backend/
├── prisma/           # Database schema & migrations
├── src/
│   ├── config/        # App configuration (env, database)
│   ├── shared/        # Shared middleware, errors, utils, enums
│   └── modules/       # Feature modules (microservices)
│       ├── auth/           # Authentication & authorization
│       ├── faculty/        # Faculty CRUD & dashboard
│       ├── attendance/     # Attendance (manual, face, fingerprint, QR)
│       ├── timetable/      # Class timetable management
│       ├── assignment/     # Assignment management
│       ├── homework/       # Homework management
│       ├── submission/     # Assignment submissions & grading
│       ├── evaluation/     # Evaluation & grading
│       ├── material/       # Study material repository
│       ├── upload/         # File upload handling
│       ├── holiday/        # Holiday management
│       ├── reminder/       # Reminders & notifications
│       ├── faculty-transfer/ # Faculty transfer requests
│       └── dashboard/      # Admin & faculty dashboards
```

## Tech Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (access + refresh tokens), bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate limiting

## API Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Login, register, refresh, logout |
| Faculty | `/api/faculty` | CRUD, profile, dashboard stats |
| Attendance | `/api/attendance` | Manual, face, fingerprint, QR, corrections |
| Timetable | `/api/timetable` | Schedule by faculty/day |
| Assignments | `/api/assignments` | CRUD, by faculty |
| Homework | `/api/homework` | CRUD, by faculty |
| Submissions | `/api/submissions` | List, detail, grade |
| Evaluations | `/api/evaluations` | CRUD, publish |
| Materials | `/api/materials` | CRUD, categories, download tracking |
| Upload | `/api/upload` | File upload & management |
| Holidays | `/api/holidays` | CRUD, upcoming holidays |
| Reminders | `/api/reminders` | CRUD, faculty reminders |
| Faculty Transfers | `/api/faculty-transfers` | Requests, approval |
| Dashboard | `/api/dashboard` | Admin & faculty stats |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push

# Seed data
npm run seed
npm run seed:users

# Start development
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/college_erp` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:5173` |
