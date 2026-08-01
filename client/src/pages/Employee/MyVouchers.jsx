import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, Search, LayoutGrid, List, Trash2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import VoucherTable from '../../components/voucher/VoucherTable.jsx';
import VoucherCard from '../../components/voucher/VoucherCard.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatusBadge from '../../components/voucher/StatusBadge.jsx';
import voucherApi from '../../api/voucherApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const MyVouchers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      // Pass employeeOnly: true so employees see strictly THEIR OWN vouchers
      const data = await voucherApi.getVouchers({
        employeeOnly: true,
        search,
        status: statusFilter === 'All' ? '' : statusFilter,
      });
      setVouchers(data);
    } catch (err) {
      console.error('Failed to fetch vouchers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [search, statusFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await voucherApi.deleteVoucher(deleteId);
      setDeleteId(null);
      fetchVouchers();
    } catch (err) {
      console.error('Failed to delete draft voucher', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Vouchers" subtitle="Manage and track all expense requests you have submitted.">
        <Button variant="primary" leftIcon={PlusCircle} onClick={() => navigate('/employee/create-voucher')}>
          Create Voucher
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by voucher #, title, department..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your expense vouchers..." />
      ) : viewMode === 'table' ? (
        <VoucherTable
          vouchers={vouchers}
          userRole="Employee"
          onView={(v) => setSelectedVoucher(v)}
          onEdit={(v) => navigate(`/employee/edit-voucher?id=${v.id}`)}
          onDelete={(v) => setDeleteId(v.id)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vouchers.map((v) => (
            <VoucherCard
              key={v.id}
              voucher={v}
              userRole="Employee"
              onView={(v) => setSelectedVoucher(v)}
              onEdit={(v) => navigate(`/employee/edit-voucher?id=${v.id}`)}
              onDelete={(v) => setDeleteId(v.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        title={`Voucher Details: ${selectedVoucher?.voucherNumber || ''}`}
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

            {selectedVoucher.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
                <span className="font-bold block text-rose-800">Rejection Reason:</span>
                <p className="mt-0.5">{selectedVoucher.rejectionReason}</p>
              </div>
            )}

            {selectedVoucher.signatureUrl && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Employee Signature</span>
                <img
                  src={selectedVoucher.signatureUrl}
                  alt="Employee Signature"
                  className="h-16 object-contain border rounded-lg p-2 bg-slate-50"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Draft Voucher"
        subtitle="Are you sure you want to delete this draft voucher? This action cannot be undone."
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" leftIcon={Trash2} onClick={handleDelete}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyVouchers;