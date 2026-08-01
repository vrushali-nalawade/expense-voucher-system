import { dashboardService } from '../services/dashboard.service.js';

export const dashboardController = {
  getEmployeeStats: async (req, res, next) => {
    try {
      const stats = await dashboardService.getEmployeeMetrics(req.user.id);
      return res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  },

  getDirectorStats: async (req, res, next) => {
    try {
      const stats = await dashboardService.getDirectorMetrics();
      return res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  },

  getAccountsStats: async (req, res, next) => {
    try {
      const stats = await dashboardService.getAccountsMetrics();
      return res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  },
};

export default dashboardController;