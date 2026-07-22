import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coaching Institution Management System API',
      version: '1.0.0',
      description: 'REST API for managing faculty, students, courses, batches, attendance, assignments, payments, and more.',
      contact: { name: 'API Support', email: 'support@ciiims.edu' },
    },
    servers: [
      { url: '/api', description: 'API base path' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & authorization' },
      { name: 'Faculty', description: 'Faculty management' },
      { name: 'Students', description: 'Student management' },
      { name: 'Courses', description: 'Course management' },
      { name: 'Batches', description: 'Batch management' },
      { name: 'Attendance', description: 'Attendance tracking' },
      { name: 'Assignments', description: 'Assignment management' },
      { name: 'Timetable', description: 'Timetable scheduling' },
      { name: 'Exams', description: 'Examination management' },
      { name: 'Admissions', description: 'Admission management' },
      { name: 'Enrollments', description: 'Course enrollments' },
      { name: 'Fee', description: 'Fee structures & installments' },
      { name: 'Payments', description: 'Payment gateways & history' },
      { name: 'Parents', description: 'Parent management & linking' },
      { name: 'Revaluation', description: 'Revaluation requests' },
      { name: 'Scholarships', description: 'Scholarship management' },
      { name: 'Upload', description: 'File upload & management' },
      { name: 'Cloud Documents', description: 'Cloud storage documents' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export function setupSwagger(app: Express) {
  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
  app.get('/api-docs.json', (_req, res) => res.json(specs));
}
