import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const registerPatient = async (req, res, next) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      birthDate,
      age,
      sex,
      civilStatus,
      contactNumber,
      email,
      barangay,
      purok,
      address,
      emergencyContactName,
      emergencyContactNumber,
      emergencyRelationship,
      philhealthId,
      bloodType,
      allergies,
      existingConditions,
      password
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !sex ||
      !contactNumber ||
      !barangay ||
      !emergencyContactName ||
      !emergencyContactNumber ||
      !password
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email || null]
    );

    if (email && existingUsers.length > 0) {
      return errorResponse(res, 'Email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const patientId = `EPILA-${Date.now()}`;
    const qrCode = patientId;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [userResult] = await connection.query(
        `INSERT INTO users (email, password_hash, role, is_active)
         VALUES (?, ?, ?, ?)`,
        [email || null, hashedPassword, 'patient', 1]
      );

      const userId = userResult.insertId;

      await connection.query(
        `INSERT INTO patients (
          user_id,
          patient_id,
          qr_code,
          first_name,
          middle_name,
          last_name,
          suffix,
          birth_date,
          age,
          sex,
          civil_status,
          contact_number,
          email,
          barangay,
          purok,
          address,
          emergency_contact_name,
          emergency_contact_number,
          emergency_relationship,
          philhealth_id,
          blood_type,
          allergies,
          existing_conditions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          patientId,
          qrCode,
          firstName,
          middleName || null,
          lastName,
          suffix || null,
          birthDate,
          age || null,
          sex,
          civilStatus || null,
          contactNumber,
          email || null,
          barangay,
          purok || null,
          address || null,
          emergencyContactName,
          emergencyContactNumber,
          emergencyRelationship || null,
          philhealthId || null,
          bloodType || null,
          allergies || null,
          existingConditions || null
        ]
      );

      await connection.commit();

      const token = signToken({
        id: userId,
        role: 'patient',
        patientId
      });

      return successResponse(
        res,
        'Patient registered successfully',
        {
          token,
          role: 'patient',
          patientId,
          qrCode
        },
        201
      );
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const [rows] = await pool.query(
      `SELECT
         u.id,
         u.email,
         u.password_hash,
         u.role,
         u.is_active,
         p.patient_id
       FROM users u
       LEFT JOIN patients p ON p.user_id = u.id
       WHERE u.email = ?
       LIMIT 1`,
      [email]
    );

    if (!rows.length) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const user = rows[0];

    if (!user.is_active) {
      return errorResponse(res, 'Account is inactive', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      patientId: user.patient_id || null
    });

    return successResponse(res, 'Login successful', {
      token,
      role: user.role,
      patientId: user.patient_id || null
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    return successResponse(res, 'Authenticated user', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters', 400);
    }

    const [rows] = await pool.query(
      `SELECT id, password_hash
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return errorResponse(res, 'User not found', 404);
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [hashedPassword, req.user.id]
    );

    return successResponse(res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};