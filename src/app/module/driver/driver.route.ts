import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { driverController } from './driver.controller';
import { driverValidation } from './driver.validation';

const router = express.Router();

router.post(
  '/create-profile',
  auth('DRIVER'),
  validateRequest(driverValidation.createDriverProfileZodSchema),
  driverController.createDriverProfile
);

router.get('/my-profile', auth('DRIVER'), driverController.getMyDriverProfile);

router.get('/', auth('ADMIN'), driverController.getAllDrivers);

router.patch(
  '/:id',
  auth('ADMIN', 'DRIVER'),
  validateRequest(driverValidation.updateDriverProfileZodSchema),
  driverController.updateDriverProfile
);

export const driverRoutes = router;