import { query } from '../config/db.js';

export const dashboardService = {
  getEmployeeMetrics: async (userId) => {
    const statsQuery = `
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
    const result = await query(statsQuery, [userId]);
    const row = result.rows[0];

    return {
      totalVouchers: parseInt(row.total_vouchers, 10),
      draftVouchers: parseInt(row.draft_vouchers, 10),
      pendingApproval: parseInt(row.pending_approval, 10),
      approvedVouchers: parseInt(row.approved_vouchers, 10),
      rejectedVouchers: parseInt(row.rejected_vouchers, 10),
      totalAmountClaimed: parseFloat(row.total_amount_claimed),
    };
  },

  getDirectorMetrics: async () => {
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')) AS pending_approval_count,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved' AND DATE(approval_date) = CURRENT_DATE) AS approved_today,
        COUNT(*) FILTER (WHERE LOWER(status) = 'rejected' AND DATE(updated_at) = CURRENT_DATE) AS rejected_today,
        COALESCE(SUM(amount) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')), 0) AS total_pending_amount
      FROM vouchers
    `;
    const result = await query(statsQuery);
    const row = result.rows[0];

    return {
      pendingApprovalCount: parseInt(row.pending_approval_count, 10),
      approvedToday: parseInt(row.approved_today, 10),
      rejectedToday: parseInt(row.rejected_today, 10),
      totalPendingAmount: parseFloat(row.total_pending_amount),
    };
  },

  getAccountsMetrics: async () => {
    const statsQuery = `
      SELECT 
        COUNT(*) AS total_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) IN ('submitted', 'pending approval')) AS pending_approval,
        COUNT(*) FILTER (WHERE LOWER(status) = 'approved') AS approved_vouchers,
        COUNT(*) FILTER (WHERE LOWER(status) = 'rejected') AS rejected_vouchers,
        COALESCE(SUM(amount) FILTER (WHERE LOWER(status) = 'approved'), 0) AS total_approved_expense_amount
      FROM vouchers
    `;
    const result = await query(statsQuery);
    const row = result.rows[0];

    return {
      totalVouchers: parseInt(row.total_vouchers, 10),
      pendingApproval: parseInt(row.pending_approval, 10),
      approvedVouchers: parseInt(row.approved_vouchers, 10),
      rejectedVouchers: parseInt(row.rejected_vouchers, 10),
      totalApprovedExpenseAmount: parseFloat(row.total_approved_expense_amount),
    };
  },
};

export default dashboardService;