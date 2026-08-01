import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import VoucherForm from '../../components/voucher/VoucherForm';
import Loader from '../../components/common/Loader';
import voucherApi from '../../api/voucherApi';

const EditVoucher = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const voucherId = searchParams.get('id');

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      if (!voucherId) {
        navigate('/employee/vouchers');
        return;
      }
      try {
        const data = await voucherApi.getVoucherById(voucherId);
        if (data && data.status?.toLowerCase() !== 'draft') {
          setError('Only vouchers in Draft status can be edited.');
        } else {
          setInitialData(data);
        }
      } catch (err) {
        console.error('Failed to load voucher details', err);
        setError('Failed to load requested voucher.');
      } finally {
        setLoading(false);
      }
    };
    fetchVoucher();
  }, [voucherId, navigate]);

  const handleUpdateDraft = async (formData) => {
    setSaving(true);
    try {
      await voucherApi.updateVoucher(voucherId, { ...formData, status: 'Draft' });
      navigate('/employee/vouchers');
    } catch (err) {
      console.error('Failed to update draft voucher', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFinal = async (formData) => {
    setSaving(true);
    try {
      await voucherApi.updateVoucher(voucherId, { ...formData, status: 'Submitted' });
      navigate('/employee/vouchers');
    } catch (err) {
      console.error('Failed to submit voucher', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading voucher details for editing..." />;
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center space-y-4">
        <h3 className="text-lg font-bold text-rose-600">Access Restricted</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => navigate('/employee/vouchers')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to My Vouchers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Draft Voucher: ${initialData?.voucherNumber || ''}`}
        subtitle="Update expense details and resubmit for approval."
      />

      <VoucherForm
        initialValues={initialData}
        onSubmitDraft={handleUpdateDraft}
        onSubmitFinal={handleUpdateFinal}
        onCancel={() => navigate('/employee/vouchers')}
        isLoading={saving}
      />
    </div>
  );
};

export default EditVoucher;