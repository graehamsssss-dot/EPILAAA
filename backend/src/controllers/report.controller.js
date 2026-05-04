import { pool } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getReports = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         report_month,
         report_year,
         patient_count,
         service_count,
         queue_completion_rate,
         low_stock_summary,
         report_data,
         created_at,
         updated_at
       FROM monthly_reports
       ORDER BY report_year DESC, FIELD(report_month,
         'January','February','March','April','May','June',
         'July','August','September','October','November','December'
       ) DESC`
    );

    const parsed = rows.map((row) => {
      let reportData = row.report_data;

      try {
        reportData =
          typeof row.report_data === 'string'
            ? JSON.parse(row.report_data)
            : row.report_data;
      } catch {
        reportData = row.report_data;
      }

      return {
        ...row,
        report_data: reportData
      };
    });

    return successResponse(res, 'Reports fetched', parsed);
  } catch (error) {
    next(error);
  }
};