import express from 'express';
import { authRoutes } from '../module/auth/auth.route';
import { ambulanceRoutes } from '../module/ambulance/ambulance.route';
import { emergencyRequestRoutes } from '../module/emergencyRequest/emergencyRequest.route';
import { paymentRoutes } from '../module/payment/payment.route';
import { driverRoutes } from '../module/driver/driver.route';
import { hospitalRoutes } from '../module/hospital/hospital.route';
import { userRoutes } from '../module/user/user.route';

const router = express.Router();

const moduleRoutes = [
    { path: '/auth', route: authRoutes },
    { path: '/ambulances', route: ambulanceRoutes },
    { path: '/emergency-requests', route: emergencyRequestRoutes },
    { path: '/payments', route: paymentRoutes },
    { path: '/drivers', route: driverRoutes },
    { path: '/hospitals', route: hospitalRoutes },
    { path: '/users', route: userRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;