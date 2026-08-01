import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authService = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },

  generateToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });
  },

  verifyToken: (token) => {
    return jwt.verify(token, env.jwt.secret);
  },
};

export default authService;