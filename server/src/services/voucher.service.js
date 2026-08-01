import { query } from '../config/db.js';

export const voucherService = {
  generateVoucherNumber: async () => {
    const year = new Date().getFullYear();
    const result = await query('SELECT COUNT(*) FROM vouchers');
    const count = parseInt(result.rows[0].count, 10) + 1;
    const padded = String(count).padStart(3, '0');
    return `VCH-${year}-${padded}`;
  },

  getAllVouchers: async (filters = {}, user) => {
    let sql = `
      SELECT v.*, u.name AS employee_name, u.email AS employee_email
      FROM vouchers v
      JOIN users u ON v.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (user.role?.toLowerCase() === 'employee') {
      params.push(user.id);
      sql += ` AND v.user_id = $${params.length}`;
    }

    if (filters.status) {
      params.push(filters.status);
      sql += ` AND LOWER(v.status) = LOWER($${params.length})`;
    }

    if (filters.department) {
      params.push(filters.department);
      sql += ` AND LOWER(v.department) = LOWER($${params.length})`;
    }

    if (filters.search) {
      params.push(`%${filters.search}%`);
      const idx = params.length;
      sql += ` AND (v.voucher_number ILIKE $${idx} OR v.title ILIKE $${idx} OR u.name ILIKE $${idx})`;
    }

    sql += ` ORDER BY v.created_at DESC`;

    const result = await query(sql, params);
    return result.rows;
  },

  getVoucherById: async (id, user) => {
    const sql = `
      SELECT v.*, u.name AS employee_name, u.email AS employee_email
      FROM vouchers v
      JOIN users u ON v.user_id = u.id
      WHERE v.id = $1
    `;
    const result = await query(sql, [id]);
    const voucher = result.rows[0];

    if (!voucher) return null;

    if (user.role?.toLowerCase() === 'employee' && voucher.user_id !== user.id) {
      throw new Error('Unauthorized to view this expense voucher');
    }

    return voucher;
  },

  createVoucher: async (voucherData, userId) => {
    const { title, department, category, expenseDate, amount, description, signatureUrl, status = 'Draft' } = voucherData;
    const voucherNumber = await voucherService.generateVoucherNumber();

    const result = await query(
      `INSERT INTO vouchers 
        (voucher_number, title, department, category, expense_date, amount, description, status, user_id, signature_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [voucherNumber, title, department, category, expenseDate, amount, description, status, userId, signatureUrl]
    );

    return result.rows[0];
  },

  updateVoucher: async (id, updateData, userId) => {
    const check = await query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const existing = check.rows[0];

    if (!existing) throw new Error('Voucher not found');
    if (existing.user_id !== userId) throw new Error('Unauthorized to edit this voucher');
    
    if (existing.status.toLowerCase() !== 'draft') {
      throw new Error('Submitted or processed vouchers cannot be edited');
    }

    const { title, department, category, expenseDate, amount, description, status, signatureUrl } = updateData;

    const result = await query(
      `UPDATE vouchers 
       SET title = COALESCE($1, title),
           department = COALESCE($2, department),
           category = COALESCE($3, category),
           expense_date = COALESCE($4, expense_date),
           amount = COALESCE($5, amount),
           description = COALESCE($6, description),
           status = COALESCE($7, status),
           signature_url = COALESCE($8, signature_url),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [title, department, category, expenseDate, amount, description, status, signatureUrl, id]
    );

    return result.rows[0];
  },

  deleteVoucher: async (id, userId) => {
    const check = await query('SELECT * FROM vouchers WHERE id = $1', [id]);
    const existing = check.rows[0];

    if (!existing) throw new Error('Voucher not found');
    if (existing.user_id !== userId) throw new Error('Unauthorized to delete this voucher');

    if (existing.status.toLowerCase() !== 'draft') {
      throw new Error('Only draft vouchers can be deleted');
    }

    await query('DELETE FROM vouchers WHERE id = $1', [id]);
    return { success: true };
  },

  approveVoucher: async (id, directorSignatureUrl, directorId) => {
    const result = await query(
      `UPDATE vouchers 
       SET status = 'Approved',
           director_signature_url = $1,
           approved_by = $2,
           approval_date = NOW(),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [directorSignatureUrl, directorId, id]
    );
    return result.rows[0];
  },

  rejectVoucher: async (id, rejectionReason) => {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new Error('Rejection reason is mandatory when rejecting a voucher');
    }

    const result = await query(
      `UPDATE vouchers 
       SET status = 'Rejected',
           rejection_reason = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [rejectionReason, id]
    );
    return result.rows[0];
  },
};

export default voucherService;