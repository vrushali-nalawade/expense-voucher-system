import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import authApi from '../../api/authApi.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Employee',
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');

    try {
      const response = await authApi.login(formData);
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
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const response = await authApi.googleLogin(formData.role);
      login(response.user, response.token);
      navigate('/employee/dashboard');
    } catch (err) {
      setServerError('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (role) => {
    const demoEmails = {
      Employee: 'vrushalinalawade108@gmail.com',
      Director: 'sarah.director@company.com',
      Accounts: 'david.accounts@company.com',
    };
    setFormData({
      email: demoEmails[role],
      password: 'password123',
      role,
    });
    setServerError('');
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to VoucherFlow</h2>
        <p className="text-xs text-slate-500">Access your enterprise expense reimbursement workspace</p>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          Quick Demo Portal Switcher
        </span>
        <div className="grid grid-cols-3 gap-2">
          {['Employee', 'Director', 'Accounts'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setDemoRole(role)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                formData.role === role
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {serverError && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-medium">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold uppercase text-slate-600">Password</label>
            <Link to="/forgot-password" className="text-[11px] font-semibold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={loading} rightIcon={ArrowRight}>
          Sign In
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-100 w-full" />
        <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">Or</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-slate-700 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Sign in with Google
      </button>

      <p className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-blue-600 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;