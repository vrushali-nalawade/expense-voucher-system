import { query } from '../config/db.js';

export const userRepository = {
  findById: async (id) => {
    const result = await query(
      'SELECT id, name, email, role, department, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  getAllUsers: async () => {
    const result = await query(
      'SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },
};

export default userRepository;