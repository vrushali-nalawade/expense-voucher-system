import axiosInstance from './axios.js';

const MASTER_VOUCHERS_KEY = 'voucherflow_master_vouchers_db_v5';

const initialDefaultVouchers = [
  {
    id: 1,
    voucherNumber: 'VCH-2026-001',
    employeeName: 'Vrushali Nalawade',
    department: 'Engineering',
    expenseTitle: 'Cloud Server Infrastructure & Render Hosting',
    expenseCategory: 'Software & Cloud Services',
    expenseDate: '2026-07-28',
    amount: 14500.0,
    expenseDescription: 'Render PostgreSQL instance deployment and production server scaling.',
    status: 'Submitted',
    employeeSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    directorSignatureUrl: null,
    approvalDate: null,
    rejectionReason: null,
  },
  {
    id: 2,
    voucherNumber: 'VCH-2026-002',
    employeeName: 'Michael Scott',
    department: 'Management',
    expenseTitle: 'Dunder Mifflin Client Dinner & Paper Expo',
    expenseCategory: 'Travel & Meals',
    expenseDate: '2026-07-29',
    amount: 8200.0,
    expenseDescription: 'Client entertainment and sales presentation conference meals.',
    status: 'Approved',
    employeeSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    directorSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    approvalDate: '2026-07-30',
    rejectionReason: null,
  },
  {
    id: 3,
    voucherNumber: 'VCH-2026-003',
    employeeName: 'Jim Halpert',
    department: 'Sales',
    expenseTitle: 'Sales Team Travel & Regional Client Visit',
    expenseCategory: 'Travel & Meals',
    expenseDate: '2026-07-30',
    amount: 6500.0,
    expenseDescription: 'Travel expenses for Scranton client sales presentations.',
    status: 'Pending Approval',
    employeeSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    directorSignatureUrl: null,
    approvalDate: null,
    rejectionReason: null,
  },
  {
    id: 4,
    voucherNumber: 'VCH-2026-004',
    employeeName: 'Pam Beesly',
    department: 'Administration',
    expenseTitle: 'Office Stationery & Printing Supplies',
    expenseCategory: 'Office Supplies',
    expenseDate: '2026-07-31',
    amount: 3400.0,
    expenseDescription: 'Paper stocks, printer ink cartridges, and administrative supplies.',
    status: 'Rejected',
    employeeSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    directorSignatureUrl: null,
    approvalDate: null,
    rejectionReason: 'Exceeded quarterly office supplies budget limit.',
  },
];

const getStoredVouchers = () => {
  const stored = localStorage.getItem(MASTER_VOUCHERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse master vouchers store', e);
    }
  }
  localStorage.setItem(MASTER_VOUCHERS_KEY, JSON.stringify(initialDefaultVouchers));
  return initialDefaultVouchers;
};

const saveStoredVouchers = (vouchers) => {
  localStorage.setItem(MASTER_VOUCHERS_KEY, JSON.stringify(vouchers));
};

export const voucherApi = {
  getVouchers: async (params = {}) => {
    try {
      const res = await axiosInstance.get('/vouchers', { params });
      return res.data;
    } catch (err) {
      let vouchers = getStoredVouchers();
      const currentUser = JSON.parse(localStorage.getItem('voucher_auth_user') || '{}');

      // Filter vouchers for employee role
      if (params.employeeOnly || currentUser.role?.toLowerCase() === 'employee') {
        const currentName = currentUser.name?.toLowerCase();
        vouchers = vouchers.filter(
          (v) => v.employeeName?.toLowerCase() === currentName || v.userId === currentUser.id
        );
      }

      if (params.status && params.status !== 'All') {
        vouchers = vouchers.filter((v) => v.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.search) {
        const query = params.search.toLowerCase();
        vouchers = vouchers.filter(
          (v) =>
            v.voucherNumber.toLowerCase().includes(query) ||
            v.expenseTitle.toLowerCase().includes(query) ||
            v.employeeName.toLowerCase().includes(query) ||
            v.expenseCategory.toLowerCase().includes(query)
        );
      }

      return vouchers;
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const res = await axiosInstance.post('/vouchers', voucherData);
      return res.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const currentUser = JSON.parse(localStorage.getItem('voucher_auth_user') || '{}');

      const nextNum = vouchers.length + 1;
      const formattedNum = `VCH-2026-${String(nextNum).padStart(3, '0')}`;

      const newVoucher = {
        id: Date.now(),
        voucherNumber: formattedNum,
        userId: currentUser.id || Date.now(),
        employeeName: currentUser.name || voucherData.employeeName || 'Vrushali Nalawade',
        department: currentUser.department || voucherData.department || 'Engineering',
        expenseTitle: voucherData.expenseTitle,
        expenseCategory: voucherData.expenseCategory,
        expenseDate: voucherData.expenseDate || new Date().toISOString().split('T')[0],
        amount: parseFloat(voucherData.amount) || 0,
        expenseDescription: voucherData.expenseDescription || '',
        status: voucherData.status || 'Submitted',
        employeeSignatureUrl: voucherData.employeeSignatureUrl || currentUser.signature_url || null,
        directorSignatureUrl: null,
        approvalDate: null,
        rejectionReason: null,
      };

      const updated = [newVoucher, ...vouchers];
      saveStoredVouchers(updated);
      return newVoucher;
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      const res = await axiosInstance.put(`/vouchers/${id}`, voucherData);
      return res.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map((v) => (v.id === parseInt(id) ? { ...v, ...voucherData } : v));
      saveStoredVouchers(updated);
      return updated.find((v) => v.id === parseInt(id));
    }
  },

  deleteVoucher: async (id) => {
    try {
      await axiosInstance.delete(`/vouchers/${id}`);
    } catch (err) {
      const vouchers = getStoredVouchers();
      const filtered = vouchers.filter((v) => v.id !== parseInt(id));
      saveStoredVouchers(filtered);
    }
  },

  approveVoucher: async (id, directorSignatureUrl) => {
    try {
      const res = await axiosInstance.post(`/vouchers/${id}/approve`, { directorSignatureUrl });
      return res.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map((v) =>
        v.id === parseInt(id)
          ? {
              ...v,
              status: 'Approved',
              directorSignatureUrl: directorSignatureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              approvalDate: new Date().toISOString().split('T')[0],
            }
          : v
      );
      saveStoredVouchers(updated);
      return updated.find((v) => v.id === parseInt(id));
    }
  },

  rejectVoucher: async (id, rejectionReason) => {
    try {
      const res = await axiosInstance.post(`/vouchers/${id}/reject`, { rejectionReason });
      return res.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map((v) =>
        v.id === parseInt(id)
          ? {
              ...v,
              status: 'Rejected',
              rejectionReason,
            }
          : v
      );
      saveStoredVouchers(updated);
      return updated.find((v) => v.id === parseInt(id));
    }
  },
};

export default voucherApi;