# Attendance

Provides attendance tracking via manual entry, face recognition, fingerprint scanning, and QR code scanning. Includes correction request workflows.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/attendance/today` | Get today's attendance records | Yes |
| GET | `/api/attendance/stats` | Get attendance statistics | Yes |
| GET | `/api/attendance` | List attendance records (with query filters) | Yes |
| POST | `/api/attendance` | Create a new attendance record | Yes |
| GET | `/api/attendance/:id` | Get attendance record by ID | Yes |
| PATCH | `/api/attendance/:id` | Update an attendance record | Yes |
| DELETE | `/api/attendance/:id` | Delete an attendance record | Yes |
| POST | `/api/attendance/face-recognition/session` | Create a face recognition attendance session | Yes |
| PATCH | `/api/attendance/face-recognition/:sessionId/verify` | Verify a face recognition session | Yes |
| GET | `/api/attendance/face-recognition/:id` | Get face recognition session details | Yes |
| POST | `/api/attendance/fingerprint/mark` | Mark attendance via fingerprint | Yes |
| PATCH | `/api/attendance/fingerprint/:sessionId/verify` | Verify a fingerprint session | Yes |
| GET | `/api/attendance/fingerprint/:id` | Get fingerprint session details | Yes |
| POST | `/api/attendance/qr/session` | Create a QR code attendance session | Yes |
| POST | `/api/attendance/qr/scan` | Scan a QR code to mark attendance | Yes |
| GET | `/api/attendance/qr/active` | Get all active QR sessions | Yes |
| GET | `/api/attendance/qr/:id` | Get QR session details | Yes |
| POST | `/api/attendance/corrections` | Request an attendance correction | Yes |
| PATCH | `/api/attendance/corrections/:id/approve` | Approve a correction request | Yes |
| PATCH | `/api/attendance/corrections/:id/reject` | Reject a correction request | Yes |
| GET | `/api/attendance/corrections` | List all correction requests | Yes |

## Data Flow

All routes require authentication first. For manual entry → validated via Zod schema → controller → service → Prisma creates/modifies `Attendance`. For biometric methods (face/fingerprint/QR) → dedicated service files handle device integration, session management, and status tracking. Corrections flow through `AttendanceCorrection` with approval/rejection workflow.

## Dependencies

- `faculty` module (for authenticated user context)
- External: face recognition SDK, fingerprint scanner SDK, QR code generator
- `multer` — for potential image upload during face recognition

## Related Models

- `Attendance`, `FaceRecognition`, `FingerprintAttendance`, `QRSession`, `QRScan`, `AttendanceCorrection`
- `Student`, `Subject`, `Batch`, `Classroom`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Attendance record / session created
- `400` — Validation error / invalid QR token / biometric mismatch
- `401` — Unauthenticated
- `404` — Record / session not found
- `409` — Duplicate attendance / session expired
- `500` — Internal server error
