import { successResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    return successResponse(res, 'Dashboard summary fetched', {
      patientsInQueue: 18,
      lowStockItems: 6,
      reports: 12,
      completedToday: 27,
      dailyPatientCount: [45, 58, 50, 72, 60, 80, 64],
      weeklyBookings: [20, 25, 18, 30, 27, 32, 29],
      monthlyTrends: [140, 180, 170, 220, 210, 245]
    });
  } catch (error) {
    next(error);
  }
};