export interface PatientProfile {
  id: number;
  user_id: number;
  patient_id: string;
  qr_code: string | null;

  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;

  birth_date: string;
  age: number | null;
  sex: string;
  civil_status: string | null;

  contact_number: string;
  email: string | null;
  barangay: string;
  purok: string | null;
  address: string | null;

  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_relationship: string | null;

  philhealth_id: string | null;
  blood_type: string | null;
  allergies: string | null;
  existing_conditions: string | null;

  created_at: string;
  updated_at: string;
}