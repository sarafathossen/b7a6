import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(authValidation.registerValidationSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken
);

export const authRoutes = router;