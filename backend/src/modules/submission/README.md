# Submission

Handles student assignment submissions and faculty grading workflow.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|:---:|
| GET | `/api/submissions` | List submissions (with query filters) | Yes |
| GET | `/api/submissions/assignment/:assignmentId` | Get submissions for a specific assignment | Yes |
| PATCH | `/api/submissions/:id/grade` | Grade a submission (marks, feedback, status) | Yes |
| GET | `/api/submissions/:id` | Get submission details by ID | Yes |

## Data Flow

Authenticated request → validated by `submission.validator.ts` → `submission.controller.ts` → `submission.service.ts` → Prisma queries on `AssignmentSubmission`. Grading updates `marksObtained`, `status`, `gradedById`, and `gradedAt`. Supports late submission flagging and multiple attempt tracking.

## Dependencies

- `assignment` module (for assignment reference)
- `faculty` module (for grader identity)
- `auth` module (for `authenticate` middleware)

## Related Models

- `AssignmentSubmission`, `SubmissionAttachment`
- `Assignment`, `Student`, `Faculty`

## Error Codes

- `200` — Success
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Not authorized to grade
- `404` — Submission not found
- `409` — Already graded / conflicting data
- `500` — Internal server error
