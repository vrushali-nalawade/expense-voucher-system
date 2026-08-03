import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Building, Trash2, LogOut, CheckCircle2, Signature, Upload } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import authApi from '../../api/authApi.js';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';

const UserProfile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'Engineering',
    signature_url: user?.signature_url || null,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const updated = authApi.updateProfile({
        name: formData.name,
        department: formData.department,
        signature_url: formData.signature_url,
      });
      updateUserProfile(updated);
      setSuccessMsg('Profile details and e-signature saved successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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
      setFormData((prev) => ({ ...prev, signature_url: canvas.toDataURL() }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setFormData((prev) => ({ ...prev, signature_url: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, signature_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    authApi.deleteAccount(user?.email);
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900">User Account Settings</h1>
            <p className="text-xs text-slate-500">Manage your profile information and digital signature</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            {user?.role} Portal
          </span>
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Email Address (Primary ID)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Department</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Account Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase text-slate-700">Saved Digital E-Signature</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button type="button" onClick={clearCanvas} className="text-xs text-slate-400 hover:text-slate-600">
                  Clear
                </button>
              </div>
            </div>

            {formData.signature_url ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <img src={formData.signature_url} alt="Digital Signature" className="h-16 object-contain max-w-xs" />
                <button type="button" onClick={clearCanvas} className="text-xs font-semibold text-rose-600 hover:underline">
                  Change Signature
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-32 bg-white rounded-xl cursor-crosshair border border-slate-100"
                />
                <span className="text-[11px] text-slate-400 text-center block mt-1">Draw signature above</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Danger Zone</h3>
          <p className="text-xs text-slate-500">Permanently delete your account and profile data</p>
        </div>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)} leftIcon={Trash2}>
          Delete Profile
        </Button>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Account Deletion">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete your account (<strong>{user?.email}</strong>)? You will be unable to log in with these credentials again.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;