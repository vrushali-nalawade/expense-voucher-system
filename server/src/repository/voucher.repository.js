import { query } from '../config/db.js';

export const voucherRepository = {
  findAll: async (filters = {}, userId = null, isEmployee = false) => {
    let sql = `
      SELECT v.*, u.name AS employee_name, u.email AS employee_email
      FROM vouchers v
      JOIN users u ON v.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (isEmployee && userId) {
      params.push(userId);
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

  findById: async (id) => {
    const sql = `
      SELECT v.*, u.name AS employee_name, u.email AS employee_email
      FROM vouchers v
      JOIN users u ON v.user_id = u.id
      WHERE v.id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  create: async (data) => {
    const { voucherNumber, title, department, category, expenseDate, amount, description, status, userId, signatureUrl } = data;
    const result = await query(
      `INSERT INTO vouchers 
        (voucher_number, title, department, category, expense_date, amount, description, status, user_id, signature_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [voucherNumber, title, department, category, expenseDate, amount, description, status, userId, signatureUrl]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { title, department, category, expenseDate, amount, description, status, signatureUrl } = data;
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

  delete: async (id) => {
    await query('DELETE FROM vouchers WHERE id = $1', [id]);
    return { success: true };
  },

  updateApproval: async (id, directorSignatureUrl, directorId) => {
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

  updateRejection: async (id, rejectionReason) => {
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

export default voucherRepository;