# Auth

Handles user authentication and authorization including login, registration, token refresh, and session management for faculty users.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| POST | `/api/auth/login` | Authenticate user and return JWT tokens | No |
| POST | `/api/auth/register` | Register a new faculty account | No |
| POST | `/api/auth/refresh-token` | Refresh an expired access token | No |
| POST | `/api/auth/logout` | Invalidate refresh token and clear session | No |
| GET | `/api/auth/me` | Get currently authenticated user's profile | Yes |

## Data Flow

Client sends credentials → `auth.validator.ts` validates input via Zod schema → `auth.controller.ts` delegates to `auth.service.ts` → service hashes/compares passwords with bcrypt, generates JWT tokens → returns tokens and user data. Protected routes use `authenticate` middleware to verify the JWT before proceeding.

## Dependencies

- `faculty` module (for user profile data)
- `bcrypt` — password hashing
- `jsonwebtoken` — JWT generation and verification
- `cookie-parser` — HTTP cookie parsing

## Related Models

- `Faculty` (credentials, role, permissions)

## Error Codes

- `201` — Registration successful
- `400` — Validation error / invalid input
- `401` — Invalid credentials / unauthenticated
- `403` — Insufficient permissions
- `409` — Email/username already exists
- `500` — Internal server error
