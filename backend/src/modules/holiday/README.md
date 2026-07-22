# Holiday

Manages holiday records including creation, updates, and retrieval of upcoming holidays within a configurable day range.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/holidays/upcoming/:days` | Get upcoming holidays within the next N days | Yes |
| GET | `/api/holidays` | List all holidays (with query filters) | Yes |
| GET | `/api/holidays/:id` | Get holiday details by ID | Yes |
| POST | `/api/holidays` | Create a new holiday record | Yes |
| PATCH | `/api/holidays/:id` | Update an existing holiday | Yes |
| DELETE | `/api/holidays/:id` | Soft-delete a holiday | Yes |

## Data Flow

All routes require authentication. Request → validated by `holiday.validator.ts` → `holiday.controller.ts` → `holiday.service.ts` → Prisma CRUD on `Holiday`. Supports multi-day holidays, department-specific applicability, and academic year association.

## Dependencies

- `faculty` module (for createdBy/updatedBy relations)
- `auth` module (for `authenticate` middleware)

## Related Models

- `Holiday`
- `Faculty` (creator/updater)

## Error Codes

- `200` — Success
- `201` — Holiday created
- `400` — Validation error / invalid date range
- `401` — Unauthenticated
- `404` — Holiday not found
- `409` — Overlapping holiday exists
- `500` — Internal server error
