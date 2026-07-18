# RBAC & Security Risk Report

**Date:** 2026-07-18
**Analyst:** Cyber Security Architect & RBAC Specialist
**Scope:** All 7 backends + 4 frontends — complete permission audit

---

## Executive Summary

| Metric | Value |
|--------|:-----:|
| Total Backend Routes | 270+ |
| Routes with Auth Only (no role check) | 160+ (59%) |
| Routes with Auth + Role Check | 110+ (41%) |
| Routes with No Auth | 10 (3.7%) |
| Roles Defined | 8 (but only 3 used in route guards) |
| Privilege Escalation Vectors | 5 (Critical: 2, High: 3) |
| RBAC Coverage Score | **28/100** |

### Role Coverage by Backend

| Backend | Auth | Role Check | Bypass Risk | Score |
|---------|:----:|:----------:|:-----------:|:-----:|
| Admin Dashboard | ✅ 100% | ✅ 60% | Medium | 65/100 |
| Faculty Dashboard | ✅ 100% | ❌ 0% | High | 30/100 |
| Parents Dashboard | ✅ 100% | ❌ 0% | High | 25/100 |
| Student Management | ✅ 100% | ❌ 0% | Critical | 15/100 |
| Course Schema | ✅ 100% | ❌ 0% | Critical | 15/100 |
| Batch Schema | ✅ 100% | ❌ 0% | Critical | 15/100 |
| Admission Validation | ✅ 100% | ❌ 0% | Critical | 15/100 |
| **System** | **100%** | **20%** | **Critical** | **28/100** |

---

## Complete Permission Matrix

### Legend
- ✅ = Allowed (role has explicit permission)
- ⚠️ = Allowed but no role check (any authenticated user)
- ❌ = Not allowed (role explicitly blocked)
- ❓ = Undefined (role does not exist in enum but route uses it)

### 1. ADMIN DASHBOARD BACKEND

| Module | API Endpoint | Super Admin | Institute Owner | Branch Admin | Faculty | Student | Parent | Accountant | Receptionist |
|--------|-------------|:-----------:|:--------------:|:------------:|:-------:|:-------:|:------:|:----------:|:------------:|
| **Auth** | POST /api/auth/login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | POST /api/auth/register | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | GET /api/auth/me | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/auth/forgot-password | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | POST /api/auth/logout | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | GET /api/auth/sessions | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | DELETE /api/auth/sessions/:id | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | DELETE /api/auth/logout-all | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **Users** | GET /api/users | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/users/:id | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/users | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | PATCH /api/users/:id | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | DELETE /api/users/:id | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Dashboard** | GET /api/dashboard/stats | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | GET /api/dashboard/activity | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **Settings** | GET /api/settings | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | PATCH /api/settings | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **Fee Management** | GET /api/fee-structures | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | POST /api/fee-structures | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/student-fees | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | POST /api/student-fees | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | PUT /api/student-fees/:id | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | POST /api/payments | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | POST /api/payment-gateway/verify | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | GET /api/payment-gateway/history/:studentId | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/scholarships | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | PUT /api/scholarships/:id/approve | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/refunds | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | PUT /api/refunds/:id/approve | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | PUT /api/refunds/:id/process | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/receipts | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | POST /api/receipts/generate | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Examination** | GET /api/examinations | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/examinations | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | DELETE /api/examinations/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/marks-entry | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/marks-entry | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/results/generate/:examId | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/results/student/:studentId | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/results/report-card/:sId/:eId | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | POST /api/revaluations | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| | PUT /api/revaluations/:id/approve | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Notifications** | GET /api/notifications | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/notifications/sms | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/notifications/whatsapp | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | PUT /api/notifications/:id/read | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| | PUT /api/notifications/read-all | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **Announcements** | GET /api/announcements | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/announcements | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | DELETE /api/announcements/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Audit** | GET /api/audit-logs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/audit-logs/report | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Reports** | GET /api/reports/student/admission | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/reports/student/attendance | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/reports/fee/collection | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | GET /api/reports/fee/revenue | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | GET /api/reports/attendance/daily | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/exports/pdf | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | POST /api/exports/excel | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2. FACULTY DASHBOARD BACKEND

**WARNING:** ALL routes authenticated but **NONE check roles**. Every role can do everything.

| Module | API Endpoint | Any Authenticated User |
|--------|-------------|:---------------------:|
| **Auth** | POST /api/auth/login | ✅ Public |
| | POST /api/auth/register | ✅ Public |
| | POST /api/auth/refresh-token | ✅ Public |
| | POST /api/auth/logout | ✅ Public |
| | GET /api/auth/me | ⚠️ Any role |
| **Faculty** | GET /api/faculty | ⚠️ Any role |
| | POST /api/faculty | ⚠️ Any role |
| | PATCH /api/faculty/:id | ⚠️ Any role |
| | DELETE /api/faculty/:id | ⚠️ Any role |
| **Attendance** | GET /api/attendance | ⚠️ Any role |
| | POST /api/attendance | ⚠️ Any role |
| | DELETE /api/attendance/:id | ⚠️ Any role |
| | POST /api/attendance/face-recognition/session | ⚠️ Any role |
| | POST /api/attendance/fingerprint/mark | ⚠️ Any role |
| | POST /api/attendance/qr/session | ⚠️ Any role |
| | POST /api/attendance/corrections | ⚠️ Any role |
| | PATCH /api/attendance/corrections/:id/approve | ⚠️ Any role |
| | PATCH /api/attendance/corrections/:id/reject | ⚠️ Any role |
| **Timetable** | GET /api/timetable | ⚠️ Any role |
| | POST /api/timetable | ⚠️ Any role |
| | DELETE /api/timetable/:id | ⚠️ Any role |
| **Assignments** | GET /api/assignments | ⚠️ Any role |
| | POST /api/assignments | ⚠️ Any role |
| | DELETE /api/assignments/:id | ⚠️ Any role |
| **Homework** | GET /api/homework | ⚠️ Any role |
| | POST /api/homework | ⚠️ Any role |
| | DELETE /api/homework/:id | ⚠️ Any role |
| **Submissions** | GET /api/submissions | ⚠️ Any role |
| | POST /api/submissions | ⚠️ Any role |
| | PATCH /api/submissions/:id/grade | ⚠️ Any role |
| **Evaluations** | GET /api/evaluations | ⚠️ Any role |
| | POST /api/evaluations | ⚠️ Any role |
| | PATCH /api/evaluations/:id/publish | ⚠️ Any role |
| **Materials** | GET /api/materials | ⚠️ Any role |
| | POST /api/materials | ⚠️ Any role |
| | DELETE /api/materials/:id | ⚠️ Any role |
| **Upload** | POST /api/upload | ⚠️ Any role |
| | DELETE /api/upload/:id | ⚠️ Any role |
| **Holidays** | GET /api/holidays | ⚠️ Any role |
| | POST /api/holidays | ⚠️ Any role |
| | DELETE /api/holidays/:id | ⚠️ Any role |
| **Faculty Transfer** | GET /api/faculty-transfers | ⚠️ Any role |
| | POST /api/faculty-transfers | ⚠️ Any role |
| | PATCH /api/faculty-transfers/:id/status | ⚠️ Any role |
| **Dashboard** | GET /api/dashboard/admin | ⚠️ Any role |
| | GET /api/dashboard/faculty/:facultyId | ⚠️ Any role |

### 3. STUDENT MICROSERVICES (4 backends)

**WARNING:** ALL routes have `authenticate` only. Zero role checking. Identity is any valid JWT.

| Microservice | Route Count | Role Checked? | Risk |
|-------------|:-----------:|:-------------:|:----:|
| student-management | 11 routes | ❌ 0% | Any role can CRUD students |
| course-schema | 16 routes | ❌ 0% | Any role can CRUD courses/subjects |
| batch-schema | 24+ routes | ❌ 0% | Any role can manage batches |
| admission-validation | 9 routes | ❌ 0% | Any role can manage admissions |

### 4. PARENTS DASHBOARD BACKEND

**WARNING:** All routes `authenticate` only. No role checks.

| Module | API Endpoint | Any Authenticated User |
|--------|-------------|:---------------------:|
| **Parents** | POST /api/parents | ⚠️ Any role can create parents |
| | GET /api/parents | ⚠️ Any role can list parents |
| | PUT /api/parents/:id | ⚠️ Any role can update any parent |
| | DELETE /api/parents/:id | ⚠️ Any role can delete any parent |
| | PATCH /api/parents/:id/toggle-status | ⚠️ Any role can activate/deactivate |
| **Parent-Student Links** | POST /api/parents/:parentId/link-student | ⚠️ Any role can link students |
| | DELETE /api/parents/:parentId/unlink-student | ⚠️ Any role can unlink students |
| | GET /api/parents/:parentId/students | ⚠️ Any role can view linked students |
| **Student-Parent Links** | GET /api/students/:studentId/parents | ⚠️ Any role can view who is linked |
| **Dashboards** | GET /api/parents/:id/dashboard | ⚠️ Any role can view any parent's dashboard |
| | GET /api/parents/:id/reports | ⚠️ Any role can generate any parent's reports |

---

## RBAC Architecture Violations

### Violation 1: Role Enum vs Route Guard Mismatch

| Role | Defined In Enum | Used In Route Guards | Note |
|------|:--------------:|:-------------------:|------|
| Super Admin | ✅ (Faculty Prisma) | ❌ | Missing from Admin Mongoose enum |
| Admin | ✅ (Both schemas) | ✅ (Admin backend) | ✅ |
| Institute Owner | ❌ | ❌ | Not defined anywhere |
| Branch Admin | ❌ (only in m4-tasks) | ⚠️ (m4 export routes) | Missing from all main schemas |
| Faculty | ✅ (Both) | ✅ (Admin backend) | ✅ |
| Student | ✅ (Both) | ⚠️ (revaluation routes only) | Severely underused |
| Parent | ✅ (Both) | ❌ | Never checked in any route |
| Accountant | ❌ (Admin Mongoose) | ✅ (Admin fee routes) | **Critical — role doesn't exist** |
| Receptionist | ❌ | ❌ | Not defined anywhere |
| HOD | ✅ (Faculty Prisma) | ❌ | Defined but never used |
| CollegeManagement | ✅ (Admin Mongoose) | ❌ | Defined but never checked |

### Violation 2: Accountant Role — Undefined but Used
Route guards in admin backend use `authorize("Admin", "Accountant")` on 20+ fee-related routes. However, the `UserRole` enum in the Mongoose model only defines: `"Student" | "Parent" | "Faculty" | "CollegeManagement" | "Admin"`. **No user can be created with the "Accountant" role**, making those permissions effectively unreachable.

### Violation 3: SKIP_AUTH Dev Bypass in Production
The faculty dashboard backend has a `SKIP_AUTH=true` environment variable that completely bypasses JWT verification. In development mode, it auto-assigns `SUPER_ADMIN` role with `['*']` permissions. If deployed to production with this enabled, **any request is treated as SUPER_ADMIN**.

### Violation 4: Hardcoded Default JWT Secrets
The student dashboard 4 microservices and parents dashboard all fall back to `'default-jwt-secret-change-in-production'` if `JWT_SECRET` env variable is not set. This allows **anyone to forge valid JWTs**.

### Violation 5: Faculty Backend — All Routes, All Roles
The faculty backend has the most comprehensive Prisma schema (33 models) but zero role-based access control. Any authenticated user (including students and parents) can:
- Create/update/delete any faculty member
- Mark attendance for any class
- Enter marks for any student
- Create/grade assignments
- Upload materials
- Delete any timetable entry
- Approve/reject attendance corrections

---

## Privilege Escalation Vectors

### Vector 1: Student → Admin (Critical)
```
Attack: Student logs into student dashboard → obtains JWT →
       Calls GET /api/users/:id (no role check) →
       Discovers admin user IDs →
       Calls PATCH /api/users/:id (no role check) →
       Modifies own role to "Admin" →
       Gains full admin access

Impact: Complete system compromise
Fix: Add `authorize("Admin")` to all user management routes
```

### Vector 2: Any User → Fee Management (Critical)
```
Attack: Faculty/Parent generates their own JWT →
       Calls POST /api/payments (authorize "Admin","Accountant") →
       Cannot: role "Faculty" not in allowed list →
       But Accountant role is UNDEFINED in enum →
       Calls POST /api/fee-structures → blocked by "Admin" check →
       Calls GET /api/payment-gateway/history/:studentId (NO role check) →
       Views any student's payment history

Impact: Data breach of financial records
Fix: Add role check to payment gateway history/verify routes
```

### Vector 3: Any User → Faculty Backend Operations (Critical)
```
Attack: Any user with valid JWT →
       Navigates to faculty dashboard API →
       Calls POST /api/faculty (authenticate only) →
       Creates themselves as faculty →
       Calls POST /api/attendance (authenticate only) →
       Marks fake attendance →
       Calls PATCH /api/submissions/:id/grade (authenticate only) →
       Changes grades

Impact: Complete academic data manipulation
Fix: Add `authorize("Admin", "Faculty")` to ALL faculty backend routes
```

### Vector 4: Any User → Student Data (High)
```
Attack: Any user (parent, student, faculty) →
       Calls GET /api/students (authenticate only) →
       Gets list of all students →
       Calls DELETE /api/students/:id (authenticate only) →
       Deletes any student record (in-memory, but still)

Impact: Data destruction or breach
Fix: Add `authorize("Admin")` to destructive student operations
```

### Vector 5: Any User → Parent-Student Links (High)
```
Attack: Any user →
       Calls GET /api/parents (authenticate only) →
       Gets list of all parents →
       Calls POST /api/parents/:parentId/link-student (authenticate only) →
       Links themselves to any student →
       Views student's personal data via dashboard

Impact: Privacy breach, unauthorized child data access
Fix: Add `authorize("Admin")` to parent CRUD and link operations
```

---

## Frontend-Only Protection Issues

| Issue | Location | Risk |
|-------|----------|:----:|
| `RoleBasedRoute.tsx` — checks role in browser | Admin frontend route guard | Low — backend also checks |
| Faculty sidebar hides links based on role | Faculty frontend | **High** — backend has NO role checks, so frontend hiding doesn't prevent API access |
| Student dashboard has no auth at all | Student frontend | Critical — no frontend or backend protection |
| Parent routes use protected layout redirect | Parent frontend AuthContext | Medium — redirects to login but backend doesn't verify parent role |

---

## Security Risk Scoring

| Risk ID | Description | Severity | Likelihood | Impact | Score |
|:-------:|-------------|:--------:|:----------:|:------:|:-----:|
| R-01 | Accountant role undefined but used in guards | Critical | High | High | 9/10 |
| R-02 | Faculty backend — all routes, no role checks | Critical | High | High | 9/10 |
| R-03 | Student microservices — no role checks | Critical | High | High | 9/10 |
| R-04 | Hardcoded JWT secrets in 5 backends | Critical | Medium | High | 8/10 |
| R-05 | SKIP_AUTH dev bypass | Critical | Low | Critical | 8/10 |
| R-06 | User update without role check (admin backend) | High | High | Medium | 7/10 |
| R-07 | Payments history without role check | High | Medium | High | 7/10 |
| R-08 | Parent CRUD without role check | High | Medium | Medium | 6/10 |
| R-09 | Parent-student linking without role check | High | Medium | Medium | 6/10 |
| R-10 | Dashboard stats without role check | Medium | High | Low | 5/10 |
| R-11 | Settings read/write without role check | Medium | Medium | Medium | 5/10 |
| R-12 | Report generation without role check | Medium | Medium | Medium | 5/10 |
| R-13 | Session management without role hierarchy | Medium | Low | Medium | 4/10 |
| R-14 | CollegeManagement role never used | Low | Low | Low | 2/10 |

---

## Required Role → Route Mapping

### Recommended Role Hierarchy

```
SUPER_ADMIN
  └── INSTITUTE_OWNER
       └── ADMIN (Institute Admin / Branch Admin)
            ├── FACULTY
            │    ├── Can view own data
            │    ├── Can manage assigned attendance/timetable
            │    └── Cannot create/delete users
            ├── ACCOUNTANT
            │    ├── Fee management (view, collect, receipts)
            │    ├── Reports (fee-related only)
            │    └── No user management, no academic data
            ├── RECEPTIONIST
            │    ├── Student registration (create, not delete)
            │    ├── View basic student info
            │    └── No financial operations
            ├── STUDENT
            │    ├── View own profile, attendance, marks, fees
            │    └── No write operations except revaluation request
            └── PARENT
                 ├── View linked child's data only
                 └── No write operations
```

---

## Recommended Route Protection Plan

### Phase 1: Critical Fixes (P0)

| Backend | Routes to Fix | Add Role Check |
|---------|--------------|----------------|
| Faculty Dashboard | ALL 193 routes | `authorize("SUPER_ADMIN", "ADMIN", "FACULTY")` |
| Student Management | ALL 11 routes | Different per operation |
| Course Schema | ALL 16 routes | `authorize("ADMIN")` |
| Batch Schema | ALL 24 routes | `authorize("ADMIN", "FACULTY")` |
| Admission Validation | ALL 9 routes | `authorize("ADMIN", "RECEPTIONIST")` |
| Parents Dashboard | ALL 12 routes | `authorize("ADMIN", "PARENT")` |

### Phase 2: Missing Role Checks (P1)

| Backend | Routes to Fix | Current | Required |
|---------|--------------|---------|----------|
| Admin Backend | `GET/PATCH /api/users/:id` | No role check | `authorize("ADMIN")` or self only |
| Admin Backend | `GET /api/dashboard/stats` | No role check | `authorize("ADMIN")` |
| Admin Backend | `GET/PATCH /api/settings` | No role check | `authorize("ADMIN")` |
| Admin Backend | `GET /api/reports/*` | No role check | Per-report role |
| Admin Backend | `POST /api/payment-gateway/verify` | No role check | `authorize("ADMIN","ACCOUNTANT")` |
| Admin Backend | `GET /api/results/student/:studentId` | No role check | Student self or admin |

### Phase 3: Infrastructure (P2)

| Fix | Priority |
|-----|:--------:|
| Add Accountant role to Mongoose UserRole enum | High |
| Add InstituteOwner, BranchAdmin, Receptionist roles to all enums | High |
| Replace hardcoded JWT secrets with env-only (no fallback) | Critical |
| Remove SKIP_AUTH or guard with production check | Critical |
| Add rate limiting on login endpoints | Medium |
| Add audit logging on all role-checked routes | Medium |

---

## RBAC Coverage Score Detail

| Category | Weight | Score | Reason |
|----------|:------:|:-----:|--------|
| Role Enum Completeness | 15 | 4/15 | 8 roles defined across schemas, only 3 used in guards |
| Route Auth Coverage | 15 | 15/15 | 100% of routes have authentication |
| Route Role Check Coverage | 20 | 4/20 | Only 20% of routes have role checks |
| Role Hierarchy | 10 | 0/10 | No hierarchy — all checks are flat string matches |
| Frontend-Backend Consistency | 10 | 3/10 | Faculty: frontend hides but backend allows |
| Privilege Escalation Prevention | 15 | 2/15 | 5 escalation vectors found |
| JWT/Session Security | 10 | 2/10 | Hardcoded secrets, no refresh rotation in most |
| Principle of Least Privilege | 5 | 1/5 | Most routes grant more access than needed |
| **Total** | **100** | **28/100** | |
