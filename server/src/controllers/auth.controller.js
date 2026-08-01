import { userService } from '../services/user.service.js';
import { authService } from '../services/auth.service.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await authService.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = authService.generateToken(user);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { name, email, password, role, department } = req.body;

      const existing = await userService.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const passwordHash = await authService.hashPassword(password);
      const newUser = await userService.createUser({
        name,
        email,
        passwordHash,
        role: role || 'Employee',
        department,
      });

      const token = authService.generateToken(newUser);

      return res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;