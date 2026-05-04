export interface CurrentUserProfile {
  id: number;
  email: string;
  role: 'admin' | 'patient';
  isActive: number;
  fullName: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}