import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { emergencyRequestController } from './emergencyRequest.controller';
import { emergencyRequestValidation } from './emergencyRequest.validation';

const router = express.Router();

router.post(
  '/',
  auth('CALLER'),
  validateRequest(emergencyRequestValidation.createEmergencyRequestZodSchema),
  emergencyRequestController.createEmergencyRequest
);

router.get('/my-requests', auth('CALLER'), emergencyRequestController.getMyRequests);

router.get('/', auth('ADMIN'), emergencyRequestController.getAllRequests);

router.get('/:id', auth('CALLER', 'DRIVER', 'ADMIN'), emergencyRequestController.getRequestById);

// ড্রাইভার ও অ্যাম্বুলেন্স অ্যাসাইন (ADMIN)
router.patch(
  '/:id/assign',
  auth('ADMIN'),
  validateRequest(emergencyRequestValidation.assignDriverZodSchema),
  emergencyRequestController.assignDriver
);

// ট্রিপ স্ট্যাটাস আপডেট (DRIVER, ADMIN)
router.patch(
  '/:id/status',
  auth('DRIVER', 'ADMIN'),
  validateRequest(emergencyRequestValidation.updateStatusZodSchema),
  emergencyRequestController.updateStatus
);

export const emergencyRequestRoutes = router;