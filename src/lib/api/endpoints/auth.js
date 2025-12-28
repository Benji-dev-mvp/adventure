/**
 * Authentication API Endpoints
 */
import { apiClient } from '../client';

/**
 * Login with credentials
 */
export const login = async (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

/**
 * Register new user
 */
export const register = async (userData) => {
  return apiClient.post('/auth/register', userData);
};

/**
 * Logout current user
 */
export const logout = async () => {
  return apiClient.post('/auth/logout');
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  return apiClient.get('/auth/me');
};

/**
 * Update user profile
 */
export const updateProfile = async (data) => {
  return apiClient.put('/auth/profile', data);
};

/**
 * Change password
 */
export const changePassword = async (currentPassword, newPassword) => {
  return apiClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};

/**
 * Get user preferences
 */
export const getUserPreferences = async () => {
  return apiClient.get('/auth/preferences');
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (preferences) => {
  return apiClient.put('/auth/preferences', preferences);
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getUserPreferences,
  updateUserPreferences,
};
