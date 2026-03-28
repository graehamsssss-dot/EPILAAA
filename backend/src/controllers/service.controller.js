import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getServices = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM services ORDER BY id DESC'
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
      startTime,
      endTime,
      slotLimit,
      status,
      linkedInventoryItems
    } = req.body;

    if (!serviceName || !category || !availableDays || !startTime || !endTime) {
      return errorResponse(res, 'Missing required service fields', 400);
    }

    const [result] = await pool.query(
      `INSERT INTO services
      (
        service_name,
        category,
        description,
        available_days,
        start_time,
        end_time,
        slot_limit,
        status,
        linked_inventory_items
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceName,
        category,
        description || null,
        availableDays,
        startTime,
        endTime,
        slotLimit || 0,
        status || 'Active',
        linkedInventoryItems || null
      ]
    );

    return successResponse(res, 'Service created', { id: result.insertId }, 201);
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
      startTime,
      endTime,
      slotLimit,
      status,
      linkedInventoryItems
    } = req.body;

    await pool.query(
      `UPDATE services
       SET
         service_name = ?,
         category = ?,
         description = ?,
         available_days = ?,
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
        availableDays,
        startTime,
        endTime,
        slotLimit || 0,
        status || 'Active',
        linkedInventoryItems || null,
        id
      ]
    );

    return successResponse(res, 'Service updated');
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    return successResponse(res, 'Service deleted');
  } catch (error) {
    next(error);
  }
};