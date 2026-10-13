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

// POST এবং PATCH দুই মেথডেই assign অ্যালাউ করা হলো
router.post(
  '/:id/assign',
  auth('ADMIN'),
  validateRequest(emergencyRequestValidation.assignDriverZodSchema),
  emergencyRequestController.assignDriver
);

router.patch(
  '/:id/assign',
  auth('ADMIN'),
  validateRequest(emergencyRequestValidation.assignDriverZodSchema),
  emergencyRequestController.assignDriver
);

// স্ট্যাটাস আপডেট (DRIVER & ADMIN)
router.patch(
  '/:id/status',
  auth('DRIVER', 'ADMIN'),
  validateRequest(emergencyRequestValidation.updateStatusZodSchema),
  emergencyRequestController.updateStatus
);

// রিকোয়েস্ট ক্যানসেল (CALLER & ADMIN)
router.post(
  '/:id/cancel',
  auth('CALLER', 'ADMIN'),
  emergencyRequestController.cancelRequest
);

export const emergencyRequestRoutes = router;