# Reminder

Manages assignment reminders and notifications including creation, scheduling, status tracking, and multi-channel delivery (email, SMS, push).

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/reminders/my/:facultyId` | Get reminders for a specific faculty | Yes |
| GET | `/api/reminders` | List all reminders (with query filters) | Yes |
| GET | `/api/reminders/:id` | Get reminder details by ID | Yes |
| POST | `/api/reminders` | Create a new reminder | Yes |
| PATCH | `/api/reminders/:id` | Update an existing reminder | Yes |
| PATCH | `/api/reminders/:id/sent` | Mark a reminder as sent | Yes |
| DELETE | `/api/reminders/:id` | Soft-delete a reminder | Yes |

## Data Flow

All routes require authentication. Request → validated by `reminder.validator.ts` → `reminder.controller.ts` → `reminder.service.ts` → Prisma CRUD on `AssignmentReminder`. Supports reminder types (upcoming_deadline, overdue, recurring, custom), notification channels (email/sms/push/all), and frequency patterns (once/daily/weekly/custom cron).

## Dependencies

- `assignment` module (reminders are linked to assignments)
- `faculty` module (creator reference)
- `auth` module (for `authenticate` middleware)

## Related Models

- `AssignmentReminder`
- `Assignment`, `Student`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Reminder created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized
- `404` — Reminder not found
- `500` — Internal server error
