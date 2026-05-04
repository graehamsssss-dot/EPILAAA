import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCurrentUserProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, is_active, created_at, updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return errorResponse(res, 'User not found', 404);
    }

    const user = rows[0];

    const [settingsRows] = await pool.query(
      `SELECT setting_value
       FROM settings
       WHERE user_id = ? AND setting_key = 'admin_profile'
       LIMIT 1`,
      [req.user.id]
    );

    let profileExtras = {
      fullName: '',
      contactNumber: ''
    };

    if (settingsRows.length) {
      try {
        const parsed = JSON.parse(settingsRows[0].setting_value);
        profileExtras = {
          ...profileExtras,
          ...parsed
        };
      } catch {
        // keep defaults
      }
    }

    return successResponse(res, 'User profile fetched', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      fullName: profileExtras.fullName || '',
      contactNumber: profileExtras.contactNumber || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const { fullName, email, contactNumber } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    const [existingUsers] = await pool.query(
      `SELECT id
       FROM users
       WHERE email = ? AND id != ?
       LIMIT 1`,
      [email, req.user.id]
    );

    if (existingUsers.length) {
      return errorResponse(res, 'Email is already in use', 409);
    }

    await pool.query(
      `UPDATE users
       SET email = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [email, req.user.id]
    );

    const profilePayload = JSON.stringify({
      fullName: fullName || '',
      contactNumber: contactNumber || ''
    });

    const [existingSetting] = await pool.query(
      `SELECT id
       FROM settings
       WHERE user_id = ? AND setting_key = 'admin_profile'
       LIMIT 1`,
      [req.user.id]
    );

    if (existingSetting.length) {
      await pool.query(
        `UPDATE settings
         SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [profilePayload, existingSetting[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO settings (user_id, setting_key, setting_value)
         VALUES (?, 'admin_profile', ?)`,
        [req.user.id, profilePayload]
      );
    }

    return successResponse(res, 'Admin profile updated successfully');
  } catch (error) {
    next(error);
  }
};