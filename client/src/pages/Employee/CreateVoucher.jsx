import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import VoucherForm from '../../components/voucher/VoucherForm.jsx';
import voucherApi from '../../api/voucherApi.js';

const CreateVoucher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSaveDraft = async (formData) => {
    setLoading(true);
    try {
      await voucherApi.createVoucher({ ...formData, status: 'Draft' });
      navigate('/employee/vouchers');
    } catch (err) {
      console.error('Failed to create draft voucher', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async (formData) => {
    setLoading(true);
    try {
      await voucherApi.createVoucher({ ...formData, status: 'Submitted' });
      navigate('/employee/vouchers');
    } catch (err) {
      console.error('Failed to submit voucher', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Create Expense Voucher"
        subtitle="Submit a new reimbursement claim or save your progress as a draft."
      />

      <VoucherForm
        onSubmitDraft={handleSaveDraft}
        onSubmitFinal={handleSubmitFinal}
        onCancel={() => navigate('/employee/vouchers')}
        isLoading={loading}
      />
    </div>
  );
};

export default CreateVoucher;