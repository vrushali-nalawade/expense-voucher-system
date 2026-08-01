import axiosInstance from './axios.js';
import voucherApi from './voucherApi.js';

export const dashboardApi = {
  getEmployeeStats: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/employee');
      return response.data;
    } catch (err) {
      // Query strictly Vrushali's personal vouchers (3 claims)
      const vouchers = await voucherApi.getVouchers({ employeeOnly: true });

      const totalVouchers = vouchers.length;
      const draftVouchers = vouchers.filter(v => v.status?.toLowerCase() === 'draft').length;
      const pendingApproval = vouchers.filter(
        v => v.status?.toLowerCase() === 'submitted' || v.status?.toLowerCase() === 'pending approval'
      ).length;
      const approvedVouchers = vouchers.filter(v => v.status?.toLowerCase() === 'approved').length;
      const rejectedVouchers = vouchers.filter(v => v.status?.toLowerCase() === 'rejected').length;

      const totalAmountClaimed = vouchers
        .filter(v => v.status?.toLowerCase() !== 'rejected')
        .reduce((sum, v) => sum + (Number(v.amount) || 0), 0);

      return {
        totalVouchers,
        draftVouchers,
        pendingApproval,
        approvedVouchers,
        rejectedVouchers,
        totalAmountClaimed,
      };
    }
  },

  getDirectorStats: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/director');
      return response.data;
    } catch (err) {
      // Query org-wide vouchers for Director metrics
      const vouchers = await voucherApi.getVouchers();
      const pendingList = vouchers.filter(
        v => v.status?.toLowerCase() === 'submitted' || v.status?.toLowerCase() === 'pending approval'
      );
      const approvedList = vouchers.filter(v => v.status?.toLowerCase() === 'approved');
      const rejectedList = vouchers.filter(v => v.status?.toLowerCase() === 'rejected');

      const totalApprovedAmount = approvedList.reduce((sum, v) => sum + (Number(v.amount) || 0), 0);
      const totalPendingAmount = pendingList.reduce((sum, v) => sum + (Number(v.amount) || 0), 0);

      return {
        totalVouchers: vouchers.length,
        pendingApprovalCount: pendingList.length,
        totalPendingAmount,
        totalApprovedAmount,
        approvedToday: approvedList.length,
        rejectedToday: rejectedList.length,
      };
    }
  },

  getAccountsStats: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/accounts');
      return response.data;
    } catch (err) {
      const vouchers = await voucherApi.getVouchers();
      return {
        totalVouchers: vouchers.length,
        pendingApproval: vouchers.filter(v => v.status?.toLowerCase() === 'submitted' || v.status?.toLowerCase() === 'pending approval').length,
        approvedVouchers: vouchers.filter(v => v.status?.toLowerCase() === 'approved').length,
        rejectedVouchers: vouchers.filter(v => v.status?.toLowerCase() === 'rejected').length,
        totalApprovedExpenseAmount: vouchers
          .filter(v => v.status?.toLowerCase() === 'approved')
          .reduce((sum, v) => sum + (Number(v.amount) || 0), 0),
      };
    }
  },
};

export default dashboardApi;