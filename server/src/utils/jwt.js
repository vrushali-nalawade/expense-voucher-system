import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

export default {
  signToken,
  verifyJwtToken,
};