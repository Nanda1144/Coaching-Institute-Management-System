import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { admissionController } from './admission.controller';
import { createAdmissionSchema, updateAdmissionSchema, admissionIdSchema, eligibilityCheckSchema, enrollmentSchema, admQuerySchema } from './admission.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(admQuerySchema, 'query'), admissionController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(admissionIdSchema), admissionController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createAdmissionSchema), admissionController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateAdmissionSchema), admissionController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), admissionController.delete);

router.post('/course-eligibility/check', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(eligibilityCheckSchema), admissionController.checkEligibility);
router.post('/course-enrollment', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(enrollmentSchema), admissionController.enroll);

router.get('/batches/:batchId/capacity', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), admissionController.getBatchCapacity);
router.post('/batches/:batchId/enroll', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), admissionController.enrollInBatch);

export default router;
