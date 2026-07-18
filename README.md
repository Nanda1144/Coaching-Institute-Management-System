# Coaching Institution Management System (CIMS)

## Overview
A comprehensive multi-dashboard ERP system for coaching institutions with four specialized dashboards handling different aspects of institute management. The system follows a micro-frontend / microservice architecture with four independent dashboard applications, each with its own backend and frontend. Designed for coaching institutes to manage faculty, students, courses, batches, admissions, attendance, examinations, fees, payments, reports, and parent communication.

## System Architecture Diagram

```
projectsetup/
├── admin-dashboard/                    # Administration, Finance, Examination, Reports
│   ├── backend/                       # Node.js + Express + TypeScript + MongoDB + PostgreSQL
│   │   ├── src/
│   │   │   ├── config/               # Environment & DB configuration
│   │   │   ├── controllers/          # Request handlers (HTTP layer)
│   │   │   ├── routes/               # 30+ route groups
│   │   │   ├── services/             # Business logic
│   │   │   ├── models/               # Mongoose data models
│   │   │   ├── middlewares/          # asyncHandler, errorHandler, notFound
│   │   │   ├── validators/           # Zod / express-validator schemas
│   │   │   ├── interfaces/           # Shared TypeScript interfaces
│   │   │   └── utils/               # logger, response helpers
│   │   └── package.json
│   └── frontend/                     # React 19 + Vite 8 + TypeScript 6
│       └── src/
│           ├── components/           # Shared UI components
│           ├── pages/                # Route-level page components
│           ├── services/             # API service layer
│           ├── hooks/                # Custom React hooks
│           └── features/             # Feature modules
│
├── faculty-dashboard/                  # Faculty, Attendance, Timetable, Academic
│   ├── backend/                       # Node.js + Express + Prisma + PostgreSQL + MongoDB
│   │   ├── prisma/
│   │   │   └── schema.prisma         # 30+ models, 10+ enums
│   │   └── src/
│   │       ├── config/               # App configuration
│   │       ├── shared/               # Shared middleware, errors, utils, enums
│   │       └── modules/              # 14 feature modules
│   │           ├── auth/             # Authentication & authorization
│   │           ├── faculty/          # Faculty CRUD & dashboard
│   │           ├── attendance/       # Manual, face, fingerprint, QR
│   │           ├── timetable/        # Class timetable management
│   │           ├── assignment/       # Assignment management
│   │           ├── homework/         # Homework management
│   │           ├── submission/       # Assignment submissions & grading
│   │           ├── evaluation/       # Evaluation & grading
│   │           ├── material/         # Study material repository
│   │           ├── upload/           # File upload handling
│   │           ├── holiday/          # Holiday management
│   │           ├── reminder/         # Reminders & notifications
│   │           ├── faculty-transfer/ # Faculty transfer requests
│   │           └── dashboard/        # Admin & faculty dashboards
│   └── frontend/                     # React 19 + Vite 8 + TypeScript 6 + TailwindCSS 4
│       └── src/
│           ├── components/           # Shared UI (Sidebar, Navbar, Toast, etc.)
│           ├── hooks/                # Custom React hooks
│           ├── pages/                # Route-level page components
│           ├── services/             # API service layer
│           └── features/             # Feature modules organized by domain
│
├── student-dashboard/                  # Student, Course, Batch Management
│   ├── backend/                       # 5 Microservices
│   │   ├── student-management/       # Node.js + Express + In-Memory/MongoDB (port 8080)
│   │   ├── course-schema/            # Node.js + Express + Sequelize + PostgreSQL (port 3000)
│   │   ├── batch-schema/             # Node.js + Express + PostgreSQL raw SQL (port 3002)
│   │   └── admission-validation/     # Node.js + Express + PostgreSQL raw SQL (port 3004)
│   └── frontend/                      # 7 Sub-apps (React 19 + Vite 8)
│       ├── dashboard/                # Main dashboard with stats, charts
│       ├── student-management/       # Student CRUD, profiles, registration
│       ├── course-management/        # Course CRUD, search, dashboard
│       ├── batch-management/         # Batch CRUD, analytics, student allocation
│       ├── api-integration/          # All-service integration layer
│       ├── search-components/        # Advanced search UI
│       └── integration/              # Reusable client modules for all microservices
│
└── parents-dashboard/                  # Parent Portal, Child Monitoring
    ├── backend/                       # Express + Sequelize + PostgreSQL (port 3001)
    │   ├── controllers/               # Parent, Student, Emergency, Communication, Financial
    │   ├── models/                    # 8 Sequelize models
    │   ├── routes/                    # 19 endpoints
    │   └── services/                  # Business logic
    └── frontend/                      # React 19 + Vite 8 + BEM CSS
        └── src/
            ├── components/            # Login, Dashboard, Profile, Attendance, Fees, Exams, etc.
            ├── pages/                 # 10 pages
            ├── services/              # 8 service modules
            ├── context/               # AuthContext, ChildContext
            └── data/                  # Dummy static data
```

## Team Structure & Module Ownership

### Team Member 1 (M1 - Grishma) - Authentication & Core UI
- **Role:** Frontend Developer
- **Modules:** Authentication, Core UI Components, Layout System
- **Dashboard:** admin-dashboard
- **Responsibilities:**
  - Login/Register pages with form validation
  - Auth guard system (ProtectedRoute, RoleGuard)
  - Shared UI components (Sidebar, Navbar, Toast, Modal, Pagination, SearchBar)
  - Layout system with collapsible sidebar
  - Auth context and session management

### Team Member 2 (M2 - Malin) - Student & Parent Management
- **Role:** Frontend Developer
- **Modules:** Student Management, Parent Portal, Course & Batch Management
- **Dashboards:** student-dashboard, parents-dashboard
- **Responsibilities:**
  - **Student Dashboard:** Dashboard stats, student CRUD, profiles, registration (5-step), status management, advanced search, document management, transfers, activity timeline
  - **Parent Portal:** Login, dashboard (child overview), child profile, attendance view, fee details, exam results, homework, notifications, download reports, multiple child support
  - **Course Management:** Course list, edit, details, search, course dashboard
  - **Batch Management:** Batch list, add, edit, details (5-tab), student allocation, batch analytics
  - **API Integration:** Student CRUD, parent dashboard/profile, course CRUD, batch CRUD, file upload

### Team Member 3 (M3 - Nanda) - Faculty & Academic Management
- **Role:** Frontend Developer
- **Modules:** Faculty, Attendance, Timetable, Academic Management
- **Dashboard:** faculty-dashboard
- **Responsibilities:**
  - **Frontend:** Dashboard, faculty CRUD, faculty profile, assignments, attendance (manual/face/fingerprint/QR), timetable, holidays, interactive calendar, faculty transfer, homework, study materials, evaluations, reminders
  - **Backend:** 14 module APIs (auth, faculty, attendance, timetable, assignment, homework, submission, evaluation, material, upload, holiday, reminder, faculty-transfer, dashboard)
  - **Database:** Complete Prisma schema with 30+ models, PostgreSQL + MongoDB

### Team Member 4 (M4) - Administration, Finance & Reports
- **Role:** Frontend Developer
- **Modules:** Institute & Branch, User & Role, Fee Management, Examination, Reports, Notifications, Analytics
- **Dashboard:** admin-dashboard
- **Responsibilities:**
  - Institute & Branch management
  - User & Role management (admin users, permissions)
  - Fee management (fee structures, student fees, payments, scholarships, refunds, receipts)
  - Examination management (exams, marks entry, results, revaluations)
  - Reports & Certificates (student reports, fee reports, attendance reports, examination reports, exports)
  - Notifications & Analytics (announcements, notifications, dashboard analytics, audit logs)
  - System settings & CIMS configuration

## Technology Stack

### Frontend
| Technology | Version | Usage |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 6 | Type-safe development |
| Vite | 8 | Build tool and dev server |
| TailwindCSS | 4 | Utility-first CSS (faculty-dashboard) |
| BEM CSS | — | Component styling (student/parent dashboards) |
| React Router | 7 | Client-side routing |
| React Query | — | Server state management (faculty-dashboard) |
| Zustand | — | Global state management |
| React Hook Form | 7 | Form management |
| Zod | — | Form validation |
| Axios | — | HTTP client |
| Recharts | — | Charts and analytics |
| Framer Motion | 12 | Animations (faculty-dashboard) |
| React Icons | — | Icon library (Material Design) |
| SheetJS (xlsx) | — | CSV & XLSX export |
| React Context API | — | Auth, Child context (parent-dashboard) |

### Backend
| Technology | Version | Usage |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express.js | 4.21 | HTTP framework |
| TypeScript | 6 | Type-safe development |
| Prisma ORM | — | PostgreSQL ORM (faculty-dashboard, admin-dashboard) |
| Sequelize ORM | 6.37 | PostgreSQL ORM (course-schema, parent-schema) |
| Mongoose | 8.x | MongoDB ODM (admin-dashboard, student-management) |
| JWT | — | Authentication (access + refresh tokens) |
| bcrypt | — | Password hashing |
| Nodemailer | — | Email/OTP delivery |
| Winston | — | Structured logging |
| Helmet | — | Security headers |
| Compression | — | Response compression |
| express-validator | 7.2 | Input validation (course-schema, parent-schema) |
| Zod | — | Input validation |
| pg (node-postgres) | — | Raw SQL (batch-schema, admission-validation) |

### Databases
| Database | Usage | Dashboards |
|---|---|---|
| PostgreSQL | Primary data store (Prisma + Sequelize) | admin, faculty, student, parent |
| MongoDB | Auth sessions, CIMS features, Fee/Exam/Notification collections | admin, faculty |

## Dashboard Details

### admin-dashboard

**Purpose:** Administration, Finance, Examination, and Analytics hub for institute management.

**Backend Structure:**
```
backend/src/
├── routes/                      # 30+ route groups (30 route files)
│   ├── health.routes.ts         # Health check
│   ├── auth.routes.ts           # Authentication
│   ├── session.routes.ts        # Session management
│   ├── user.routes.ts           # User CRUD
│   ├── settings.routes.ts       # User settings
│   ├── cims.routes.ts           # CIMS management
│   ├── dashboard.routes.ts      # Dashboard
│   ├── admin.routes.ts          # Admin operations
│   ├── reports.routes.ts        # Reports
│   ├── feeStructure.routes.ts   # Fee structures
│   ├── studentFee.routes.ts     # Student fee records
│   ├── payment.routes.ts        # Payment transactions
│   ├── scholarship.routes.ts    # Scholarships
│   ├── refund.routes.ts         # Refunds
│   ├── receipt.routes.ts        # Receipts
│   ├── notification.routes.ts   # Notifications
│   ├── announcement.routes.ts   # Announcements
│   ├── auditLog.routes.ts       # Audit logs
│   ├── systemSettings.routes.ts # System settings
│   ├── dashboardAnalytics.routes.ts # Analytics dashboard
│   ├── paymentGateway.routes.ts # Payment gateway integration
│   ├── examination.routes.ts    # Examination management
│   ├── marksEntry.routes.ts     # Marks entry
│   ├── result.routes.ts         # Results
│   ├── revaluation.routes.ts    # Revaluation
│   ├── reportDashboard.routes.ts # Report dashboard
│   ├── studentReport.routes.ts   # Student reports
│   ├── feeReport.routes.ts       # Fee reports
│   ├── attendanceReport.routes.ts # Attendance reports
│   ├── examinationReport.routes.ts # Examination reports
│   └── export.routes.ts          # Data export
├── controllers/                 # Request handlers
├── services/                    # Business logic
├── models/                      # Mongoose models
├── middlewares/                 # asyncHandler, errorHandler, notFound
├── validators/                  # Zod / express-validator schemas
├── interfaces/                  # Shared TypeScript interfaces
├── utils/                       # logger, response helpers
├── config/                      # Environment & DB config
├── app.ts                       # Express app factory
└── server.ts                    # Entry point
```

### faculty-dashboard

**Purpose:** Complete faculty management system including attendance tracking, timetable management, academic content delivery, and faculty administration.

**Backend Modules & API Endpoints:**

| Module | Base Path | Endpoints |
|---|---|---|
| Auth | /api/auth | POST /login, POST /register, POST /refresh, POST /logout |
| Faculty | /api/faculty | CRUD, GET /profile, GET /dashboard-stats, GET /search |
| Attendance | /api/attendance | CRUD, GET /by-date, POST /manual, POST /face, POST /fingerprint, POST /qr, POST /corrections, GET /analytics, GET /history, GET /reports |
| Timetable | /api/timetable | CRUD, GET /by-faculty/:id, GET /by-day/:day, POST /create |
| Assignments | /api/assignments | CRUD, GET /by-faculty/:id, POST /publish |
| Homework | /api/homework | CRUD, GET /by-faculty/:id |
| Submissions | /api/submissions | GET /list, GET /:id/detail, POST /:id/grade |
| Evaluations | /api/evaluations | CRUD, POST /publish |
| Materials | /api/materials | CRUD, GET /categories, POST /download/:id |
| Upload | /api/upload | POST /file, POST /multiple, DELETE /:id |
| Holidays | /api/holidays | CRUD, GET /upcoming |
| Reminders | /api/reminders | CRUD, GET /faculty/:id |
| Faculty Transfers | /api/faculty-transfers | CRUD, POST /approve/:id |
| Dashboard | /api/dashboard | GET /admin-stats, GET /faculty-stats |

**Prisma Schema Models (30+ models):**
- Subject, Batch, Classroom, Faculty, Student
- Attendance (with enums for methods and statuses)
- Timetable (with recurrence support)
- FacultyTransfer, AssignmentLog
- Holiday, FaceRecognition, FingerprintAttendance
- QRSession, QRScan, AttendanceCorrection
- Department, Course, Semester
- Assignment, AssignmentAttachment, Homework, HomeworkAttachment
- AssignmentSubmission, SubmissionAttachment, Evaluation
- Chapter, StudyMaterial, MaterialCategory, MaterialAttachment, MaterialDownload, MaterialSearchLog
- AssignmentReminder, Upload
- AuthUser, AuthSession, AuthLoginHistory, PasswordReset
- AppSettings, Enrollment, Activity, SystemConfig, Report

### student-dashboard

**Purpose:** Student lifecycle management including admissions, course enrollment, batch allocation, and academic progress tracking.

**Backend Microservices:**

#### 1. Student Management (port 8080)
- **Runtime:** Node.js + Express
- **Data Store:** In-Memory (default) or MongoDB (optional)
- **Endpoints (11):**
  - GET /api/students (paginated list)
  - GET /api/students/search (advanced search)
  - GET /api/students/:id (single student)
  - GET /api/students/:id/history (complete academic history)
  - GET /api/students/:id/profile (full profile)
  - POST /api/students (create)
  - POST /api/students/admission (full admission workflow)
  - POST /api/students/:id/transfer (branch/batch transfer)
  - PUT /api/students/:id (update)
  - DELETE /api/students/:id (soft delete)
  - PATCH /api/students/:id/status (status change with history)

#### 2. Course Schema (port 3000)
- **Runtime:** Node.js + Express + Sequelize
- **Data Store:** PostgreSQL (ciiims_courses)
- **Endpoints (17):**
  - POST/GET/PUT/DELETE /api/courses
  - GET /api/courses/search, GET /api/courses/statistics
  - PATCH /api/courses/:id/toggle-status
  - POST/GET/PUT/DELETE /api/courses/:courseId/subjects
  - POST/GET/DELETE /api/enrollments

#### 3. Batch Schema (port 3002)
- **Runtime:** Node.js + Express + PostgreSQL (raw SQL)
- **Data Store:** PostgreSQL (ciiims_batches)
- **Endpoints (18):**
  - POST/GET/PUT/DELETE /api/batches
  - GET /api/batches/search, GET /api/batches/course/:courseId
  - POST/GET/DELETE /api/batches/:batchId/students
  - POST/GET/DELETE /api/batches/:batchId/faculty
  - GET /api/batches/:id/analytics, GET /api/batches/:id/capacity
  - POST /api/batches/:id/validate
  - POST /api/batch-transfer, GET /api/batch-transfer/history/:studentId

#### 4. Admission Validation (port 3004)
- **Runtime:** Node.js + Express + PostgreSQL (raw SQL)
- **Data Store:** PostgreSQL (ciiims_admissions)
- **Endpoints (12):**
  - POST/GET/PUT/DELETE /api/admissions
  - POST /api/admissions (with business rule validation)
  - POST /api/course-eligibility/check
  - POST /api/course-enrollment (guarded enrollment)
  - POST/PUT /api/students (validated student data)
  - GET /api/batches/:batchId/capacity
  - POST /api/batches/:batchId/enroll

**Frontend Sub-apps (7):**
| App | Features |
|---|---|
| dashboard | Institute overview, stat cards, charts, recent admissions, quick actions |
| student-management | Student CRUD, profile (multi-tab), registration (5-step), status, advanced search, documents, transfers, activity timeline |
| course-management | Course list, edit, details, search, course dashboard |
| batch-management | Batch list, add, edit, details (5-tab), student allocation, batch analytics |
| api-integration | API integration UI for all microservices |
| search-components | Advanced multi-field search |
| integration | Reusable client modules (course-client, parent-client, batch-client, document-client, admission-client) |

### parents-dashboard

**Purpose:** Parent portal for monitoring child academic progress, attendance, fees, exams, and communication.

**Backend (port 3001):**
- **Runtime:** Node.js + Express + Sequelize
- **Data Store:** PostgreSQL (ciiims_parent)
- **Models (8):** parents, students, parent_students, emergency_contacts, parent_emergency_contacts, student_emergency_contacts, communication_logs, financial_transactions
- **Endpoints (19):**
  - POST/GET/PUT/DELETE /api/parents
  - GET /api/parents/search
  - PATCH /api/parents/:id/toggle-status
  - POST/GET/PUT/DELETE /api/parent-students
  - GET /api/parents/:parentId/students
  - DELETE /api/parents/:parentId/students/:studentId
  - POST/GET/PUT/DELETE /api/emergency-contacts

**Frontend Pages (10):**
| Page | Path | Features |
|---|---|---|
| Login | /login | Email/password, validation, show/hide, remember me |
| Dashboard | / | Child overview, attendance, exams, homework, announcements |
| Child Profile | /profile/:childId | Personal, academic, guardian, attendance, fees, exams |
| Attendance View | /attendance/:childId | Daily/weekly/monthly, calendar, stats, charts |
| Fee Details | /fees/:childId | Payment summary, installments, due dates, history |
| Exam Results | /exams/:childId | Marks, grades, rankings, charts, report card |
| Homework | /homework/:childId | Stats, search, filters, deadline tracking |
| Notifications | /notifications/:childId | Categories, search, mark-as-read, badge |
| Download Reports | /reports/:childId | Attendance/fee/exam reports, preview, download |
| Multiple Child | /:feature/:childId | ChildSwitcher, React Context API |

## API Endpoints Complete Reference

### admin-dashboard API Routes (under /api/)

| Route Group | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | /api/auth/login | User login |
| | POST | /api/auth/register | User registration |
| | POST | /api/auth/refresh | Refresh token |
| | POST | /api/auth/logout | Logout |
| | POST | /api/auth/forgot-password | Forgot password |
| | POST | /api/auth/reset-password | Reset password |
| | POST | /api/auth/verify-otp | Verify OTP |
| **Sessions** | GET | /api/auth/sessions | List sessions |
| | DELETE | /api/auth/sessions/:id | Delete session |
| **Users** | GET | /api/users | List users |
| | GET | /api/users/:id | Get user |
| | POST | /api/users | Create user |
| | PUT | /api/users/:id | Update user |
| | DELETE | /api/users/:id | Delete user |
| **Settings** | GET | /api/settings | Get settings |
| | PUT | /api/settings | Update settings |
| **CIMS** | GET | /api/cims | Get CIMS data |
| | POST | /api/cims | Create CIMS record |
| | PUT | /api/cims/:id | Update CIMS record |
| | DELETE | /api/cims/:id | Delete CIMS record |
| **Dashboard** | GET | /api/dashboard | Dashboard data |
| **Admin** | GET | /api/admin | Admin operations |
| | POST | /api/admin | Create admin record |
| **Reports** | GET | /api/reports | List reports |
| | GET | /api/reports/:id | Get report |
| | POST | /api/reports | Generate report |
| **Fee Structures** | GET | /api/fee-structures | List fee structures |
| | GET | /api/fee-structures/:id | Get fee structure |
| | POST | /api/fee-structures | Create fee structure |
| | PUT | /api/fee-structures/:id | Update fee structure |
| | DELETE | /api/fee-structures/:id | Delete fee structure |
| **Student Fees** | GET | /api/student-fees | List student fees |
| | GET | /api/student-fees/:id | Get student fee |
| | POST | /api/student-fees | Create student fee |
| | PUT | /api/student-fees/:id | Update student fee |
| **Payments** | GET | /api/payments | List payments |
| | GET | /api/payments/:id | Get payment |
| | POST | /api/payments | Create payment |
| | PUT | /api/payments/:id | Update payment |
| **Scholarships** | GET | /api/scholarships | List scholarships |
| | POST | /api/scholarships | Create scholarship |
| | PUT | /api/scholarships/:id | Update scholarship |
| **Refunds** | GET | /api/refunds | List refunds |
| | POST | /api/refunds | Process refund |
| **Receipts** | GET | /api/receipts | List receipts |
| | GET | /api/receipts/:id | Get receipt |
| | POST | /api/receipts | Generate receipt |
| **Notifications** | GET | /api/notifications | List notifications |
| | POST | /api/notifications | Create notification |
| | PUT | /api/notifications/:id/read | Mark as read |
| **Announcements** | GET | /api/announcements | List announcements |
| | POST | /api/announcements | Create announcement |
| | PUT | /api/announcements/:id | Update announcement |
| **Audit Logs** | GET | /api/audit-logs | List audit logs |
| **System Settings** | GET | /api/settings/system | Get system settings |
| | PUT | /api/settings/system | Update system settings |
| **Dashboard Analytics** | GET | /api/dashboard-analytics | Get analytics |
| **Payment Gateway** | POST | /api/payment-gateway/process | Process payment |
| | GET | /api/payment-gateway/status/:id | Payment status |
| **Examinations** | GET | /api/examinations | List examinations |
| | GET | /api/examinations/:id | Get examination |
| | POST | /api/examinations | Create examination |
| | PUT | /api/examinations/:id | Update examination |
| | DELETE | /api/examinations/:id | Delete examination |
| **Marks Entry** | GET | /api/marks-entry | List marks entries |
| | POST | /api/marks-entry | Enter marks |
| | PUT | /api/marks-entry/:id | Update marks |
| **Results** | GET | /api/results | List results |
| | GET | /api/results/:id | Get result |
| | POST | /api/results | Publish result |
| **Revaluations** | GET | /api/revaluations | List revaluations |
| | POST | /api/revaluations | Request revaluation |
| | PUT | /api/revaluations/:id | Update revaluation |
| **Report Dashboard** | GET | /api/report-dashboard | Report dashboard data |
| **Student Reports** | GET | /api/reports/student | Student reports |
| **Fee Reports** | GET | /api/reports/fee | Fee reports |
| **Attendance Reports** | GET | /api/reports/attendance | Attendance reports |
| **Examination Reports** | GET | /api/reports/examination | Examination reports |
| **Exports** | GET | /api/exports/students | Export student data |
| | GET | /api/exports/payments | Export payment data |
| | GET | /api/exports/reports | Export reports |

### faculty-dashboard API Routes (under /api/)

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | /api/auth/login | Faculty login |
| | POST | /api/auth/register | Faculty registration |
| | POST | /api/auth/refresh | Refresh token |
| | POST | /api/auth/logout | Logout |
| **Faculty** | GET | /api/faculty | List all faculty |
| | GET | /api/faculty/:id | Get faculty by ID |
| | POST | /api/faculty | Create faculty |
| | PUT | /api/faculty/:id | Update faculty |
| | DELETE | /api/faculty/:id | Delete faculty |
| | GET | /api/faculty/:id/profile | Faculty profile |
| | GET | /api/faculty/:id/dashboard-stats | Dashboard stats |
| | GET | /api/faculty/search | Search faculty |
| **Attendance** | GET | /api/attendance | List attendance |
| | GET | /api/attendance/:id | Get attendance |
| | POST | /api/attendance | Create attendance |
| | PUT | /api/attendance/:id | Update attendance |
| | DELETE | /api/attendance/:id | Delete attendance |
| | GET | /api/attendance/by-date | Attendance by date |
| | POST | /api/attendance/manual | Manual attendance |
| | POST | /api/attendance/face | Face recognition attendance |
| | POST | /api/attendance/fingerprint | Fingerprint attendance |
| | POST | /api/attendance/qr | QR code attendance |
| | GET | /api/attendance/analytics | Attendance analytics |
| | GET | /api/attendance/history | Attendance history |
| | GET | /api/attendance/reports | Attendance reports |
| | POST | /api/attendance/corrections | Request correction |
| **Timetable** | GET | /api/timetable | List timetable |
| | POST | /api/timetable | Create timetable |
| | PUT | /api/timetable/:id | Update timetable |
| | DELETE | /api/timetable/:id | Delete timetable |
| | GET | /api/timetable/by-faculty/:id | By faculty |
| | GET | /api/timetable/by-day/:day | By day of week |
| **Assignments** | GET | /api/assignments | List assignments |
| | GET | /api/assignments/:id | Get assignment |
| | POST | /api/assignments | Create assignment |
| | PUT | /api/assignments/:id | Update assignment |
| | DELETE | /api/assignments/:id | Delete assignment |
| | GET | /api/assignments/by-faculty/:id | By faculty |
| | POST | /api/assignments/publish | Publish assignment |
| **Homework** | GET | /api/homework | List homework |
| | POST | /api/homework | Create homework |
| | PUT | /api/homework/:id | Update homework |
| | DELETE | /api/homework/:id | Delete homework |
| | GET | /api/homework/by-faculty/:id | By faculty |
| **Submissions** | GET | /api/submissions | List submissions |
| | GET | /api/submissions/:id | Get submission |
| | POST | /api/submissions/:id/grade | Grade submission |
| **Evaluations** | GET | /api/evaluations | List evaluations |
| | POST | /api/evaluations | Create evaluation |
| | PUT | /api/evaluations/:id | Update evaluation |
| | POST | /api/evaluations/publish | Publish evaluation |
| **Materials** | GET | /api/materials | List materials |
| | GET | /api/materials/:id | Get material |
| | POST | /api/materials | Create material |
| | PUT | /api/materials/:id | Update material |
| | DELETE | /api/materials/:id | Delete material |
| | GET | /api/materials/categories | List categories |
| | POST | /api/materials/:id/download | Download material |
| **Upload** | POST | /api/upload/file | Upload single file |
| | POST | /api/upload/multiple | Upload multiple files |
| | DELETE | /api/upload/:id | Delete upload |
| **Holidays** | GET | /api/holidays | List holidays |
| | POST | /api/holidays | Create holiday |
| | PUT | /api/holidays/:id | Update holiday |
| | DELETE | /api/holidays/:id | Delete holiday |
| | GET | /api/holidays/upcoming | Upcoming holidays |
| **Reminders** | GET | /api/reminders | List reminders |
| | POST | /api/reminders | Create reminder |
| | PUT | /api/reminders/:id | Update reminder |
| | DELETE | /api/reminders/:id | Delete reminder |
| | GET | /api/reminders/faculty/:id | By faculty |
| **Faculty Transfers** | GET | /api/faculty-transfers | List transfers |
| | POST | /api/faculty-transfers | Request transfer |
| | PUT | /api/faculty-transfers/:id | Update transfer |
| | POST | /api/faculty-transfers/:id/approve | Approve transfer |
| **Dashboard** | GET | /api/dashboard/admin-stats | Admin dashboard stats |
| | GET | /api/dashboard/faculty-stats | Faculty dashboard stats |

### student-dashboard API Routes

**Student Management (port 8080):**
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List students (paginated) |
| GET | /api/students/search | Advanced search |
| GET | /api/students/:id | Get student |
| GET | /api/students/:id/history | Get complete history |
| GET | /api/students/:id/profile | Get profile |
| POST | /api/students | Create student |
| POST | /api/students/admission | Full admission workflow |
| POST | /api/students/:id/transfer | Transfer student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Soft delete student |
| PATCH | /api/students/:id/status | Update status |

**Course Schema (port 3000):**
| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/courses | Create course |
| GET | /api/courses | List courses |
| GET | /api/courses/search | Search courses |
| GET | /api/courses/statistics | Course statistics |
| GET | /api/courses/:id | Get course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |
| PATCH | /api/courses/:id/toggle-status | Toggle status |
| POST | /api/courses/:courseId/subjects | Create subject |
| GET | /api/courses/:courseId/subjects | List subjects |
| GET | /api/courses/:courseId/subjects/:subjectId | Get subject |
| PUT | /api/courses/:courseId/subjects/:subjectId | Update subject |
| DELETE | /api/courses/:courseId/subjects/:subjectId | Delete subject |
| POST | /api/enrollments | Create enrollment |
| GET | /api/enrollments/:id | Get enrollment |
| DELETE | /api/enrollments/:id | Delete enrollment |

**Batch Schema (port 3002):**
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/batches | Create batch |
| GET | /api/batches | List batches |
| GET | /api/batches/:id | Get batch |
| PUT | /api/batches/:id | Update batch |
| DELETE | /api/batches/:id | Delete batch |
| POST | /api/batches/:batchId/students | Allocate student |
| GET | /api/batches/:batchId/students | List students |
| DELETE | /api/batches/:batchId/students/:sid | Deallocate student |
| POST | /api/batches/:batchId/faculty | Assign faculty |
| GET | /api/batches/:batchId/faculty | Get faculty |
| DELETE | /api/batches/:batchId/faculty | Remove faculty |
| GET | /api/batches/:id/analytics | Get analytics |
| GET | /api/batches/:id/capacity | Get capacity |
| POST | /api/batches/:id/validate | Validate capacity |
| POST | /api/batch-transfer | Transfer student |
| GET | /api/batch-transfer/history/:studentId | Transfer history |
| GET | /api/batches/course/:courseId | By course |

**Admission Validation (port 3004):**
| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/admissions | Create admission |
| GET | /api/admissions | List admissions |
| GET | /api/admissions/:id | Get admission |
| PUT | /api/admissions/:id | Update admission |
| DELETE | /api/admissions/:id | Delete admission |
| POST | /api/course-eligibility/check | Check eligibility |
| POST | /api/course-enrollment | Guarded enrollment |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| GET | /api/batches/:batchId/capacity | Batch capacity |
| POST | /api/batches/:batchId/enroll | Enroll with capacity |

### parents-dashboard API Routes (port 3001)

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/parents | Create parent |
| GET | /api/parents | List parents |
| GET | /api/parents/search | Search parents |
| GET | /api/parents/:id | Get parent |
| PUT | /api/parents/:id | Update parent |
| DELETE | /api/parents/:id | Delete parent |
| PATCH | /api/parents/:id/toggle-status | Toggle status |
| POST | /api/parent-students | Link parent-student |
| GET | /api/parent-students | List links |
| GET | /api/parents/:parentId/students | Get students |
| PUT | /api/parent-students/:id | Update link |
| DELETE | /api/parent-students/:id | Remove link |
| DELETE | /api/parents/:parentId/students/:sid | Remove by IDs |
| POST | /api/emergency-contacts | Create contact |
| GET | /api/emergency-contacts | List contacts |
| GET | /api/emergency-contacts/:id | Get contact |
| PUT | /api/emergency-contacts/:id | Update contact |
| DELETE | /api/emergency-contacts/:id | Delete contact |

## Database Schema

### admin-database - MongoDB Collections

#### Auth Collection
| Field | Type | Description |
|---|---|---|
| email | String | User email (unique) |
| password | String | Hashed password |
| role | String | User role |
| isVerified | Boolean | Email verification status |
| refreshTokens | String[] | Active refresh tokens |
| otp | String | OTP for verification |
| otpExpiresAt | Date | OTP expiry |
| createdAt | Date | Record creation time |
| updatedAt | Date | Record update time |

#### Fee Collections
- **FeeStructure:** name, category, amount, dueDate, lateFee, discounts, applicableBatches, status
- **StudentFee:** studentId, feeStructureId, totalAmount, paidAmount, dueDate, status, lateFeeApplied
- **Payment:** studentFeeId, amount, method, transactionId, gatewayResponse, status, date
- **Scholarship:** name, type, percentage, maxAmount, eligibility, applicableCourses, status
- **Refund:** paymentId, amount, reason, status, processedDate
- **Receipt:** paymentId, receiptNumber, generatedDate, pdfUrl

#### Examination Collections
- **Examination:** name, type, course, batch, subjects, date, duration, totalMarks, status
- **MarksEntry:** examinationId, studentId, subjectId, marksObtained, maxMarks, remarks
- **Result:** examinationId, studentId, totalMarks, percentage, grade, rank, status
- **Revaluation:** marksEntryId, reason, status, revisedMarks, remarks

#### Notification Collections
- **Notification:** userId, title, message, type, read, createdAt
- **Announcement:** title, content, targetRoles, targetBatches, priority, status, createdAt
- **AuditLog:** userId, action, entity, entityId, oldValue, newValue, ipAddress, timestamp

### faculty-database - PostgreSQL (Prisma)

**Core Tables:** subjects, batches, classrooms, faculty, students, departments, courses, semesters, enrollments

**Attendance Tables:** attendances, face_recognitions, fingerprint_attendances, qr_sessions, qr_scans, attendance_corrections

**Academic Tables:** timetables, assignments, assignment_attachments, homeworks, homework_attachments, assignment_submissions, submission_attachments, evaluations

**Material Tables:** chapters, study_materials, material_categories, material_attachments, material_downloads, material_search_logs

**Utility Tables:** assignment_logs, assignment_reminders, holidays, faculty_transfers, uploads, activities, system_configs

**Auth Tables:** auth_users, auth_sessions, auth_login_history, password_resets, app_settings

**Key Enums:** AttendanceStatus (present/absent/late/half_day/leave), AttendanceMethod (manual/face_recognition/fingerprint/qr_code), EvaluationStatus (draft/published/under_review/revised), SubmissionStatus (submitted/late/resubmitted/graded/returned), MaterialType (PDF/PPT/PPTX/DOC/DOCX/IMAGE/VIDEO/ZIP/NOTES), MaterialVisibility (PUBLIC/FACULTY_ONLY/STUDENTS_ONLY/BATCH_ONLY)

### student-database - PostgreSQL

**Course Schema (ciiims_courses):** courses, subjects, students, enrollments (via Sequelize migrations)

**Batch Schema (ciiims_batches):** batches, courses (reference), faculties (reference), students, batch_students (junction), transfer_history (via raw SQL schema)

**Admission Schema (ciiims_admissions):** students, courses (reference), batches (reference), course_prerequisites (via raw SQL schema)

### parents-database - PostgreSQL

**Parent Schema (ciiims_parent):** parents, students, parent_students, emergency_contacts, parent_emergency_contacts, student_emergency_contacts, communication_logs, financial_transactions (via Sequelize migrations)

## M4 Feature Implementation Details

### Institute & Branch Management (FE4-001 to FE4-006)
- FE4-001: Institute profile setup with name, logo, contact, address
- FE4-002: Branch creation with code, name, address, contact
- FE4-003: Branch listing with search, filter, pagination
- FE4-004: Branch edit with validation
- FE4-005: Branch status management (active/inactive)
- FE4-006: Branch dashboard with stats per branch

### User & Role Management (FE4-007 to FE4-012)
- FE4-007: User login/register with JWT authentication
- FE4-008: Role-based access control (Admin, Manager, Staff, etc.)
- FE4-009: User CRUD with role assignment
- FE4-010: Permission management per role
- FE4-011: Session management and audit
- FE4-012: Profile settings and password change

### Fee Management (FE4-013 to FE4-019)
- FE4-013: Fee structure creation with name, category, amount, due dates
- FE4-014: Fee structure listing and management
- FE4-015: Student fee assignment with proration
- FE4-016: Payment processing (Razorpay, PhonePe, Stripe)
- FE4-017: Scholarship and discount management
- FE4-018: Refund processing with approval workflow
- FE4-019: Receipt generation and download

### Examination Management (FE4-020 to FE4-025)
- FE4-020: Examination schedule creation
- FE4-021: Marks entry with subject-wise breakdown
- FE4-022: Result generation and publishing
- FE4-023: Grade card and rank generation
- FE4-024: Revaluation request and processing
- FE4-025: Exam analytics and performance trends

### Reports & Certificates (FE4-026 to FE4-031)
- FE4-026: Student report (personal, academic, attendance, fees)
- FE4-027: Fee report (collections, pending, dues, scholarships)
- FE4-028: Attendance report (daily, monthly, course-wise)
- FE4-029: Examination report (marks, grades, pass/fail analysis)
- FE4-030: Certificate generation (bonafide, transfer, character)
- FE4-031: Data export (CSV, Excel, PDF)

### Notifications & Analytics (FE4-032 to FE4-037)
- FE4-032: Announcement creation and broadcast
- FE4-033: User notification system (in-app, email)
- FE4-034: Dashboard analytics (revenue, enrollment, attendance charts)
- FE4-035: Audit log with activity tracking
- FE4-036: System configuration management
- FE4-037: Application settings (timezone, language, logo, etc.)

### Shared Components (FE4-038 to FE4-042)
- FE4-038: DataTable with sort, filter, pagination, export
- FE4-039: Form system with validation, dirty tracking
- FE4-040: Chart components (bar, line, pie, donut)
- FE4-041: Notification/Toast system
- FE4-042: Loading, empty, error states

### API Integration (FE4-043 to FE4-049)
- FE4-043: Axios instance with interceptors
- FE4-044: Auth token management
- FE4-045: Error handling and retry logic
- FE4-046: API service layer pattern
- FE4-047: File upload with progress
- FE4-048: Pagination and search params
- FE4-049: Cache and request deduplication

## Setup & Installation

### Prerequisites
- Node.js v18 or later
- npm v9 or later
- PostgreSQL 14 or later
- MongoDB 6 or later (for admin-dashboard)

### General Setup Steps

```bash
# 1. Clone the repository
cd C:\nanda\ramp msme\coaching-instiution-management-system

# 2. Install & Setup admin-dashboard
cd projectsetup/admin-dashboard
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cp .env.example .env  # configure environment variables

# 3. Install & Setup faculty-dashboard
cd ../faculty-dashboard
npm install  # frontend dependencies
cd backend && npm install && cd ..
cp .env .env  # already exists, review configuration
cd backend && npx prisma generate && npx prisma db push && cd ..

# 4. Install & Setup student-dashboard
cd ../student-dashboard
# Backend microservices
cd backend/student-management && npm install && cd ../..
cd backend/course-schema && npm install && cd ../..
cd backend/batch-schema && npm install && cd ../..
cd backend/admission-validation && npm install && cd ../..
# Frontend sub-apps
cd frontend/dashboard && npm install && cd ../..
cd frontend/student-management && npm install && cd ../..
cd frontend/course-management && npm install && cd ../..
cd frontend/batch-management && npm install && cd ../..
cd frontend/api-integration && npm install && cd ../..
cd frontend/search-components && npm install && cd ../..

# 5. Install & Setup parents-dashboard
cd ../parents-dashboard
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Running the Applications

```bash
# admin-dashboard (backend on :5000, frontend on :5173)
cd projectsetup/admin-dashboard
cd backend && npm run dev
cd frontend && npm run dev

# faculty-dashboard (backend on :5000, frontend on :5173)
cd projectsetup/faculty-dashboard
npm run dev  # frontend
cd backend && npm run dev  # backend

# student-dashboard microservices
cd projectsetup/student-dashboard
cd backend/student-management && npm run dev  # :8080
cd backend/course-schema && npm run dev       # :3000
cd backend/batch-schema && npm run dev        # :3002
cd backend/admission-validation && npm run dev # :3004

# parents-dashboard (backend on :3001, frontend on :5173)
cd projectsetup/parents-dashboard
cd backend && npm run dev
cd frontend && npm run dev
```

### Environment Variables

Each dashboard has its own `.env` file at the dashboard root. See individual `.env` files for all required variables. Key variables include:

| Variable | Description | Default |
|---|---|---|
| PORT | Server port | 5000/3000/3001/3002/3004/8080 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection | postgresql://postgres:postgres@localhost:5432/cims |
| MONGO_URI | MongoDB connection | mongodb://127.0.0.1:27017/db-name |
| JWT_SECRET | JWT signing secret | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| SMTP_HOST | Email server | smtp.gmail.com |
| SMTP_PORT | Email port | 587 |

## Port Allocation

| Service | Port | Dashboard |
|---|---|---|
| admin-dashboard Backend | 5000 | admin-dashboard |
| admin-dashboard Frontend (Vite) | 5173 | admin-dashboard |
| faculty-dashboard Backend | 5000 | faculty-dashboard |
| faculty-dashboard Frontend (Vite) | 5173 | faculty-dashboard |
| student-management Backend | 8080 | student-dashboard |
| course-schema Backend | 3000 | student-dashboard |
| parent-schema Backend | 3001 | student/parent-dashboard |
| batch-schema Backend | 3002 | student-dashboard |
| document Backend | 3003 | student-dashboard |
| admission-validation Backend | 3004 | student-dashboard |
| student-dashboard Frontend (Vite) | 5173 | student-dashboard |
| parents-dashboard Backend | 3001 | parents-dashboard |
| parents-dashboard Frontend (Vite) | 5173 | parents-dashboard |

## QA & Test Coverage

### Testing Methodology
- **Unit Tests:** For models, services, controllers, validators, utilities
- **Integration Tests:** For API endpoints, database operations, middleware chains
- **UI Tests:** For components, pages, hooks, form validation
- **E2E Tests:** For complete workflows across multiple modules

### admin-dashboard Test Coverage
| Module | Test Areas |
|---|---|
| Auth | Login flow, token refresh, password reset, OTP verification |
| Users | CRUD, role assignment, permissions, status toggle |
| Fee Structures | CRUD, validation, amount calculations, discounts |
| Student Fees | Assignment, proration, due date calculation, late fee |
| Payments | Processing, gateway integration, refund, receipt |
| Examinations | Schedule, marks entry, result generation, revaluation |
| Reports | Generation, filtering, export (CSV/Excel/PDF) |
| Notifications | Create, broadcast, read tracking, audit log |

### faculty-dashboard Test Coverage
| Module | Test Areas |
|---|---|
| Auth | Login, register, refresh, logout, role check |
| Faculty | CRUD, profile, search, filter, dashboard stats |
| Attendance | Manual entry, face recognition, fingerprint, QR, corrections, analytics, reports |
| Timetable | Create, update, conflict detection, faculty/day views |
| Assignments | CRUD, publish, due dates, late submission |
| Homework | CRUD, attachments, due date tracking |
| Submissions | List, grade, feedback, attachment handling |
| Evaluations | Create, publish, revision tracking |
| Materials | CRUD, categories, download tracking, file validation |
| Holidays | CRUD, upcoming, department-specific |
| Reminders | CRUD, scheduling, notification channels |
| Faculty Transfers | Request, approval workflow, history |

### student-dashboard Test Coverage
| Module | Test Areas |
|---|---|
| Student Management | CRUD, search, filter, pagination, soft delete |
| Student History | Chronological timeline, pagination, all 6 history categories |
| Admission | Validation rules, duplicate prevention, course-level dedup |
| Course Schema | CRUD, search, statistics, toggle status, enrollments |
| Subject Management | CRUD under courses, validation |
| Batch Schema | CRUD, search, filter, sort, pagination, capacity validation |
| Student Allocation | Assign, deallocate, capacity check, duplicate prevention |
| Faculty Allocation | Assign, remove, overlap detection |
| Batch Transfer | Transactional transfer, history, capacity validation |
| Batch Analytics | Aggregate queries, capacity utilization, transfers |
| Admission Validation | Course eligibility, age/qualification/prerequisite checks |
| Batch Capacity | Capacity check, enrollment with atomic transactions |
| Student Data | Field validation, uniqueness, reference checks |

### parents-dashboard Test Coverage
| Module | Test Areas |
|---|---|
| Parent Management | CRUD, search, toggle status |
| Parent-Student Links | Create, list, update, delete |
| Emergency Contacts | CRUD under parent |
| Frontend Auth | Login validation, remember me, role check |
| Dashboard | Child overview, summary cards, attendance preview |
| Child Profile | Personal info, academic, attendance, fees, exams |
| Attendance View | Daily/weekly/monthly filters, calendar, charts |
| Fee Details | Installments, payment history, receipt preview |
| Exam Results | Subject-wise marks, grades, charts, report cards |
| Homework | Stats, filters, deadline tracking, detail modal |
| Notifications | Read/unread, categories, search, mark-as-read |
| Download Reports | Type filters, preview, mock download, history |
| Multiple Child Support | Context API, child switcher, dynamic data |

### Security Testing
- JWT token expiration and refresh
- Password strength validation
- OTP expiry and verification
- Role-based access control
- CORS configuration
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- Rate limiting enforcement
- File upload type and size validation
- API key and secret management

### Performance Testing
- Pagination limits and efficiency
- Database index utilization
- Query optimization (JOINs, subqueries)
- Connection pooling configuration
- Response compression
- Caching strategies
- Rate limit thresholds

## Error Handling Standards

All APIs follow a consistent error response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### HTTP Status Codes
| Code | Description |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error / Bad request |
| 404 | Resource not found |
| 409 | Conflict / Duplicate |
| 500 | Internal server error |

### PostgreSQL Error Code Mapping
| pg Code | Constraint | HTTP | Message |
|---|---|---|---|
| 23505 | Unique violation | 409 | Duplicate value |
| 23503 | Foreign key violation | 400 | Referenced record not found |
| 23514 | Check constraint | 400 | Validation failed |
| 22P02 | Invalid UUID | 400 | Invalid UUID format |

## License
Internal project — Coaching Institute Management System (CIMS)
