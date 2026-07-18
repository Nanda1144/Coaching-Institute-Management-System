# Homework

Manages homework tasks assigned by faculty to students, including creation, updates, file attachments, and status tracking.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/homework` | List homework entries (with query filters) | No |
| GET | `/api/homework/faculty/:facultyId` | Get homework for a specific faculty | No |
| GET | `/api/homework/:id` | Get homework details by ID | No |
| POST | `/api/homework` | Create a new homework entry | Yes |
| PATCH | `/api/homework/:id` | Update an existing homework entry | Yes |
| DELETE | `/api/homework/:id` | Soft-delete a homework entry | Yes |

## Data Flow

Read endpoints are public (no auth); write endpoints require authentication. Request → validated by `homework.validator.ts` → `homework.controller.ts` → `homework.service.ts` → Prisma CRUD on `Homework` with `HomeworkAttachment` relations. Supports status lifecycle (active/closed/cancelled/archived).

## Dependencies

- `faculty` module
- `auth` module (for `authenticate` middleware on writes)
- `upload` module (for file attachments)

## Related Models

- `Homework`, `HomeworkAttachment`
- `Department`, `Course`, `Batch`, `Subject`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Homework created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized
- `404` — Homework not found
- `500` — Internal server error
