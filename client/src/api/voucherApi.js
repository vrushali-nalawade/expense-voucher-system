import axiosInstance from './axios.js';

const STORAGE_KEY = 'voucherflow_stored_vouchers_v2';

const initialMockVouchers = [
  {
    id: 108,
    voucherNumber: 'VCH-2026-008',
    title: 'Scranton Paper Summit & Client Dinner',
    department: 'Sales',
    category: 'Meals & Entertainment',
    expenseDate: '2026-07-31',
    amount: 18900.00,
    description: 'Quarterly client appreciation dinner meeting with regional buyers.',
    status: 'Submitted',
    employeeName: 'Michael Scott',
    employeeId: 'EMP-101',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Michael+Scott',
    createdAt: '2026-07-31',
  },
  {
    id: 109,
    voucherNumber: 'VCH-2026-009',
    title: 'Client Retainer Golf Event & Catering',
    department: 'Marketing',
    category: 'Meals & Entertainment',
    expenseDate: '2026-07-30',
    amount: 12400.00,
    description: 'Networking golf outing and lunch with key corporate accounts.',
    status: 'Submitted',
    employeeName: 'Jim Halpert',
    employeeId: 'EMP-102',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Jim+Halpert',
    createdAt: '2026-07-30',
  },
  {
    id: 110,
    voucherNumber: 'VCH-2026-010',
    title: 'UI/UX Design Software & Graphics Tablet',
    department: 'Operations',
    category: 'Software & Tools',
    expenseDate: '2026-07-29',
    amount: 7600.00,
    description: 'Figma organization plan renewal and digital drawing tablet.',
    status: 'Submitted',
    employeeName: 'Pam Beesly',
    employeeId: 'EMP-103',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Pam+Beesly',
    createdAt: '2026-07-29',
  },
  {
    id: 111,
    voucherNumber: 'VCH-2026-011',
    title: 'Server Farm Security & Thermal Cameras',
    department: 'Engineering',
    category: 'Software & Tools',
    expenseDate: '2026-07-28',
    amount: 28500.00,
    description: 'Thermal monitoring hardware and perimeter defense system for datacenter.',
    status: 'Submitted',
    employeeName: 'Dwight Schrute',
    employeeId: 'EMP-104',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Dwight+Schrute',
    createdAt: '2026-07-28',
  },
  {
    id: 112,
    voucherNumber: 'VCH-2026-012',
    title: 'Accounting Audit Conference & Lodging',
    department: 'Finance',
    category: 'Travel',
    expenseDate: '2026-07-27',
    amount: 14200.00,
    description: 'Annual CPA compliance seminar flight tickets and 3-night hotel lodging.',
    status: 'Submitted',
    employeeName: 'Angela Martin',
    employeeId: 'EMP-105',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Angela+Martin',
    createdAt: '2026-07-27',
  },
  {
    id: 101,
    voucherNumber: 'VCH-2026-001',
    title: 'Client Strategy Lunch Meeting',
    department: 'Sales',
    category: 'Meals & Entertainment',
    expenseDate: '2026-07-20',
    amount: 3450.00,
    description: 'Quarterly business review lunch with key stakeholder enterprise team.',
    status: 'Approved',
    employeeName: 'Vrushali Nalawade',
    employeeId: 'EMP-402',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Vrushali+Signature',
    directorSignatureUrl: 'https://placehold.co/200x80/16a34a/ffffff?text=Director+Approved',
    createdAt: '2026-07-21',
  },
  {
    id: 102,
    voucherNumber: 'VCH-2026-002',
    title: 'Cloud Infrastructure Subscription',
    department: 'Engineering',
    category: 'Software & Tools',
    expenseDate: '2026-07-22',
    amount: 18500.00,
    description: 'Monthly AWS and database server hosting charges.',
    status: 'Approved',
    employeeName: 'Vrushali Nalawade',
    employeeId: 'EMP-402',
    signatureUrl: 'https://placehold.co/200x80/2563eb/ffffff?text=Vrushali+Signature',
    createdAt: '2026-07-23',
  },
  {
    id: 103,
    voucherNumber: 'VCH-2026-003',
    title: 'Office Stationery & Printer Ink',
    department: 'Operations',
    category: 'Office Supplies',
    expenseDate: '2026-07-25',
    amount: 1200.00,
    description: 'Printer cartridges and notebook stock for office inventory.',
    status: 'Draft',
    employeeName: 'Vrushali Nalawade',
    employeeId: 'EMP-402',
    signatureUrl: null,
    createdAt: '2026-07-25',
  },
];

const getStoredVouchers = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse stored vouchers', err);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockVouchers));
  return initialMockVouchers;
};

const saveStoredVouchers = (vouchers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
};

export const voucherApi = {
  getVouchers: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/vouchers', { params: filters });
      return response.data;
    } catch (err) {
      let vouchers = getStoredVouchers();

      // STRICT PRIVACY: If requested by Employee Portal, ONLY return vouchers created by Vrushali Nalawade (or 'Self')
      if (filters.employeeOnly) {
        vouchers = vouchers.filter(
          v => v.employeeName === 'Vrushali Nalawade' || v.employeeName === 'Self' || !v.employeeName
        );
      }

      if (filters.status) {
        const reqStatus = filters.status.toLowerCase();
        if (reqStatus === 'submitted' || reqStatus === 'pending approval') {
          vouchers = vouchers.filter(
            v => v.status?.toLowerCase() === 'submitted' || v.status?.toLowerCase() === 'pending approval'
          );
        } else {
          vouchers = vouchers.filter(v => v.status?.toLowerCase() === reqStatus);
        }
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        vouchers = vouchers.filter(v => 
          v.title?.toLowerCase().includes(query) || 
          v.voucherNumber?.toLowerCase().includes(query) ||
          v.department?.toLowerCase().includes(query) ||
          v.employeeName?.toLowerCase().includes(query)
        );
      }

      return vouchers;
    }
  },

  getVoucherById: async (id) => {
    try {
      const response = await axiosInstance.get(`/vouchers/${id}`);
      return response.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      return vouchers.find(v => v.id === Number(id) || v.voucherNumber === id) || vouchers[0];
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await axiosInstance.post('/vouchers', voucherData);
      return response.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const newVoucher = {
        id: Date.now(),
        voucherNumber: `VCH-2026-${String(vouchers.length + 1).padStart(3, '0')}`,
        employeeName: 'Vrushali Nalawade',
        ...voucherData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newVoucher, ...vouchers];
      saveStoredVouchers(updated);
      return newVoucher;
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      const response = await axiosInstance.put(`/vouchers/${id}`, voucherData);
      return response.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map(v => v.id === Number(id) ? { ...v, ...voucherData } : v);
      saveStoredVouchers(updated);
      return updated.find(v => v.id === Number(id));
    }
  },

  deleteVoucher: async (id) => {
    try {
      await axiosInstance.delete(`/vouchers/${id}`);
      return { success: true };
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.filter(v => v.id !== Number(id));
      saveStoredVouchers(updated);
      return { success: true };
    }
  },

  approveVoucher: async (id, approvalData) => {
    try {
      const response = await axiosInstance.post(`/vouchers/${id}/approve`, approvalData);
      return response.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map(v => 
        v.id === Number(id) 
          ? { 
              ...v, 
              status: 'Approved', 
              directorSignatureUrl: approvalData.signatureUrl || 'https://placehold.co/200x80/16a34a/ffffff?text=Director+Signed',
              approvalDate: new Date().toISOString().split('T')[0]
            } 
          : v
      );
      saveStoredVouchers(updated);
      return updated.find(v => v.id === Number(id));
    }
  },

  rejectVoucher: async (id, rejectionData) => {
    try {
      const response = await axiosInstance.post(`/vouchers/${id}/reject`, rejectionData);
      return response.data;
    } catch (err) {
      const vouchers = getStoredVouchers();
      const updated = vouchers.map(v => 
        v.id === Number(id) 
          ? { 
              ...v, 
              status: 'Rejected', 
              rejectionReason: rejectionData.rejectionReason 
            } 
          : v
      );
      saveStoredVouchers(updated);
      return updated.find(v => v.id === Number(id));
    }
  },
};

export default voucherApi;