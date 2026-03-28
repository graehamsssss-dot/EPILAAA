import { pool } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const [[queueCount]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM patient_queue
       WHERE status IN ('Waiting', 'In Progress')`
    );

    const [[lowStockCount]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM inventory_items
       WHERE status = 'Low Stock'`
    );

    const [[reportCount]] = await pool.query(
      'SELECT COUNT(*) AS total FROM monthly_reports'
    );

    const [[completedToday]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM patient_queue
       WHERE status = 'Completed'
         AND DATE(completed_at) = CURDATE()`
    );

    return successResponse(res, 'Dashboard summary fetched', {
      patientsInQueue: queueCount.total,
      lowStockItems: lowStockCount.total,
      reports: reportCount.total,
      completedToday: completedToday.total
    });
  } catch (error) {
    next(error);
  }
};