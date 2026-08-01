import axiosInstance from './axios.js';

const USERS_STORAGE_KEY = 'voucherflow_registered_users_db';

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

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      const users = getRegisteredUsers();
      const user = users.find(u => u.email?.toLowerCase() === credentials.email?.toLowerCase());

      if (!user) {
        throw new Error('No user found with this email address. Please register first.');
      }

      // STRICT REAL-WORLD PASSWORD VALIDATION
      if (user.password !== credentials.password) {
        throw new Error('Incorrect password entered. Please try again or click Forgot Password.');
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

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const users = getRegisteredUsers();
      const existing = users.find(u => u.email?.toLowerCase() === userData.email?.toLowerCase());
      if (existing) {
        throw new Error('An account with this email address already exists.');
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

  googleLogin: async (role = 'Employee') => {
    return {
      user: {
        id: 99,
        name: 'Vrushali Nalawade',
        email: 'vrushalinalawade108@gmail.com',
        role,
        department: 'Engineering',
      },
      token: 'mock-google-oauth-token-999',
    };
  },

  requestPasswordReset: async (email) => {
    return {
      success: true,
      message: `Password reset verification code sent to ${email}`,
      demoToken: '123456',
    };
  },

  resetPassword: async ({ email, token, newPassword }) => {
    const users = getRegisteredUsers();
    const updated = users.map(u => u.email?.toLowerCase() === email?.toLowerCase() ? { ...u, password: newPassword } : u);
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