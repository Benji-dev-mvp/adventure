import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state across the application
 * Provides user information, authentication status, and auth operations
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to load user from localStorage on mount
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('artisan_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // In a real app, we would validate the token with the backend:
        // const response = await apiClient.get('/auth/me');
        // setUser(response.data);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError(err);
        // Clear invalid stored user
        localStorage.removeItem('artisan_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('artisan_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('artisan_user');
    localStorage.removeItem('artisan_token');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('artisan_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    setUser,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
