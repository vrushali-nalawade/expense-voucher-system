import { userService } from '../services/user.service.js';

export const userController = {
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
};

export default userController;