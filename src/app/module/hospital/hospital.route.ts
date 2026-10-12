import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { hospitalController } from './hospital.controller';
import { hospitalValidation } from './hospital.validation';

const router = express.Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(hospitalValidation.createHospitalZodSchema),
  hospitalController.createHospital
);

router.get('/', hospitalController.getAllHospitals);

router.get('/:id', hospitalController.getHospitalById);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(hospitalValidation.updateHospitalZodSchema),
  hospitalController.updateHospital
);

router.delete('/:id', auth('ADMIN'), hospitalController.deleteHospital);

export const hospitalRoutes = router;