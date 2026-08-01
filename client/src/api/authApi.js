import axiosInstance from './axios.js';

const USERS_STORAGE_KEY = 'voucherflow_registered_users_db_v4';
const PENDING_OTP_KEY = 'voucherflow_pending_otp_records_v4';

const defaultRegisteredUsers = [
  {
    id: 1,
    name: 'Vrushali Nalawade',
    email: 'vrushalinalawade108@gmail.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Sarah Vance (Director)',
    email: 'sarah.director@company.com',
    password: 'password123',
    role: 'Director',
    department: 'Executive',
  },
  {
    id: 3,
    name: 'David Miller (Accounts)',
    email: 'david.accounts@company.com',
    password: 'password123',
    role: 'Accounts',
    department: 'Finance',
  },
];

const getRegisteredUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse registered users database', e);
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultRegisteredUsers));
  return defaultRegisteredUsers;
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      const users = getRegisteredUsers();
      const user = users.find((u) => u.email?.toLowerCase() === credentials.email?.toLowerCase());

      if (!user) {
        throw new Error('No account found matching this email address. Please register first.');
      }

      if (user.password !== credentials.password) {
        throw new Error('Invalid email or password. Please enter the exact password created during sign up.');
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
      };
    }
  },

  register: async (userData, inputOtp) => {
    const pendingOtps = JSON.parse(localStorage.getItem(PENDING_OTP_KEY) || '{}');
    const storedRecord = pendingOtps[userData.email?.toLowerCase()];

    // Verify OTP code matches stored record
    if (!storedRecord || storedRecord.otp !== inputOtp) {
      throw new Error('Invalid verification code. Please check your email inbox and enter the 6-digit code.');
    }

    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const users = getRegisteredUsers();
      const existing = users.find((u) => u.email?.toLowerCase() === userData.email?.toLowerCase());
      if (existing) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'Employee',
        department: userData.department || 'Engineering',
      };

      const updated = [...users, newUser];
      saveRegisteredUsers(updated);

      delete pendingOtps[userData.email?.toLowerCase()];
      localStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pendingOtps));

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
        },
        token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      };
    }
  },

  sendEmailOtp: async (email) => {
    // Generate 6-digit numerical OTP code
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));

    const pendingOtps = JSON.parse(localStorage.getItem(PENDING_OTP_KEY) || '{}');
    pendingOtps[email.toLowerCase()] = {
      otp: generatedOtp,
      createdAt: Date.now(),
    };
    localStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pendingOtps));

    try {
      // Backend / EmailJS API call
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'default_service',
          template_id: 'template_otp',
          user_id: 'user_public_key',
          template_params: {
            to_email: email,
            otp_code: generatedOtp,
          },
        }),
      });
    } catch (e) {
      console.warn('Backend email API fallback engaged', e);
    }

    return {
      success: true,
      message: `A 6-digit OTP verification code has been dispatched to ${email}.`,
    };
  },

  handleGoogleCredential: async (credentialToken, role = 'Employee') => {
    const payload = parseJwt(credentialToken);
    if (!payload) {
      throw new Error('Failed to parse Google OAuth credentials.');
    }

    const email = payload.email;
    const name = payload.name;
    const users = getRegisteredUsers();

    let user = users.find((u) => u.email?.toLowerCase() === email?.toLowerCase());

    if (!user) {
      user = {
        id: Date.now(),
        name,
        email,
        password: 'google-oauth-authenticated',
        role: role || 'Employee',
        department: 'Engineering',
      };
      saveRegisteredUsers([...users, user]);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token: credentialToken,
    };
  },

  requestPasswordReset: async (email) => {
    return authApi.sendEmailOtp(email);
  },

  resetPassword: async ({ email, token, newPassword }) => {
    const pendingOtps = JSON.parse(localStorage.getItem(PENDING_OTP_KEY) || '{}');
    const storedRecord = pendingOtps[email?.toLowerCase()];

    if (!storedRecord || storedRecord.otp !== token) {
      throw new Error('Invalid verification code. Please check your email inbox.');
    }

    const users = getRegisteredUsers();
    const updated = users.map((u) => (u.email?.toLowerCase() === email?.toLowerCase() ? { ...u, password: newPassword } : u));
    saveRegisteredUsers(updated);
    return { success: true };
  },

  updateProfile: (profileData) => {
    const storedUser = localStorage.getItem('voucher_auth_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const updated = { ...parsed, ...profileData };
      localStorage.setItem('voucher_auth_user', JSON.stringify(updated));
    }
  },

  deleteAccount: () => {
    localStorage.removeItem('voucher_auth_user');
    localStorage.removeItem('voucher_auth_token');
  },
};

export default authApi;