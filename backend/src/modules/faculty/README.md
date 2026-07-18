# Faculty

Manages faculty profiles including creation, updates, profile view, and dashboard statistics for administrative use.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/faculty` | List all faculty members (with query filtering) | No |
| GET | `/api/faculty/profile` | Get the authenticated faculty's own profile | Yes |
| GET | `/api/faculty/dashboard` | Get dashboard statistics for the authenticated faculty | Yes |
| GET | `/api/faculty/:id` | Get a specific faculty member by ID | No |
| POST | `/api/faculty` | Create a new faculty member | Yes |
| PATCH | `/api/faculty/:id` | Update an existing faculty member | Yes |
| DELETE | `/api/faculty/:id` | Soft-delete a faculty member | Yes |

## Data Flow

Request → `faculty.validator.ts` (Zod schema validation for query, body) → `faculty.controller.ts` → `faculty.service.ts` → Prisma ORM queries PostgreSQL. Service layer handles business logic like password hashing on create, computed fields (fullName), and soft-delete patterns.

## Dependencies

- `auth` module (reuses `authenticate` middleware)
- `bcrypt` — password hashing during creation
- `jsonwebtoken` — for auth middleware

## Related Models

- `Faculty`
- `AssignmentLog` (audit trail)

## Error Codes

- `200` — Success
- `201` — Faculty created
- `400` — Validation error
- `401` — Unauthenticated
- `404` — Faculty not found
- `409` — Duplicate email/phone/employeeId
- `500` — Internal server error
