import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import voucherApi from '../../api/voucherApi.js';
import Button from '../../components/common/Button.jsx';
import SignatureCanvas from '../../components/common/SignatureCanvas.jsx';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e, submitStatus = 'Submitted') => {
    e.preventDefault();
    if (!formData.expenseTitle || !formData.amount) {
      setError('Please fill in all required expense details.');
      return;
    }
    if (submitStatus === 'Submitted' && !formData.employeeSignatureUrl) {
      setError('A locked and verified digital signature is required before submitting your claim.');
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

        <SignatureCanvas
          initialUrl={formData.employeeSignatureUrl}
          onSave={(url) => setFormData((prev) => ({ ...prev, employeeSignatureUrl: url }))}
          title="Employee Digital E-Signature"
        />

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