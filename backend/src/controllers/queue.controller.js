import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getQueue = async (req, res, next) => {
  try {
    const { date, service } = req.query;

    let query = `
      SELECT
        pq.id,
        pq.booking_id,
        pq.queue_number,
        pq.status,
        b.booking_date,
        b.booking_time,
        s.service_name,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name
      FROM patient_queue pq
      INNER JOIN bookings b ON b.id = pq.booking_id
      INNER JOIN services s ON s.id = b.service_id
      INNER JOIN patients p ON p.id = b.patient_id
      WHERE 1 = 1
    `;

    const params = [];

    if (date) {
      query += ' AND b.booking_date = ?';
      params.push(date);
    }

    if (service) {
      query += ' AND s.service_name = ?';
      params.push(service);
    }

    query += ' ORDER BY b.booking_date DESC, b.booking_time ASC';

    const [rows] = await pool.query(query, params);
    return successResponse(res, 'Queue fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const updateQueueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, 'Status is required', 400);
    }

    await pool.query(
      `UPDATE patient_queue
       SET
         status = ?,
         called_at = CASE WHEN ? = 'In Progress' THEN NOW() ELSE called_at END,
         completed_at = CASE WHEN ? = 'Completed' THEN NOW() ELSE completed_at END,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, status, status, id]
    );

    if (status === 'Completed') {
      const [queueRows] = await pool.query(
        'SELECT booking_id FROM patient_queue WHERE id = ? LIMIT 1',
        [id]
      );

      if (queueRows.length) {
        await pool.query(
          `UPDATE bookings
           SET status = 'Completed', updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [queueRows[0].booking_id]
        );
      }
    }

    if (status === 'Cancelled' || status === 'No Show') {
      const [queueRows] = await pool.query(
        'SELECT booking_id FROM patient_queue WHERE id = ? LIMIT 1',
        [id]
      );

      if (queueRows.length) {
        await pool.query(
          `UPDATE bookings
           SET status = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [status, queueRows[0].booking_id]
        );
      }
    }

    return successResponse(res, 'Queue status updated');
  } catch (error) {
    next(error);
  }
};