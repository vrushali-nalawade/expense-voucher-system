import { voucherService } from '../services/voucher.service.js';

export const voucherController = {
  getVouchers: async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
        department: req.query.department,
        search: req.query.search,
      };
      const vouchers = await voucherService.getAllVouchers(filters, req.user);
      return res.status(200).json(vouchers);
    } catch (err) {
      next(err);
    }
  },

  getVoucherById: async (req, res, next) => {
    try {
      const voucher = await voucherService.getVoucherById(req.params.id, req.user);
      if (!voucher) {
        return res.status(404).json({ message: 'Expense voucher not found' });
      }
      return res.status(200).json(voucher);
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  },

  createVoucher: async (req, res, next) => {
    try {
      let signatureUrl = req.body.signatureUrl || null;
      if (req.file) {
        signatureUrl = `/uploads/employee-signatures/${req.file.filename}`;
      }

      const newVoucher = await voucherService.createVoucher(
        {
          ...req.body,
          signatureUrl,
        },
        req.user.id
      );

      return res.status(201).json({
        message: 'Voucher created successfully',
        voucher: newVoucher,
      });
    } catch (err) {
      next(err);
    }
  },

  updateVoucher: async (req, res, next) => {
    try {
      let signatureUrl = req.body.signatureUrl;
      if (req.file) {
        signatureUrl = `/uploads/employee-signatures/${req.file.filename}`;
      }

      const updated = await voucherService.updateVoucher(
        req.params.id,
        {
          ...req.body,
          signatureUrl,
        },
        req.user.id
      );

      return res.status(200).json({
        message: 'Voucher updated successfully',
        voucher: updated,
      });
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('cannot be edited')) {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  },

  deleteVoucher: async (req, res, next) => {
    try {
      await voucherService.deleteVoucher(req.params.id, req.user.id);
      return res.status(200).json({ message: 'Draft voucher deleted successfully' });
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('Only draft')) {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  },

  approveVoucher: async (req, res, next) => {
    try {
      let directorSignatureUrl = req.body.signatureUrl || null;
      if (req.file) {
        directorSignatureUrl = `/uploads/director-signatures/${req.file.filename}`;
      }

      if (!directorSignatureUrl) {
        return res.status(400).json({ message: "Director's approval signature is mandatory" });
      }

      const approved = await voucherService.approveVoucher(
        req.params.id,
        directorSignatureUrl,
        req.user.id
      );

      return res.status(200).json({
        message: 'Voucher approved successfully',
        voucher: approved,
      });
    } catch (err) {
      next(err);
    }
  },

  rejectVoucher: async (req, res, next) => {
    try {
      const { rejectionReason } = req.body;
      const rejected = await voucherService.rejectVoucher(req.params.id, rejectionReason);

      return res.status(200).json({
        message: 'Voucher rejected',
        voucher: rejected,
      });
    } catch (err) {
      if (err.message.includes('mandatory')) {
        return res.status(400).json({ message: err.message });
      }
      next(err);
    }
  },
};

export default voucherController;