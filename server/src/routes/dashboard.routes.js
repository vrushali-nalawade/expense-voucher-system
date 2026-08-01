import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get(
  '/employee',
  authorizeRoles('Employee'),
  dashboardController.getEmployeeStats
);

router.get(
  '/director',
  authorizeRoles('Director', 'Admin'),
  dashboardController.getDirectorStats
);

router.get(
  '/accounts',
  authorizeRoles('Accounts'),
  dashboardController.getAccountsStats
);

export default router;