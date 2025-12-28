/**
 * User Type Definitions
 */

export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  timezone?: string;
  token?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  emailDigest: 'never' | 'daily' | 'weekly';
  defaultView: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
}

export interface UpdatePreferencesDTO extends Partial<UserPreferences> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface PasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetDTO {
  token: string;
  newPassword: string;
}
