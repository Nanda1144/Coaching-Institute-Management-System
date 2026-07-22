# Evaluation

Manages evaluation of student submissions including marks, grading, feedback, and publishing workflow with draft/publish lifecycle.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/evaluations` | List evaluations (with query filters) | Yes |
| GET | `/api/evaluations/faculty/:facultyId` | Get evaluations conducted by a faculty | Yes |
| POST | `/api/evaluations` | Create a new evaluation entry | Yes |
| PATCH | `/api/evaluations/:id` | Update evaluation details | Yes |
| PATCH | `/api/evaluations/:id/publish` | Publish a draft evaluation | Yes |
| GET | `/api/evaluations/:id` | Get evaluation details by ID | Yes |

## Data Flow

Authenticated request → validated by `evaluation.validator.ts` → `evaluation.controller.ts` → `evaluation.service.ts` → Prisma CRUD on `Evaluation` linked to `AssignmentSubmission`. Support for draft/published/under_review/revised status flow. Stores previous versions in `previousVersion` JSON field.

## Dependencies

- `submission` module (each evaluation is linked to a submission)
- `faculty` module (evaluator reference)
- `auth` module (for `authenticate` middleware)

## Related Models

- `Evaluation`
- `AssignmentSubmission`, `Faculty`

## Error Codes

- `200` — Success
- `201` — Evaluation created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized to publish
- `404` — Evaluation or submission not found
- `409` — Evaluation already finalized
- `500` — Internal server error
