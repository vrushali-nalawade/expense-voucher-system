import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Building2, LogOut, Trash2, CheckCircle2, Lock } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import SignatureCanvas from '../../components/common/SignatureCanvas.jsx';
import useAuth from '../../hooks/useAuth.js';
import authApi from '../../api/authApi.js';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [signature, setSignature] = useState(user?.signatureUrl || null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleSaveSignature = (sigUrl) => {
    setSignature(sigUrl);
    authApi.updateProfile({ signatureUrl: sigUrl });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    logout();
    authApi.deleteAccount();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="User Profile & Security"
        subtitle="Manage your personal information, e-signature credentials, and account authentication settings."
      />

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-700 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>E-Signature updated and saved to profile successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'VN'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.name || 'Vrushali Nalawade'}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
              {user?.role || 'Employee'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email || 'vrushalinalawade108@gmail.com'}</p>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Button
              variant="secondary"
              fullWidth
              leftIcon={LogOut}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign Out
            </Button>
            <Button
              variant="danger"
              fullWidth
              leftIcon={Trash2}
              onClick={() => setDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Full Name</span>
                <p className="font-bold text-slate-900">{user?.name || 'Vrushali Nalawade'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</span>
                <p className="font-bold text-slate-900">{user?.email || 'vrushalinalawade108@gmail.com'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Portal Access Role</span>
                <p className="font-bold text-slate-900">{user?.role || 'Employee'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Department</span>
                <p className="font-bold text-slate-900">{user?.department || 'Engineering'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Saved Digital E-Signature
            </h3>
            <p className="text-xs text-slate-500">
              Draw or upload your default digital signature used for authenticating submitted expense reimbursement vouchers.
            </p>
            <SignatureCanvas onSaveSignature={handleSaveSignature} />
          </Card>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Account Confirmation"
        subtitle="Are you sure you want to delete your profile? This action will permanently remove your user access credentials."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" leftIcon={Trash2} onClick={handleDeleteAccount}>
            Confirm Account Deletion
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;