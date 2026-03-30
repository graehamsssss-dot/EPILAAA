import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, bookingTime, notes } = req.body;

    if (!serviceId || !bookingDate || !bookingTime) {
      return errorResponse(res, 'Missing required booking fields', 400);
    }

    const [patientRows] = await pool.query(
      'SELECT id FROM patients WHERE user_id = ? LIMIT 1',
      [req.user.id]
    );

    if (!patientRows.length) {
      return errorResponse(res, 'Patient record not found', 404);
    }

    const patientId = patientRows[0].id;

    const [serviceRows] = await pool.query(
      'SELECT id, slot_limit, status FROM services WHERE id = ? LIMIT 1',
      [serviceId]
    );

    if (!serviceRows.length) {
      return errorResponse(res, 'Service not found', 404);
    }

    if (serviceRows[0].status !== 'Active') {
      return errorResponse(res, 'Service is not available for booking', 400);
    }

    const [existingBookings] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM bookings
       WHERE service_id = ?
         AND booking_date = ?
         AND booking_time = ?
         AND status IN ('Pending', 'Confirmed')`,
      [serviceId, bookingDate, bookingTime]
    );

    if (existingBookings[0].total >= serviceRows[0].slot_limit) {
      return errorResponse(res, 'No available slots for this schedule', 400);
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings
        (
          patient_id,
          service_id,
          booking_date,
          booking_time,
          status,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [patientId, serviceId, bookingDate, bookingTime, 'Pending', notes || null]
      );

      const bookingId = bookingResult.insertId;

      await connection.query(
        `INSERT INTO patient_queue (booking_id, queue_number, status)
         VALUES (?, ?, ?)`,
        [bookingId, `Q-${bookingId}`, 'Waiting']
      );

      await connection.commit();

      return successResponse(res, 'Booking created successfully', { id: bookingId }, 201);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         b.id,
         s.service_name,
         s.category,
         b.booking_date,
         b.booking_time,
         b.status,
         b.notes,
         pq.queue_number,
         pq.called_at,
         pq.completed_at
       FROM bookings b
       INNER JOIN patients p ON p.id = b.patient_id
       INNER JOIN services s ON s.id = b.service_id
       LEFT JOIN patient_queue pq ON pq.booking_id = b.id
       WHERE p.user_id = ?
       ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [req.user.id]
    );

    return successResponse(res, 'Bookings fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id
       FROM bookings b
       INNER JOIN patients p ON p.id = b.patient_id
       WHERE b.id = ? AND p.user_id = ?
       LIMIT 1`,
      [req.params.id, req.user.id]
    );

    if (!rows.length) {
      return errorResponse(res, 'Booking not found', 404);
    }

    await pool.query(
      `UPDATE bookings
       SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.params.id]
    );

    await pool.query(
      `UPDATE patient_queue
       SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = ?`,
      [req.params.id]
    );

    return successResponse(res, 'Booking cancelled');
  } catch (error) {
    next(error);
  }
};