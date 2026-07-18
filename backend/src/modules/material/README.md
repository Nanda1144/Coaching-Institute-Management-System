# Study Material

Repository for managing study materials including uploads, categorization, visibility control, and download tracking.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/materials` | List study materials (with query filters) | No |
| GET | `/api/materials/categories` | Get material categories | No |
| GET | `/api/materials/faculty/:facultyId` | Get materials uploaded by a faculty | No |
| GET | `/api/materials/:id` | Get material details by ID | No |
| POST | `/api/materials` | Create/upload a new study material | Yes |
| PATCH | `/api/materials/:id` | Update material details | Yes |
| DELETE | `/api/materials/:id` | Soft-delete a study material | Yes |
| POST | `/api/materials/:id/download` | Record a material download | Yes |

## Data Flow

Read endpoints are public; write endpoints require authentication. Request → validated by `material.validator.ts` → `material.controller.ts` → `material.service.ts` → Prisma operations on `StudyMaterial` with related `MaterialCategory`, `Chapter`, `MaterialAttachment`, and `MaterialDownload` models. Tracks total downloads/views and supports visibility scoping (PUBLIC, FACULTY_ONLY, STUDENTS_ONLY, BATCH_ONLY).

## Dependencies

- `faculty` module (uploader reference)
- `auth` module (for `authenticate` middleware)
- `upload` module (file storage)
- `Subject`, `Chapter`, `Batch` modules

## Related Models

- `StudyMaterial`, `MaterialCategory`, `MaterialAttachment`, `MaterialDownload`, `MaterialSearchLog`
- `Department`, `Course`, `Semester`, `Subject`, `Chapter`, `Batch`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Material created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized / visibility restricted
- `404` — Material not found
- `500` — Internal server error
