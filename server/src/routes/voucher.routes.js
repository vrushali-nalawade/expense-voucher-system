import { Router } from 'express';
import { voucherController } from '../controllers/voucher.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { uploadEmployeeSignature, uploadDirectorSignature } from '../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);

router.post(
  '/',
  authorizeRoles('Employee'),
  uploadEmployeeSignature,
  voucherController.createVoucher
);

router.put(
  '/:id',
  authorizeRoles('Employee'),
  uploadEmployeeSignature,
  voucherController.updateVoucher
);

router.delete(
  '/:id',
  authorizeRoles('Employee'),
  voucherController.deleteVoucher
);

router.post(
  '/:id/approve',
  authorizeRoles('Director', 'Admin'),
  uploadDirectorSignature,
  voucherController.approveVoucher
);

router.post(
  '/:id/reject',
  authorizeRoles('Director', 'Admin'),
  voucherController.rejectVoucher
);

export default router;