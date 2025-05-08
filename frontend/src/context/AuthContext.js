import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Demo user credentials
const DEMO_USER = {
  email: 'demo@aibuilder.com',
  password: 'builder123', 
  name: 'Demo User',
  avatar: 'D'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - validates against demo credentials
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API request delay
      setTimeout(() => {
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
          const userData = { 
            email: DEMO_USER.email,
            name: DEMO_USER.name,
            avatar: DEMO_USER.avatar
          };
          
          // Store auth data in localStorage
          localStorage.setItem('authUser', JSON.stringify(userData));
          setUser(userData);
          resolve(userData);
        } else {
          reject({ message: 'Invalid email or password' });
        }
      }, 800); // Simulating network delay
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  // Create an auth value object with user state and auth methods
  const authValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};