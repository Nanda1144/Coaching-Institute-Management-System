# PHASE 2 – IMPLEMENTATION PLAN

**Generated**: July 21, 2026
**Project**: Coaching Institute Management System (CIMS)

---

## PRIORITY LEVELS

| Level | Label | Criteria | Target Completion |
|---|---|---|---|
| P0 | **Critical** | System cannot function without this | 100% |
| P1 | **High** | Major feature missing / security vulnerability | 100% |
| P2 | **Medium** | Important usability / functionality improvement | 80%+ |
| P3 | **Low** | Nice-to-have / refactoring / polish | 50%+ |

---

## TRACK A: CRITICAL (P0) — WEEK 1-2

### A1: Wire All Dashboards to Real API Data
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Replace AdminDashboard stats with `/api/dashboard/admin` | `src/pages/Dashboard.tsx` | 4h |
| Replace FacultyDashboard stats with `/api/dashboard/faculty` | `src/pages/Dashboard.tsx` | 3h |
| Replace StudentDashboard stats with `/api/dashboard/student` | `src/pages/Dashboard.tsx` | 3h |
| Replace ParentDashboard stats with `/api/dashboard/parent` | `src/pages/Dashboard.tsx` | 3h |
| Update dashboard service to return real aggregated data | `backend/src/modules/dashboard/dashboard.service.ts` | 6h |
| Fix orphaned dashboard validator | `backend/src/modules/dashboard/dashboard.validator.ts` | 1h |

### A2: Wire `requirePermission` Middleware to All Routes
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Add `requirePermission` to all faculty routes | `faculty.routes.ts` | 2h |
| Add `requirePermission` to all student routes | `student.routes.ts` | 1h |
| Add `requirePermission` to all attendance routes | `attendance.routes.ts` | 2h |
| Add `requirePermission` to all exam, fee, timetable routes | Multiple route files | 3h |
| Add `requirePermission` to all assignment, material routes | Multiple route files | 2h |
| Add `requirePermission` to all notification, upload routes | Multiple route files | 1h |

### A3: Add Cascade Rules to All Prisma Relations
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Define onDelete: Cascade|SetNull|Restrict on all 100+ relations | `prisma/schema.prisma` | 6h |
| Create and run migration | Prisma CLI | 2h |
| Verify no data loss | Test scripts | 2h |

### A4: Remove SKIP_AUTH Backdoor in Production
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Add production check to block SKIP_AUTH | `auth.middleware.ts` | 0.5h |
| Add env validation to crash if SKIP_AUTH in production | `config/env.ts` | 0.5h |

### A5: Add File Upload Validation Middleware
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Create MIME type + magic byte validator | `shared/middleware/validate-file.middleware.ts` | 2h |
| Wire into upload routes | `upload.routes.ts` | 1h |

### A6: Implement Audit Logging Middleware
**Estimated Completion: 0% → 100%**
| Sub-task | Files | Effort |
|---|---|---|
| Create audit middleware that logs all CUD operations | `shared/middleware/audit.middleware.ts` | 4h |
| Wire into all routes | Central middleware | 2h |

---

## TRACK B: HIGH (P1) — WEEK 2-4

### B1: Complete Missing CRUD Endpoints
**Estimated Completion: 0% → 100%**
| Endpoint | Module | Effort |
|---|---|---|
| `GET /api/exams/:id` | exam | 1h |
| `POST /api/fees/transaction` | fee | 2h |
| `PATCH /api/fees/:id` | fee | 1h |
| `DELETE /api/fees/:id` | fee | 1h |
| `GET /api/parents/:id` | parent | 1h |
| `PATCH /api/notifications/:id/read` | notification | 1h |
| `POST /api/notifications/broadcast` | notification | 2h |
| `DELETE /api/faculty-transfers/:id` | faculty-transfer | 1h |
| `GET /api/uploads/:id`, `PATCH /api/uploads/:id` | upload | 1.5h |

### B2: Fix Service-Layer Bugs
**Estimated Completion: 0% → 100%**
| Bug | File | Effort |
|---|---|---|
| Remove hardcoded dateOfBirth/gender in create() | `student.service.ts` | 0.5h |
| Add missing updatable fields to update() | `student.service.ts` | 1h |
| Fix OR search logic in getAll() | `parent.service.ts` | 0.5h |
| Wire `_userId` to `created_by_id` in create() | `submission.service.ts` | 0.5h |
| Implement JWT blacklist on logout | `auth.service.ts` | 2h |
| Pass userId in delete() soft delete | `exam.service.ts`, `parent.service.ts` | 0.5h |

### B3: Add Missing Soft Delete Fields to 16 Models
**Estimated Completion: 0% → 100%**
| Models | Effort |
|---|---|
| AssignmentLog, FaceRecognition, FingerprintAttendance, QRSession, QRScan, AttendanceCorrection, Department, Course, Semester, AssignmentAttachment, HomeworkAttachment, SubmissionAttachment, MaterialAttachment, MaterialDownload, MaterialSearchLog | 4h |

### B4: Implement JWT Blacklist on Logout
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Store invalidated tokens in DB with TTL | 2h |
| Check blacklist on every authenticated request | 1h |

### B5: Add Missing Indexes and Unique Constraints
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Add compound unique constraints (attendance, timetable) | 2h |
| Add indexes for all FK fields | 2h |

### B6: Implement Ownership/Data-Scoping Middleware
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Create middleware that filters by faculty batch/student ID | 3h |
| Apply to all student-facing routes | 2h |

---

## TRACK C: HIGH (P1) — WEEK 3-5

### C1: Implement Student Registration + Approval Flow
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| StudentRegistrationRequest model exists - create endpoints | `student-auth/` | 3h |
| Create faculty approval dashboard view | Frontend | 4h |
| Create student registration form page | Frontend | 3h |
| Wire notification dispatch on status change | Both | 2h |

### C2: Implement Forgot/Reset Password Flow
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Create forgot-password endpoint | `auth/` | 2h |
| Create reset-password endpoint | `auth/` | 2h |
| Create forgot password UI | Frontend | 2h |
| Create reset password UI | Frontend | 2h |

### C3: Implement Reports Module
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Create reports controller, service, routes, validator | `backend/src/modules/reports/` | 8h |
| Implement 5 core reports (attendance, fee, exam, faculty, student) | 6h |
| Create reports UI pages (AdminReportsPage overhaul) | Frontend | 6h |
| Add PDF/Excel export | Both | 4h |

### C4: Implement Notification Delivery
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Create email service (Nodemailer/SendGrid) | 3h |
| Create SMS service (Twilio) | 2h |
| Wire notification.broadcast to send actual email/SMS | 3h |
| Add notification read tracking UI | Frontend | 2h |
| Add real-time notifications (WebSocket polling) | Both | 4h |

### C5: Wire Non-Functional Buttons to API Calls
**Estimated Completion: 0% → 100%**
| Page | Buttons | Effort |
|---|---|---|
| DepartmentsPage | Add Department | 1h |
| CoursesPage | Add Course | 1h |
| AssignmentsPage | New Assignment | 1h |
| FacultyMaterialsPage | Upload, Delete | 1.5h |

---

## TRACK D: HIGH (P1) — WEEK 4-6

### D1: Implement Fee Module Full CRUD + Payment Integration
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Complete fee CRUD endpoints | 3h |
| Create payment module (Razorpay/PhonePe/Stripe) | 8h |
| Create fee UI pages (AdminFeesPage overhaul) | 4h |
| Create student fee status page overhaul | 2h |

### D2: Implement Certificate Module
**Estimated Completion: 0% → 100%**
| Sub-task | Effort |
|---|---|
| Create certificate controller, service, routes | 4h |
| Certificate PDF generation | 4h |
| Create certificate UI | 2h |

### D3: Add Error States to All Frontend Pages
**Estimated Completion: 0% → 100%**
| Page | Fix | Effort |
|---|---|---|
| FacultyMaterialsPage | Replace silent catch with error UI | 1h |
| All student/parent pages | Add loading/error/empty states | 6h |
| Admin pages | Add loading/error/empty states | 4h |

---

## TRACK E: MEDIUM (P2) — WEEK 5-7

### E1: Replace All Mock Data Files with Real API Calls
**Estimated Completion: 0% → 100%**
| Data File | Pages Using It | Effort |
|---|---|---|
| `attendanceData.ts` | AttendanceDashboard, etc. | 3h |
| `attendanceHistoryData.ts` | AttendanceHistoryPage | 2h |
| `attendanceReportsData.ts` | AttendanceReportsPage | 2h |
| `holidayData.ts` | HolidayManagementPage | 2h |
| `calendarData.ts` | InteractiveCalendarPage | 2h |
| `searchData.ts` | FacultySearchPage | 1.5h |
| `faceRecognitionData.ts` | FaceRecognitionPage | 1h |

### E2: Fix StudentProfilePage to Fetch from API
**Estimated Completion: 0% → 100%**
Replace hardcoded profile with real API data | 2h

### E3: Fix FacultyMarksPage Subject List
**Estimated Completion: 0% → 100%**
Fetch subjects from `/api/faculty/:id/subjects` | 1h

### E4: Fix SignupPage to Call Real API
**Estimated Completion: 0% → 100%**
Wire to POST `/api/auth/register` | 2h

### E5: Add 404 Catch-All Route
**Estimated Completion: 0% → 100%**
Create NotFound component + route | 1h

### E6: Add Dark Mode Implementation
**Estimated Completion: 0% → 100%**
Toggle exists in Navbar - wire to actual theme switching | 3h

---

## TRACK F: MEDIUM (P2) — WEEK 6-8

### F1: Add 20 Missing SRS Database Entities
**Estimated Completion: 0% → 100%**
| Entity | Effort |
|---|---|
| Institute, Branch, Role, Permission | 4h |
| Marks, Grade | 2h |
| FeeInvoice, Payment, Receipt, Scholarship | 4h |
| SMSQueue, EmailQueue | 2h |
| SystemConfiguration, AcademicYear | 2h |
| Announcement, Certificate | 2h |
| ActivityLog, LoginHistory, BackupHistory | 3h |

### F2: Create Institute Settings Page
**Estimated Completion: 0% → 100%**
Backend + frontend for institute configuration | 4h

### F3: Create Role Management Page
**Estimated Completion: 0% → 100%**
Backend + frontend for role/permission CRUD | 4h

### F4: Create User Management Page
**Estimated Completion: 0% → 100%**
Backend + frontend for user CRUD | 4h

### F5: Create Activity Logs Page
**Estimated Completion: 0% → 100%**
View audit logs with filters | 4h

### F6: Create Analytics Dashboard
**Estimated Completion: 0% → 100%**
Charts, trends, and insights | 6h

---

## TRACK G: LOW (P3) — WEEK 8-10

### G1: Performance Optimization
| Sub-task | Effort |
|---|---|
| Fix 9 N+1 query patterns | 6h |
| Add Redis caching layer | 4h |
| Lazy load heavy dependencies (three.js, xlsx, react-icons) | 3h |
| Memoize AuthContext | 1h |
| Extract inline components from App.tsx | 2h |
| Add React.memo to pure components | 3h |

### G2: Add Testing
| Sub-task | Effort |
|---|---|
| Unit tests for backend services (Jest) | 16h |
| Unit tests for frontend components (Vitest) | 16h |
| Integration tests for API endpoints | 12h |
| E2E tests for critical paths (Playwright) | 16h |

### G3: Code Quality
| Sub-task | Effort |
|---|---|
| Add barrel exports | 4h |
| Remove dead mock data files | 2h |
| Fix mixed import patterns | 2h |
| Remove unused `sendPaginated` | 0.5h |

### G4: UX Polish
| Sub-task | Effort |
|---|---|
| Add mobile sidebar backdrop overlay | 1h |
| Add page transition animations | 2h |
| Responsive design fixes | 4h |

---

## TRACK H: RBAC (P1-P2) — WEEK 2-4 (Parallel)

### H1: Implement Role-Based Access Control (Complete)
**Estimated Completion: 0% → 100%**

#### SUPER ADMIN (Full Access)
| Feature | Status | Action |
|---|---|---|
| Dashboard | ✅ Has page | Wire to API |
| Students | ✅ Has page | Wire CRUD |
| Faculty | ✅ Has page | Wire CRUD |
| Parents | ✅ Has page | Wire CRUD |
| Departments | ✅ Has page | Wire CRUD |
| Courses | ✅ Has page | Wire CRUD |
| Batches | ✅ Has page | Wire CRUD |
| Attendance | ✅ Has page | Wire CRUD |
| Face Recognition | ✅ Has page | Wire to API |
| Fingerprint Attendance | ✅ Has page | Wire to API |
| QR Attendance | ✅ Has page | Wire to API |
| Assignments | ✅ Has page | Wire CRUD |
| Study Materials | ✅ Has page | Wire CRUD |
| Exams | ✅ Has page | Wire CRUD |
| Marks | ✅ Has page | Wire CRUD |
| Certificates | ❌ Missing | Build module |
| Fee Management | ✅ Has page | Wire CRUD |
| Payments | ❌ Missing | Build module |
| Reports | ⚠️ Static | Build real reports |
| Notifications | ⚠️ Partial | Wire delivery |
| Institute Settings | ❌ Missing | Build module |
| Role Management | ❌ Missing | Build module |
| User Management | ❌ Missing | Build module |
| Analytics | ❌ Missing | Build module |
| Activity Logs | ❌ Missing | Build module |
| Profile | ✅ Has page | Wire to API |

#### FACULTY PANEL (Restricted Access)
| Feature | Status | Action |
|---|---|---|
| Dashboard | ✅ Has page | Wire to API |
| Own Profile | ✅ Has page | Wire to API |
| Assigned Students | ✅ Has page | Wire to API |
| Assigned Batches | ✅ Has page | Wire to API |
| Assigned Courses | ✅ Has page | Wire to API |
| Attendance | ✅ Has page | Wire to API |
| Assignments | ✅ Has page | Wire CRUD |
| Study Materials | ✅ Has page | Wire CRUD |
| Exam Marks Entry | ✅ Has page | Wire to API |
| Notifications | ✅ Has page | Wire to API |
| Timetable | ✅ Has page | Wire to API |
| Leave Requests | ❌ Missing | Build module |
| **Restricted: Delete Students** | ✅ Already restricted | Verify |
| **Restricted: Delete Faculty** | ✅ Already restricted | Verify |
| **Restricted: Access Fees** | ✅ Already restricted | Verify |
| **Restricted: Settings** | ✅ Already restricted | Verify |
| **Restricted: User Management** | ✅ Already restricted | Verify |

#### STUDENT PANEL (Restricted Access)
| Feature | Status | Action |
|---|---|---|
| Dashboard | ✅ Has page | Wire to API |
| Own Profile | ⚠️ Hardcoded | Wire to API |
| Own Attendance | ⚠️ Static data | Wire to API |
| Own Timetable | ✅ Has page | Wire to API |
| Own Assignments | ⚠️ Simulated | Wire to API |
| Submit Assignments | ⚠️ Simulated upload | Wire to API |
| Study Materials | ✅ Has page | Wire to API |
| Exam Schedule | ✅ Has page | Wire to API |
| Own Results | ✅ Has page | Wire to API |
| Own Certificates | ❌ Missing | Build module |
| Own Fee Details | ✅ Has page | Wire to API |
| Notifications | ✅ Has page | Wire to API |
| Course Details | ❌ Missing | Build module |
| Batch Details | ❌ Missing | Build module |
| **Restricted: Edit others** | ✅ Already restricted | Verify |
| **Restricted: See others** | ✅ Already restricted | Verify |
| **Restricted: Manage faculty** | ✅ Already restricted | Verify |
| **Restricted: Manage settings** | ✅ Already restricted | Verify |

#### PARENT PANEL (Restricted Access)
| Feature | Status | Action |
|---|---|---|
| Dashboard | ✅ Has page | Wire to API |
| Child Profile | ✅ Has page | Wire to API |
| Child Attendance | ✅ Has page | Wire to API |
| Child Timetable | ✅ Has page | Wire to API |
| Child Assignments | ✅ Has page | Wire to API |
| Child Materials | ✅ Has page | Wire to API |
| Child Results | ✅ Has page | Wire to API |
| Child Fee Details | ✅ Has page | Wire to API |
| Notifications | ✅ Has page | Wire to API |
| Own Profile | ✅ Has page | Wire to API |

---

## IMPLEMENTATION SEQUENCE (Recommended Order)

```
WEEK 1  ── A1 (Dashboard API wiring) + A2 (Permission RBAC) + A4 (SKIP_AUTH fix)
WEEK 2  ── A3 (Cascade rules) + A5 (File validation) + A6 (Audit logging) + B1 (CRUD endpoints) + B2 (Bug fixes) + B6 (Ownership)
WEEK 3  ── B3 (Soft delete) + B4 (JWT blacklist) + B5 (Indexes) + H1 (RBAC complete)
WEEK 4  ── C1 (Student registration) + C2 (Forgot password) + C5 (Wire buttons)
WEEK 5  ── C3 (Reports module) + C4 (Notification delivery)
WEEK 6  ── D1 (Fee CRUD + Payments) + D2 (Certificates) + D3 (Error states)
WEEK 7  ── E1 (Remove mock data) + E2-E5 (Frontend fixes) + E6 (Dark mode)
WEEK 8  ── F1 (Missing DB entities) + F2 (Institute settings)
WEEK 9  ── F3-F6 (Role/User mgmt, Activity logs, Analytics)
WEEK 10 ── G1 (Performance) + G2 (Testing start)
WEEK 11 ── G2 (Testing continue) + G3 (Code quality)
WEEK 12 ── G4 (UX polish) + Final integration testing
```

---

## COMPLETION ESTIMATES PER MODULE

| Module | Current | After Phase 2 | After Phase 3 |
|---|---|---|---|
| **Auth Module** | 70% | 100% | 100% |
| **Faculty Module** | 90% | 100% | 100% |
| **Student Module** | 60% | 90% | 100% |
| **Parent Module** | 50% | 85% | 100% |
| **Attendance Module** | 85% | 95% | 100% |
| **Timetable Module** | 90% | 95% | 100% |
| **Assignment Module** | 90% | 95% | 100% |
| **Homework Module** | 85% | 95% | 100% |
| **Evaluation Module** | 85% | 95% | 100% |
| **Material Module** | 85% | 95% | 100% |
| **Exam Module** | 60% | 90% | 100% |
| **Fee Module** | 40% | 80% | 100% |
| **Notification Module** | 40% | 80% | 100% |
| **Dashboard Module** | 40% | 90% | 100% |
| **Upload Module** | 50% | 90% | 100% |
| **Reports Module** | 0% | 60% | 100% |
| **Certificate Module** | 0% | 50% | 100% |
| **Payment Module** | 0% | 50% | 100% |
| **RBAC** | 30% | 80% | 100% |
| **Frontend Dashboards** | 40% | 90% | 100% |
| **Student Pages** | 60% | 90% | 100% |
| **Parent Pages** | 50% | 85% | 100% |
| **Admin Pages** | 65% | 90% | 100% |
| **Error Handling** | 60% | 90% | 100% |
| **Testing** | 0% | 40% | 80% |
| **Security** | 40% | 85% | 95% |
| **Performance** | 30% | 60% | 85% |

---

## OVERALL PROJECT COMPLETION

| Phase | Target | After Phase 2 | After Phase 3 | After Phase 4 |
|---|---|---|---|---|
| **Functional Completeness** | 100% | 75% | 90% | 95% |
| **Production Readiness** | 100% | 65% | 80% | 90% |
| **Security Posture** | 100% | 70% | 85% | 95% |
| **Test Coverage** | 80% | 20% | 50% | 70% |
| **Overall** | **100%** | **~65%** | **~80%** | **~90%** |
