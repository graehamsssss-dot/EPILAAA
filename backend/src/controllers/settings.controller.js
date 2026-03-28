import { pool } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM settings
       WHERE user_id = ? OR user_id IS NULL
       ORDER BY id DESC`,
      [req.user.id]
    );

    return successResponse(res, 'Settings fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const saveSetting = async (req, res, next) => {
  try {
    const { settingKey, settingValue } = req.body;

    await pool.query(
      `INSERT INTO settings (user_id, setting_key, setting_value)
       VALUES (?, ?, ?)`,
      [req.user.id, settingKey, settingValue]
    );

    return successResponse(res, 'Setting saved');
  } catch (error) {
    next(error);
  }
};