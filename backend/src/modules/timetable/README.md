# Timetable

Manages faculty class schedules including retrieval by faculty and day-of-week filtering.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/timetable` | List timetable entries (with query filters) | Yes |
| GET | `/api/timetable/faculty/:facultyId` | Get timetable entries for a specific faculty | Yes |
| GET | `/api/timetable/faculty/:facultyId/day/:dayOfWeek` | Get timetable for a faculty on a specific day | Yes |

## Data Flow

Authenticated request → `timetable.validator.ts` validates query params → `timetable.controller.ts` → `timetable.service.ts` → Prisma queries `Timetable` joined with `Faculty`, `Subject`, `Batch`, and `Classroom` relations.

## Dependencies

- `faculty` module (for faculty reference)
- `auth` module (for `authenticate` middleware)

## Related Models

- `Timetable`
- `Faculty`, `Subject`, `Batch`, `Classroom`

## Error Codes

- `200` — Success
- `400` — Validation error
- `401` — Unauthenticated
- `404` — Faculty not found / no timetable entries
- `500` — Internal server error
