import React, { useState } from 'react';
import { FileText, DollarSign, Calendar, Building2, Tag, Save, Send } from 'lucide-react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../common/Card.jsx';
import SignatureCanvas from '../common/SignatureCanvas.jsx';

const VoucherForm = ({
  initialValues = null,
  onSubmitDraft,
  onSubmitFinal,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    department: initialValues?.department || '',
    category: initialValues?.category || 'Office Supplies',
    expenseDate: initialValues?.expenseDate || '',
    amount: initialValues?.amount || '',
    description: initialValues?.description || '',
    signature: initialValues?.signature || initialValues?.signatureUrl || null,
  });

  const [errors, setErrors] = useState({});

  const departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Executive'];
  const categories = ['Travel', 'Meals & Entertainment', 'Office Supplies', 'Software & Tools', 'Medical', 'Client Expense', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSignatureSave = (signatureData) => {
    setFormData((prev) => ({ ...prev, signature: signatureData }));
    if (signatureData) {
      setErrors((prev) => ({ ...prev, signature: null }));
    }
  };

  // Uniform validation for both Save Draft & Submit for Approval
  const validateAllFields = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Expense Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.expenseDate) newErrors.expenseDate = 'Expense Date is required';
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!formData.signature) {
      newErrors.signature = 'Employee signature is required before saving or submitting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      onSubmitDraft && onSubmitDraft({ ...formData, status: 'Draft' });
    }
  };

  const handleSubmitApproval = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      onSubmitFinal && onSubmitFinal({ ...formData, status: 'Submitted' });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{initialValues ? 'Edit Expense Voucher' : 'Create New Expense Voucher'}</CardTitle>
        <CardDescription>
          Fill in the details below to log your expense request. Save as draft or submit for director review.
        </CardDescription>
      </CardHeader>

      <form>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Expense Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Client Dinner Meeting"
              leftIcon={FileText}
              error={errors.title}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50/50 border transition-all ${
                    errors.department ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                  } focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && <p className="text-xs font-medium text-rose-500">{errors.department}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Expense Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Expense Date"
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              leftIcon={Calendar}
              error={errors.expenseDate}
              required
            />

            <Input
              label="Amount (INR)"
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              leftIcon={DollarSign}
              error={errors.amount}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Expense Description & Justification
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide context regarding business purpose, participants, or itemized details..."
              className="block w-full p-3.5 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Employee Signature <span className="text-rose-500">*</span>
            </label>
            <SignatureCanvas
              onSaveSignature={handleSignatureSave}
              initialSignature={formData.signature}
            />
            {errors.signature && <p className="text-xs font-medium text-rose-500">{errors.signature}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3">
          {onCancel ? (
            <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              leftIcon={Save}
              onClick={handleSaveDraft}
              isLoading={isLoading}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="primary"
              leftIcon={Send}
              onClick={handleSubmitApproval}
              isLoading={isLoading}
            >
              Submit for Approval
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VoucherForm;