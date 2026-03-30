export type UserRole = 'admin' | 'patient';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  role: UserRole;
  patientId?: string | null;
}

export interface RegisterPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  age?: number | null;
  sex: string;
  civilStatus?: string;
  contactNumber: string;
  email?: string;
  barangay: string;
  purok?: string;
  address?: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship?: string;
  philhealthId?: string;
  bloodType?: string;
  allergies?: string;
  existingConditions?: string;
  password: string;
}

export interface RegisterData {
  token: string;
  role: UserRole;
  patientId: string;
  qrCode: string;
}