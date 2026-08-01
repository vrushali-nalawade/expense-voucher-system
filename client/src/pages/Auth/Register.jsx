import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import authApi from '../../api/authApi.js';
import Button from '../../components/common/Button.jsx';
import { DEPARTMENTS } from '../../utils/constants.js';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    department: 'Engineering',
  });

  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.sendEmailOtp(formData.email);
      setStep(2);
    } catch (err) {
      setError('Failed to send verification code. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndComplete = async (e) => {
    e.preventDefault();
    const cleanOtp = otpInput.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the exact 6-digit OTP verification code sent to your email inbox.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await authApi.register(formData, cleanOtp);
      login(response.user, response.token);

      const role = response.user.role?.toLowerCase();
      if (role === 'director' || role === 'admin') {
        navigate('/director/dashboard');
      } else if (role === 'accounts') {
        navigate('/accounts/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please check your email inbox.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500">Sign up to submit and track expense reimbursement claims</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleInitiateSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vrushali Nalawade"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Portal Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Employee">Employee</option>
                <option value="Director">Director</option>
                <option value="Accounts">Accounts Team</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-600">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Send Email OTP Verification Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtpAndComplete} className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl space-y-1 text-xs text-blue-700">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Verification Email Sent</span>
            </div>
            <p className="text-[11px] text-blue-600/90 leading-relaxed">
              We dispatched a 6-digit verification code to <strong>{formData.email}</strong>. Please check your email inbox (or spam folder).
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-slate-600">
              Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value);
                setError('');
              }}
              maxLength={6}
              placeholder="Enter 6-digit code from email"
              className="w-full px-4 py-3 text-center tracking-widest font-mono text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Verify Code & Complete Registration
          </Button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Back to Registration Details
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;