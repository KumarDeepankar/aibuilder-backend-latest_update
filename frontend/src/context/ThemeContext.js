import React, { createContext, useState, useContext, useEffect } from 'react';

// Theme definitions
export const lightTheme = {
  name: 'light',
  colors: {
    background: '#f5f7fa',
    surface: '#ffffff',
    surfaceHover: '#f0f2f5',
    border: '#e1e4e8',
    borderLight: '#f0f2f5',
    primary: '#4285f4',
    primaryLight: '#e8f0fe',
    primaryDark: '#1a73e8',
    primarySoft: 'rgba(66, 133, 244, 0.15)',
    primaryHover: '#1a73e8',
    primaryShadow: 'rgba(66, 133, 244, 0.3)',
    success: '#34a853',
    successLight: '#e6f4ea',
    info: '#4285f4',
    infoLight: '#e8f0fe',
    warning: '#fbbc05',
    warningLight: '#fef7e0',
    error: '#ea4335',
    errorLight: '#fce8e6',
    text: '#2c303a',
    textSecondary: '#6c757d',
    sidebarBackground: '#ffffff',
    sidebarBorder: '#e1e4e8',
    cardBackground: '#ffffff',
    cardBorder: '#e1e4e8',
    cardShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    inputBackground: '#ffffff',
    inputBorder: '#e1e4e8',
    inputText: '#2c303a',
    inputPlaceholder: '#6c757d',
    inputHoverBackground: '#f0f2f5',
    iconColor: '#6c757d',
    shadow: 'rgba(0, 0, 0, 0.1)'
  }
};

export const darkTheme = {
  name: 'dark',
  colors: {
    background: '#1c1f26',
    surface: '#2c303a',
    surfaceHover: '#373c48',
    border: '#2c303a',
    borderLight: '#373c48',
    primary: '#4285f4',
    primaryLight: '#1c2a43',
    primaryDark: '#5a95f5',
    primarySoft: 'rgba(66, 133, 244, 0.15)',
    primaryHover: '#5a95f5',
    primaryShadow: 'rgba(66, 133, 244, 0.3)',
    success: '#34a853',
    successLight: '#0f2a1b',
    info: '#4285f4',
    infoLight: '#1c2a43',
    warning: '#fbbc05',
    warningLight: '#2e2a15',
    error: '#ea4335',
    errorLight: '#2d1a1a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    sidebarBackground: '#12151C',
    sidebarBorder: '#2c303a',
    cardBackground: '#2c303a',
    cardBorder: '#2c303a',
    cardShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    inputBackground: '#2c303a',
    inputBorder: '#2c303a',
    inputText: '#ffffff',
    inputPlaceholder: '#a0a0a0',
    inputHoverBackground: '#373c48',
    iconColor: '#a0a0a0',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
};

// Create the theme context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage or default to dark theme
  const [currentTheme, setCurrentTheme] = useState(darkTheme);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme === 'light' ? lightTheme : darkTheme);
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = currentTheme.name === 'dark' ? lightTheme : darkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme.name);
  };

  // Set a specific theme
  const setTheme = (themeName) => {
    const newTheme = themeName === 'light' ? lightTheme : darkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', themeName);
  };

  const themeValue = {
    theme: currentTheme,
    toggleTheme,
    setTheme,
    isDarkMode: currentTheme.name === 'dark'
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};