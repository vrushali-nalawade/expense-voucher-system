import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Signature, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import voucherApi from '../../api/voucherApi.js';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';

const PendingApprovals = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [directorSignatureUrl, setDirectorSignatureUrl] = useState(user?.signature_url || null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getVouchers({ status: 'Pending Approval' });
      setVouchers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setDirectorSignatureUrl(canvas.toDataURL());
    }
  };

  const handleApprove = async (voucherId) => {
    const signature = directorSignatureUrl || user?.signature_url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    try {
      await voucherApi.approveVoucher(voucherId, signature);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) return;
    try {
      await voucherApi.rejectVoucher(selectedVoucher.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Director Pending Approvals</h1>
        <p className="text-xs text-slate-500">Review and authorize submitted employee expense reimbursement claims</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Executive Director E-Signature Approval Stamp</h2>
        {directorSignatureUrl ? (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <img src={directorSignatureUrl} alt="Director Signature" className="h-12 object-contain" />
            <button onClick={() => setDirectorSignatureUrl(null)} className="text-xs text-rose-600 hover:underline font-semibold">
              Redraw Signature
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50">
            <canvas
              ref={canvasRef}
              width={500}
              height={100}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-24 bg-white rounded-xl cursor-crosshair border border-slate-100"
            />
            <span className="text-[10px] text-slate-400 text-center block mt-1">Draw Director approval signature above</span>
          </div>
        )}
      </div>

      {vouchers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
          <p className="text-sm font-semibold">No vouchers currently pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-blue-600">{voucher.voucherNumber}</span>
                  <h3 className="text-sm font-bold text-slate-900">{voucher.expenseTitle}</h3>
                  <p className="text-xs text-slate-500">{voucher.employeeName} • {voucher.department}</p>
                </div>
                <span className="text-sm font-extrabold text-slate-900">₹{parseFloat(voucher.amount).toLocaleString('en-IN')}</span>
              </div>

              {voucher.employeeSignatureUrl && (
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Employee Signature:</span>
                  <img src={voucher.employeeSignatureUrl} alt="Employee Signature" className="h-8 object-contain mt-1" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="success" fullWidth onClick={() => handleApprove(voucher.id)} leftIcon={CheckCircle}>
                  Approve Claim
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    setSelectedVoucher(voucher);
                    setShowRejectModal(true);
                  }}
                  leftIcon={XCircle}
                >
                  Reject Claim
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Expense Voucher">
        <div className="space-y-4">
          <p className="text-xs text-slate-600">Please provide a mandatory reason for rejecting this claim:</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none"
            rows={3}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRejectSubmit}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingApprovals;