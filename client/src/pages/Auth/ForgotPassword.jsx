import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import authApi from '../../api/authApi.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.requestPasswordReset(email);
      setMessage(`Password reset verification code dispatched to ${email}. Please check your email inbox.`);
      setResetToken('');
      setStep(2);
    } catch (err) {
      setError('Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!resetToken || resetToken.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({ email, token: resetToken.trim(), newPassword });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Reset Your Password</h2>
        <p className="text-xs text-slate-500">
          Recover access to your account for the {role} portal.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Portal Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            >
              <option value="Employee">Employee</option>
              <option value="Director">Director</option>
              <option value="Accounts">Accounts Team</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Registered Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Send Reset Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Verification Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-center font-mono tracking-widest"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-4 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Confirm Password Reset
          </Button>
        </form>
      )}

      <button
        onClick={() => navigate('/login')}
        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;