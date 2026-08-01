import { query } from '../config/db.js';

export const dashboardRepository = {
  getEmployeeStats: async (userId) => {
    const sql = `
      SELECT 
        COUNT(*) AS total_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) = 'draft') AS draft_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')) AS pending_approval,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected_vouchers,
        COALESCE(SUM(amount), 0) AS total_amount_claimed
      FROM vouchers
      WHERE user_id = $1
    `;
    const result = await query(sql, [userId]);
    return result.rows[0];
  },

  getDirectorStats: async () => {
    const sql = `
      SELECT 
        COUNT(*) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')) AS pending_approval_count,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved' AND DATE(approval_date) = CURRENT_DATE) AS approved_today,
        COUNT(*) FILTER (WHERE LOWER(status) = 'rejected' AND DATE(updated_at) = CURRENT_DATE) AS rejected_today,
        COALESCE(SUM(amount) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')), 0) AS total_pending_amount
      FROM vouchers
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  getAccountsStats: async () => {
    const sql = `
      SELECT 
        COUNT(*) AS total_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')) AS pending_approval,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected_vouchers,
        COALESCE(SUM(amount) FILTER (WHERE LOWER(status) = 'approved'), 0) AS total_approved_expense_amount
      FROM vouchers
    `;
    const result = await query(sql);
    return result.rows[0];
  },
};

export default dashboardRepository;