import { successResponse } from '../utils/response.js';

export const getQueue = async (req, res, next) => {
  try {
    return successResponse(res, 'Queue fetched', [
      {
        id: 1,
        patientName: 'Juan Dela Cruz',
        scheduledTime: '08:30 AM',
        service: 'General Check Up',
        date: '2026-03-22',
        status: 'Waiting'
      }
    ]);
  } catch (error) {
    next(error);
  }
};

export const updateQueueStatus = async (req, res, next) => {
  try {
    return successResponse(res, 'Queue status updated');
  } catch (error) {
    next(error);
  }
};