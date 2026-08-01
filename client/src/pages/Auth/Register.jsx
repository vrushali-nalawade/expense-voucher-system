import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth.js';
import { authApi } from '../../api/authApi.js';
import { DEPARTMENTS } from '../../utils/constants.js';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    department: 'Engineering',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = ['Employee', 'Director', 'Accounts'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Full name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.department) newErrors.department = 'Department selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.register(formData);
      login(response.user, response.token);

      const userRole = response.user.role?.toLowerCase();
      if (userRole === 'director' || userRole === 'admin') {
        navigate('/director/dashboard');
      } else if (userRole === 'accounts') {
        navigate('/accounts/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Create New Account</h2>
        <p className="text-xs text-slate-500">Sign up to submit and manage expense reimbursement vouchers</p>
      </div>

      {errors.form && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Vrushali Nalawade"
          leftIcon={User}
          error={errors.name}
          required
        />

        <Input
          label="Corporate Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="vrushali@company.com"
          leftIcon={Mail}
          error={errors.email}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Account Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          leftIcon={UserPlus}
          isLoading={loading}
          className="w-full mt-2"
        >
          Create Account & Sign In
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;