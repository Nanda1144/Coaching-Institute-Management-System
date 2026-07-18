# Upload

Handles file uploads using multer middleware. Stores files on local disk and records metadata in the database.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| POST | `/api/uploads` | Upload a single file (multipart/form-data) | Yes |
| GET | `/api/uploads` | List all uploaded files (with query filters) | Yes |
| DELETE | `/api/uploads/:id` | Delete an uploaded file record and its file | Yes |

## Data Flow

Authenticated request → `multer` middleware parses multipart form data and saves file to `uploads/` directory → validated by `upload.validator.ts` → `upload.controller.ts` → `upload.service.ts` → Prisma creates an `Upload` record with original name, mime type, size, extension, URL path, and optional module association metadata.

## Dependencies

- `auth` module (for `authenticate` middleware)
- `multer` — multipart form data parsing and file storage

## Related Models

- `Upload`

## Error Codes

- `200` — Success
- `201` — File uploaded
- `400` — Validation error / no file provided / file too large
- `401` — Unauthenticated
- `404` — Upload record not found
- `415` — Unsupported file type
- `500` — Internal server error
