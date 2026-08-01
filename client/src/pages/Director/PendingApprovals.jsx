import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatusBadge from '../../components/voucher/StatusBadge.jsx';
import SignatureCanvas from '../../components/common/SignatureCanvas.jsx';
import voucherApi from '../../api/voucherApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const PendingApprovals = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [approveModalVoucher, setApproveModalVoucher] = useState(null);
  const [rejectModalVoucher, setRejectModalVoucher] = useState(null);
  const [directorSignature, setDirectorSignature] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getVouchers({ status: 'Submitted' });
      setVouchers(data);
    } catch (err) {
      console.error('Failed to fetch pending vouchers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApproveSubmit = async () => {
    if (!directorSignature) {
      setError('Director signature is required to confirm approval');
      return;
    }
    try {
      await voucherApi.approveVoucher(approveModalVoucher.id, { signatureUrl: directorSignature });
      setApproveModalVoucher(null);
      setDirectorSignature(null);
      setError(null);
      fetchPending();
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    try {
      await voucherApi.rejectVoucher(rejectModalVoucher.id, { rejectionReason });
      setRejectModalVoucher(null);
      setRejectionReason('');
      setError(null);
      fetchPending();
    } catch (err) {
      console.error('Rejection failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Approvals"
        subtitle="Review and process submitted employee reimbursement requests requiring Director authorization."
      />

      {loading ? (
        <Loader text="Loading pending approval queue..." />
      ) : vouchers.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Queue Clear</h3>
          <p className="text-xs">All submitted employee expense vouchers have been reviewed.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((v) => (
            <Card key={v.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono font-bold text-blue-600 text-xs">{v.voucherNumber}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{v.title}</h3>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Employee</span>
                  <span className="font-semibold text-slate-900">{v.employeeName || 'Self'} ({v.department})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Claim Amount</span>
                  <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(v.amount)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                <span className="font-semibold text-slate-900 block mb-1">Justification:</span>
                <p className="leading-relaxed">{v.description || 'No additional details provided.'}</p>
              </div>

              {v.signatureUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Employee E-Signature</span>
                  <img src={v.signatureUrl} alt="Employee Signature" className="h-12 object-contain bg-slate-50 p-1 rounded border" />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={XCircle}
                  onClick={() => {
                    setRejectModalVoucher(v);
                    setRejectionReason('');
                    setError(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={CheckCircle2}
                  onClick={() => {
                    setApproveModalVoucher(v);
                    setDirectorSignature(null);
                    setError(null);
                  }}
                >
                  Approve Voucher
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Modal with Interactive E-Signature */}
      <Modal
        isOpen={!!approveModalVoucher}
        onClose={() => setApproveModalVoucher(null)}
        title={`Approve Voucher: ${approveModalVoucher?.voucherNumber || ''}`}
        subtitle={approveModalVoucher?.title}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Amount</span>
              <span className="text-base font-bold text-slate-900">{formatCurrency(approveModalVoucher?.amount)}</span>
            </div>
            <span className="text-slate-600">Employee: {approveModalVoucher?.employeeName || 'Self'} ({approveModalVoucher?.department})</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Director E-Signature Verification <span className="text-rose-500">*</span>
            </label>
            <SignatureCanvas onSaveSignature={(sig) => setDirectorSignature(sig)} />
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setApproveModalVoucher(null)}>
              Cancel
            </Button>
            <Button variant="success" leftIcon={CheckCircle2} onClick={handleApproveSubmit}>
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={!!rejectModalVoucher}
        onClose={() => setRejectModalVoucher(null)}
        title={`Reject Voucher: ${rejectModalVoucher?.voucherNumber || ''}`}
        subtitle={rejectModalVoucher?.title}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="State reason for declining reimbursement claim..."
              className="w-full p-3 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setRejectModalVoucher(null)}>
              Cancel
            </Button>
            <Button variant="danger" leftIcon={XCircle} onClick={handleRejectSubmit}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingApprovals;