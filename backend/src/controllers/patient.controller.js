import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT *
       FROM patients
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      return errorResponse(res, 'Patient profile not found', 404);
    }

    return successResponse(res, 'Patient profile fetched', rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
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
      existingConditions
    } = req.body;

    await pool.query(
      `UPDATE patients
       SET
         contact_number = ?,
         email = ?,
         barangay = ?,
         purok = ?,
         address = ?,
         emergency_contact_name = ?,
         emergency_contact_number = ?,
         emergency_relationship = ?,
         philhealth_id = ?,
         blood_type = ?,
         allergies = ?,
         existing_conditions = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
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
        userId
      ]
    );

    return successResponse(res, 'Patient profile updated');
  } catch (error) {
    next(error);
  }
};