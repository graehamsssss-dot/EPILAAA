import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getServices = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         service_name,
         category,
         description,
         available_days,
         schedule_date,
         start_time,
         end_time,
         slot_limit,
         status,
         linked_inventory_items,
         created_at,
         updated_at
       FROM services
       ORDER BY
         CASE WHEN schedule_date IS NULL THEN 1 ELSE 0 END,
         schedule_date ASC,
         service_name ASC`
    );

    return successResponse(res, 'Services fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const {
      serviceName,
      category,
      description,
      availableDays,
      scheduleDate,
      startTime,
      endTime,
      slotLimit,
      status,
      linkedInventoryItems
    } = req.body;

    if (!serviceName || !category || !startTime || !endTime) {
      return errorResponse(res, 'Required service fields are missing', 400);
    }

    const [result] = await pool.query(
      `INSERT INTO services (
         service_name,
         category,
         description,
         available_days,
         schedule_date,
         start_time,
         end_time,
         slot_limit,
         status,
         linked_inventory_items
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceName,
        category,
        description || null,
        availableDays || '',
        scheduleDate || null,
        startTime,
        endTime,
        Number(slotLimit || 0),
        status || 'Active',
        linkedInventoryItems || null
      ]
    );

    return successResponse(res, 'Service created successfully', {
      id: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
      category,
      description,
      availableDays,
      scheduleDate,
      startTime,
      endTime,
      slotLimit,
      status,
      linkedInventoryItems
    } = req.body;

    await pool.query(
      `UPDATE services
       SET service_name = ?,
           category = ?,
           description = ?,
           available_days = ?,
           schedule_date = ?,
           start_time = ?,
           end_time = ?,
           slot_limit = ?,
           status = ?,
           linked_inventory_items = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        serviceName,
        category,
        description || null,
        availableDays || '',
        scheduleDate || null,
        startTime,
        endTime,
        Number(slotLimit || 0),
        status || 'Active',
        linkedInventoryItems || null,
        id
      ]
    );

    return successResponse(res, 'Service updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM services WHERE id = ?`, [id]);

    return successResponse(res, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getServiceAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return errorResponse(res, 'Date is required', 400);
    }

    const [serviceRows] = await pool.query(
      `SELECT id, service_name, start_time, end_time, slot_limit, status
       FROM services
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!serviceRows.length) {
      return errorResponse(res, 'Service not found', 404);
    }

    const service = serviceRows[0];

    if (service.status !== 'Active') {
      return errorResponse(res, 'Service is inactive', 400);
    }

    const toMinutes = (value) => {
      const [hours, minutes] = value.slice(0, 5).split(':').map(Number);
      return hours * 60 + minutes;
    };

    const toTimeString = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    };

    const start = toMinutes(service.start_time);
    const end = toMinutes(service.end_time);

    const generatedSlots = [];
    for (let time = start; time < end; time += 30) {
      generatedSlots.push(toTimeString(time));
    }

    const [bookingRows] = await pool.query(
      `SELECT booking_time, COUNT(*) AS total
       FROM bookings
       WHERE service_id = ?
         AND booking_date = ?
         AND status IN ('Pending', 'Confirmed')
       GROUP BY booking_time`,
      [id, date]
    );

    const bookedMap = new Map(
      bookingRows.map((row) => [row.booking_time, Number(row.total)])
    );

    const slots = generatedSlots.map((time) => {
      const booked = bookedMap.get(time) || 0;
      const remaining = Math.max(service.slot_limit - booked, 0);

      return {
        time,
        booked,
        slotLimit: service.slot_limit,
        remaining,
        available: remaining > 0
      };
    });

    return successResponse(res, 'Service availability fetched', {
      serviceId: service.id,
      serviceName: service.service_name,
      date,
      slots
    });
  } catch (error) {
    next(error);
  }
};