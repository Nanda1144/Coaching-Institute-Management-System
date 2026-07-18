# Faculty Transfer

Manages faculty transfer requests between branches/departments including creation, status approval workflow, and transfer history tracking.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/faculty-transfers` | List all transfer requests (with query filters) | Yes |
| GET | `/api/faculty-transfers/faculty/:facultyId` | Get transfers for a specific faculty | Yes |
| GET | `/api/faculty-transfers/:id` | Get transfer request details by ID | Yes |
| POST | `/api/faculty-transfers` | Create a new transfer request | Yes |
| PATCH | `/api/faculty-transfers/:id/status` | Update transfer request status (approve/reject) | Yes |

## Data Flow

All routes require authentication. Request → validated by `faculty-transfer.validator.ts` → `faculty-transfer.controller.ts` → `faculty-transfer.service.ts` → Prisma CRUD on `FacultyTransfer`. Status field supports lifecycle tracking (pending → approved/rejected). On approval, the service updates the faculty's `branch`, `department`, and `transferHistory` JSON field.

## Dependencies

- `faculty` module (faculty data and transfer history)
- `auth` module (for `authenticate` middleware)

## Related Models

- `FacultyTransfer`
- `Faculty` (source, destination, and performed-by relations)

## Error Codes

- `200` — Success
- `201` — Transfer request created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized to approve
- `404` — Transfer request or faculty not found
- `409` — Faculty already has pending transfer
- `500` — Internal server error
