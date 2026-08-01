import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import VoucherTable from '../../components/voucher/VoucherTable.jsx';
import Modal from '../../components/common/Modal.jsx';
import StatusBadge from '../../components/voucher/StatusBadge.jsx';
import voucherApi from '../../api/voucherApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const AllVouchersDirector = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(urlSearch);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Executive'];

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getVouchers();
      let filtered = [...data];

      // Strict combo filtering
      if (departmentFilter !== 'All') {
        filtered = filtered.filter(v => v.department?.toLowerCase() === departmentFilter.toLowerCase());
      }

      if (statusFilter !== 'All') {
        filtered = filtered.filter(v => v.status?.toLowerCase() === statusFilter.toLowerCase());
      }

      if (search.trim()) {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter(v => 
          v.title?.toLowerCase().includes(query) ||
          v.voucherNumber?.toLowerCase().includes(query) ||
          v.department?.toLowerCase().includes(query) ||
          v.employeeName?.toLowerCase().includes(query)
        );
      }

      setVouchers(filtered);
    } catch (err) {
      console.error('Failed to fetch vouchers repository', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [search, departmentFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Voucher Repository"
        subtitle="Complete read and audit access across all employee expense vouchers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voucher #, title, employee..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Approval Statuses</option>
          <option value="Submitted">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <VoucherTable
        vouchers={vouchers}
        userRole="Director"
        isLoading={loading}
        onView={(v) => setSelectedVoucher(v)}
      />

      <Modal
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        title={`Audit Voucher: ${selectedVoucher?.voucherNumber || ''}`}
        subtitle={selectedVoucher?.title}
      >
        {selectedVoucher && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Claim Amount</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(selectedVoucher.amount)}</span>
              </div>
              <StatusBadge status={selectedVoucher.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block">Department</span>
                <span>{selectedVoucher.department}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Expense Date</span>
                <span>{selectedVoucher.expenseDate}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-900 block mb-1">Description</span>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed">
                {selectedVoucher.description || 'No detailed description provided.'}
              </p>
            </div>

            {selectedVoucher.signatureUrl && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Employee Signature</span>
                <img src={selectedVoucher.signatureUrl} alt="Employee Signature" className="h-16 object-contain border rounded-lg p-2 bg-slate-50" />
              </div>
            )}

            {selectedVoucher.directorSignatureUrl && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Director E-Signature Verification</span>
                <img src={selectedVoucher.directorSignatureUrl} alt="Director Signature" className="h-16 object-contain border rounded-lg p-2 bg-slate-50" />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllVouchersDirector;