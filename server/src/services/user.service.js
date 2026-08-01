import { query } from '../config/db.js';

export const userService = {
  findUserByEmail: async (email) => {
    const result = await query(
      'SELECT id, name, email, password_hash AS password, role, department FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return result.rows[0] || null;
  },

  findUserById: async (id) => {
    const result = await query(
      'SELECT id, name, email, role, department, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  createUser: async (userData) => {
    const { name, email, passwordHash, role = 'Employee', department } = userData;
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, department, created_at`,
      [name, email, passwordHash, role, department]
    );
    return result.rows[0];
  },
};

export default userService;