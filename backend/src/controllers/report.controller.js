import { pool } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getMonthlyReports = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM monthly_reports ORDER BY report_year DESC, id DESC'
    );

    return successResponse(res, 'Monthly reports fetched', rows);
  } catch (error) {
    next(error);
  }
};