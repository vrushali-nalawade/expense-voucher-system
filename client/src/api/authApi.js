import axiosInstance from './axios.js';

const USERS_STORAGE_KEY = 'voucherflow_registered_users_db_v7';
const PENDING_OTP_KEY = 'voucherflow_pending_otp_records_v7';

const defaultRegisteredUsers = [
  {
    id: 1,
    name: 'Alex Rivera',
    email: 'employee@company.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    signature_url: null,
  },
  {
    id: 2,
    name: 'Sarah Vance',
    email: 'director@company.com',
    password: 'password123',
    role: 'Director',
    department: 'Executive',
    signature_url: null,
  },
  {
    id: 3,
    name: 'David Miller',
    email: 'accounts@company.com',
    password: 'password123',
    role: 'Accounts',
    department: 'Finance',
    signature_url: null,
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
      const targetRole = credentials.role ? credentials.role.toLowerCase() : 'employee';

      const user = users.find((u) => {
        const emailMatch = u.email?.toLowerCase() === credentials.email?.toLowerCase();
        const roleMatch = u.role?.toLowerCase() === targetRole;
        return emailMatch && roleMatch;
      });

      if (!user) {
        throw new Error(`No ${credentials.role} account found for ${credentials.email}. Please register for a ${credentials.role} account.`);
      }

      if (user.password !== credentials.password) {
        throw new Error('Invalid password. Please enter the exact password created during registration.');
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          signature_url: user.signature_url || null,
        },
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
      };
    }
  },

  register: async (userData, inputOtp) => {
    const pendingOtps = JSON.parse(localStorage.getItem(PENDING_OTP_KEY) || '{}');
    const storedRecord = pendingOtps[userData.email?.toLowerCase()];

    if (!storedRecord || storedRecord.otp !== inputOtp) {
      throw new Error('Invalid verification code. Please check your email inbox and enter the 6-digit code.');
    }

    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const users = getRegisteredUsers();
      const existingSameRole = users.find(
        (u) => u.email?.toLowerCase() === userData.email?.toLowerCase() && u.role?.toLowerCase() === userData.role?.toLowerCase()
      );

      if (existingSameRole) {
        throw new Error(`An account with email ${userData.email} already exists for the ${userData.role} role. Please sign in.`);
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'Employee',
        department: userData.department || 'Engineering',
        signature_url: null,
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
          signature_url: null,
        },
        token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      };
    }
  },

  sendEmailOtp: async (email) => {
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));

    const pendingOtps = JSON.parse(localStorage.getItem(PENDING_OTP_KEY) || '{}');
    pendingOtps[email.toLowerCase()] = {
      otp: generatedOtp,
      createdAt: Date.now(),
    };
    localStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pendingOtps));

    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_zevcfbl',
          template_id: 'template_wdu0veq',
          user_id: '8lFlVzx_urYCAvLvI',
          template_params: {
            to_email: email,
            user_email: email,
            email: email,
            recipient: email,
            otp_code: generatedOtp,
            passcode: generatedOtp,
            code: generatedOtp,
            message: `Your VoucherFlow verification code is ${generatedOtp}`,
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

  handleGoogleCredential: async (credentialToken, selectedRole = 'Employee') => {
    const payload = parseJwt(credentialToken);
    const email = payload?.email || 'google.user@company.com';
    const name = payload?.name || (selectedRole === 'Director' ? 'Sarah Vance' : selectedRole === 'Accounts' ? 'David Miller' : 'Alex Rivera');

    const users = getRegisteredUsers();
    let user = users.find((u) => u.email?.toLowerCase() === email?.toLowerCase() && u.role?.toLowerCase() === selectedRole.toLowerCase());

    if (!user) {
      user = {
        id: Date.now(),
        name,
        email,
        password: 'google-oauth-authenticated',
        role: selectedRole || 'Employee',
        department: selectedRole === 'Director' ? 'Executive' : selectedRole === 'Accounts' ? 'Finance' : 'Engineering',
        signature_url: null,
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
        signature_url: user.signature_url || null,
      },
      token: credentialToken || `mock-google-token-${user.id}`,
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
    const users = getRegisteredUsers();
    const currentStoredUser = JSON.parse(localStorage.getItem('voucher_auth_user') || '{}');
    const targetEmail = currentStoredUser.email || profileData.email;
    const targetRole = currentStoredUser.role || profileData.role;

    const updatedUsers = users.map((u) => {
      if (u.email?.toLowerCase() === targetEmail?.toLowerCase() && u.role?.toLowerCase() === targetRole?.toLowerCase()) {
        return { ...u, ...profileData };
      }
      return u;
    });
    saveRegisteredUsers(updatedUsers);

    const updatedCurrent = { ...currentStoredUser, ...profileData };
    localStorage.setItem('voucher_auth_user', JSON.stringify(updatedCurrent));
    return updatedCurrent;
  },

  deleteAccount: (email, role) => {
    const users = getRegisteredUsers();
    const currentStoredUser = JSON.parse(localStorage.getItem('voucher_auth_user') || '{}');
    const targetEmail = email || currentStoredUser.email;
    const targetRole = role || currentStoredUser.role;

    const filteredUsers = users.filter(
      (u) => !(u.email?.toLowerCase() === targetEmail?.toLowerCase() && u.role?.toLowerCase() === targetRole?.toLowerCase())
    );
    saveRegisteredUsers(filteredUsers);

    localStorage.removeItem('voucher_auth_user');
    localStorage.removeItem('voucher_auth_token');
  },
};

export default authApi;