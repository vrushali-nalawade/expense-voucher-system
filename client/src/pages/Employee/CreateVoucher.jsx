import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, Calendar, Tag, CheckCircle2, RotateCcw } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import voucherApi from '../../api/voucherApi.js';
import Button from '../../components/common/Button.jsx';
import { EXPENSE_CATEGORIES } from '../../utils/constants.js';

const CreateVoucher = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    expenseTitle: '',
    expenseCategory: 'Travel & Meals',
    expenseDate: new Date().toISOString().split('T')[0],
    amount: '',
    expenseDescription: '',
    status: 'Submitted',
    employeeSignatureUrl: user?.signature_url || null,
  });

  const [useSavedSignature, setUseSavedSignature] = useState(!!user?.signature_url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const startDrawing = (e) => {
    if (useSavedSignature) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || useSavedSignature) return;
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
    if (!isDrawing || useSavedSignature) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setFormData((prev) => ({ ...prev, employeeSignatureUrl: canvas.toDataURL() }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setFormData((prev) => ({ ...prev, employeeSignatureUrl: null }));
    setUseSavedSignature(false);
  };

  const handleSubmit = async (e, submitStatus = 'Submitted') => {
    e.preventDefault();
    if (!formData.expenseTitle || !formData.amount) {
      setError('Please fill in all required expense details.');
      return;
    }
    if (submitStatus === 'Submitted' && !formData.employeeSignatureUrl) {
      setError('Digital e-signature is mandatory for voucher submission.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await voucherApi.createVoucher({ ...formData, status: submitStatus });
      navigate('/employee/vouchers');
    } catch (err) {
      setError('Failed to create expense voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Create Expense Voucher</h1>
        <p className="text-xs text-slate-500">Submit a new expense reimbursement claim</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, 'Submitted')} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-600">
            Expense Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="expenseTitle"
            value={formData.expenseTitle}
            onChange={handleChange}
            placeholder="e.g. Travel & Client Dinner Expense"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Category</label>
            <select
              name="expenseCategory"
              value={formData.expenseCategory}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-600">Expense Date</label>
          <input
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-600">Expense Description</label>
          <textarea
            name="expenseDescription"
            rows={3}
            value={formData.expenseDescription}
            onChange={handleChange}
            placeholder="Detailed description of expenses incurred..."
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase text-slate-700">Digital E-Signature</label>
            {user?.signature_url && (
              <button
                type="button"
                onClick={() => setUseSavedSignature(!useSavedSignature)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                {useSavedSignature ? 'Draw Custom Signature' : 'Use Saved Profile Signature'}
              </button>
            )}
          </div>

          {useSavedSignature && user?.signature_url ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <img src={user.signature_url} alt="Saved Signature" className="h-12 object-contain" />
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile Signature Active
              </span>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50">
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-28 bg-white rounded-xl cursor-crosshair border border-slate-100"
              />
              <div className="flex justify-between items-center mt-1 px-2">
                <span className="text-[10px] text-slate-400">Draw signature above</span>
                <button type="button" onClick={clearCanvas} className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold">
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, 'Draft')}
            isLoading={loading}
          >
            Save as Draft
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Submit Voucher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateVoucher;