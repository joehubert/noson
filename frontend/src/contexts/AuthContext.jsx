import { createContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has JWT token
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      // Verify token by fetching user info
      auth.getCurrentUser()
        .then(response => {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = () => {
    auth.login();
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
