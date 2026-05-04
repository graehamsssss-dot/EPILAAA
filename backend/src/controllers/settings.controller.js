import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, setting_key, setting_value, created_at, updated_at
       FROM settings
       WHERE user_id = ? OR user_id IS NULL
       ORDER BY id DESC`,
      [req.user.id]
    );

    const parsedSettings = rows.map((item) => {
      let parsedValue = item.setting_value;

      try {
        parsedValue = JSON.parse(item.setting_value);
      } catch {
        parsedValue = item.setting_value;
      }

      return {
        ...item,
        setting_value: parsedValue
      };
    });

    return successResponse(res, 'Settings fetched', parsedSettings);
  } catch (error) {
    next(error);
  }
};

export const saveSetting = async (req, res, next) => {
  try {
    const { settingKey, settingValue } = req.body;

    if (!settingKey) {
      return errorResponse(res, 'Setting key is required', 400);
    }

    const serializedValue =
      typeof settingValue === 'string'
        ? settingValue
        : JSON.stringify(settingValue);

    const [existing] = await pool.query(
      `SELECT id
       FROM settings
       WHERE user_id = ? AND setting_key = ?
       LIMIT 1`,
      [req.user.id, settingKey]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE settings
         SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [serializedValue, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO settings (user_id, setting_key, setting_value)
         VALUES (?, ?, ?)`,
        [req.user.id, settingKey, serializedValue]
      );
    }

    return successResponse(res, 'Setting saved');
  } catch (error) {
    next(error);
  }
};