# Assignment

Manages faculty assignments including creation, updates, visibility control, and filtering by faculty.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/assignments` | List assignments (with query filters) | Yes |
| GET | `/api/assignments/faculty/:facultyId` | Get assignments for a specific faculty | Yes |
| POST | `/api/assignments` | Create a new assignment | Yes |
| PATCH | `/api/assignments/:id` | Update an existing assignment | Yes |
| DELETE | `/api/assignments/:id` | Soft-delete an assignment | Yes |
| GET | `/api/assignments/:id` | Get assignment details by ID | Yes |

## Data Flow

Authenticated request → validated by `assignment.validator.ts` (Zod schemas for body + query) → `assignment.controller.ts` → `assignment.service.ts` → Prisma CRUD on `Assignment` with related `AssignmentAttachment` records. Supports visibility (visible/hidden/draft) and status (active/closed/cancelled/archived) management.

## Dependencies

- `faculty` module (for faculty relations)
- `auth` module (for `authenticate` middleware)
- `upload` module (for file attachments)

## Related Models

- `Assignment`, `AssignmentAttachment`
- `Department`, `Course`, `Semester`, `Subject`, `Batch`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Assignment created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized to modify
- `404` — Assignment not found
- `500` — Internal server error
