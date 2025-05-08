import React, { useState } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import OfferingsSection from './components/sections/OfferingsSection';
import StatisticsSection from './components/sections/StatisticsSection';
import WhyChooseSection from './components/sections/WhyChooseSection';
import ContactSection from './components/sections/ContactSection';
import Dashboard from './components/dashboard/Dashboard';
import PromptToPage from './components/tools/PromptToPage';
import CodeAssistant from './components/tools/CodeAssistant';
import Projects from './components/tools/Projects';
import LoginModal from './components/common/LoginModal';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CreateNewProject from './pages/CreateNewProject';
import AdobeFranklinProject from './pages/AdobeFranklinProject';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  background: #4285f4;
  color: white;
  padding: 10px;
  z-index: 9999;
  
  &:focus {
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    overflow: visible;
  }
`;

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state if still checking auth
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise render the children
  return children;
};

// Home page component
const HomePage = ({ openLoginModal }) => {
  return (
    <>
      <Header onLoginClick={openLoginModal} />
      <Main id="main-content" tabIndex="-1">
        <HeroSection />
        <OfferingsSection />
        <StatisticsSection />
        <WhyChooseSection />
        <ContactSection />
      </Main>
      <Footer />
    </>
  );
};

// Create a wrapper component to get the theme and pass it to StyledThemeProvider
const ThemedApp = () => {
  const { theme } = useTheme();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  const openLoginModal = () => {
    setLoginModalOpen(true);
  };
  
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  
  // Make sure theme.colors exists before passing to StyledThemeProvider
  const safeTheme = theme && theme.colors ? theme : { colors: {} };
  
  return (
    <StyledThemeProvider theme={safeTheme}>
      <AppContainer>
        <SkipLink href="#main-content" className="skip-link">Skip to main content</SkipLink>
        
        <Routes>
          <Route 
            path="/" 
            element={<HomePage openLoginModal={openLoginModal} />} 
          />
          <Route 
            path="/signin" 
            element={<SignIn />} 
          />
          <Route 
            path="/signup" 
            element={<SignUp />} 
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/prompt-to-page" element={
            <ProtectedRoute>
              <PromptToPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/code-assistant" element={
            <ProtectedRoute>
              <CodeAssistant />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/create-new-project" element={
            <ProtectedRoute>
              <CreateNewProject />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/adobe-franklin-project" element={
            <ProtectedRoute>
              <AdobeFranklinProject />
            </ProtectedRoute>
          } />
          {/* Catch all route to redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <LoginModal 
          isOpen={loginModalOpen}
          onClose={closeLoginModal}
        />
      </AppContainer>
    </StyledThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ThemedApp />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
