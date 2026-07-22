# Dashboard

Provides aggregated analytics and statistics for admin overview and faculty-specific performance dashboards.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/dashboard/admin` | Get overall admin dashboard statistics | Yes |
| GET | `/api/dashboard/faculty/:facultyId` | Get faculty-specific dashboard statistics | Yes |
| GET | `/api/dashboard/recent-activities` | Get recent platform activities | Yes |

## Data Flow

All routes require authentication. Request → `dashboard.controller.ts` → `dashboard.controller.ts` aggregates data by querying multiple tables (Faculty, Attendance, Assignments, Submissions, etc.) via Prisma. Admin stats include counts across the entire institution; faculty stats are scoped to a specific faculty's data and activity.

## Dependencies

- `faculty`, `attendance`, `assignment`, `submission`, `evaluation`, `material` modules (data aggregation)
- `auth` module (for `authenticate` middleware)

## Related Models

- Aggregated queries across: `Faculty`, `Attendance`, `Assignment`, `AssignmentSubmission`, `Evaluation`, `StudyMaterial`, `Student`, `Batch`

## Error Codes

- `200` — Success
- `401` — Unauthenticated
- `403` — Insufficient permissions
- `404` — Faculty not found
- `500` — Internal server error
