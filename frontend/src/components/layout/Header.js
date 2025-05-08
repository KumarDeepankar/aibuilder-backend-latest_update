import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LoginModal from '../common/LoginModal';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  color: #333;
  position: relative;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  
  a {
    color: #333;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  
  .logo-icon {
    margin-right: 4px;
  }
`;

const LogoIcon = styled.div`
  background-color: #3B82F6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 6px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavOverlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
`;

const MobileNav = styled.nav`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  width: 75%;
  max-width: 300px;
  height: 100vh;
  background-color: #1c1f26;
  z-index: 100;
  padding: 2rem;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  
  a {
    margin: 1rem 0;
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  
  button {
    margin: 0.5rem 0;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
  }
`;

const NavLinks = styled.div`
  display: flex;
  margin-right: 2rem;
  
  a {
    margin: 0 1.25rem;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: #3B82F6;
    }
    
    &.active {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #3B82F6;
        border-radius: 1px;
      }
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  
  .sign-in {
    color: #3B82F6;
    font-weight: 500;
    text-decoration: none;
    margin-right: 1.5rem;
    font-size: 0.95rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled(Link)`
  color: #3B82F6;
  font-weight: 500;
  text-decoration: none;
  margin-right: 1.5rem;
  font-size: 0.95rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DemoButton = styled.button`
  background-color: #3B82F6;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:hover {
    background-color: #2563EB;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const openLoginModal = () => {
    setLoginModalOpen(true);
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };
  
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  
  return (
    <>
      <HeaderWrapper className="site-header" role="banner">
        <Logo className="site-logo">
          <a href="/" aria-label="CodeAI Home">
            <LogoIcon>{'</>'}</LogoIcon>
            CodeAI
          </a>
        </Logo>
        <Nav className="desktop-nav" role="navigation" aria-label="Main Navigation">
          <NavLinks className="nav-links">
            <a href="/" className="nav-link active" aria-current="page">Home</a>
            <a href="/what-we-offer" className="nav-link">What we Offer</a>
            <a href="/platform" className="nav-link">Platform</a>
          </NavLinks>
          <AuthButtons className="auth-buttons">
            <LoginButton 
              to="/signin" 
              className="sign-in"
              aria-label="Sign in to your account"
            >
              Sign In
            </LoginButton>
            <DemoButton className="demo-button" aria-label="Request a demo">
              Request Demo
            </DemoButton>
          </AuthButtons>
        </Nav>
        
        <HamburgerButton 
          onClick={toggleMobileMenu} 
          className="hamburger-button" 
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          ☰
        </HamburgerButton>
        
        <MobileNavOverlay isOpen={mobileMenuOpen} onClick={closeMobileMenu} className="mobile-nav-overlay" />
        
        <MobileNav 
          isOpen={mobileMenuOpen} 
          className="mobile-nav" 
          id="mobile-menu" 
          role="navigation" 
          aria-label="Mobile Navigation"
        >
          <CloseButton 
            onClick={closeMobileMenu} 
            className="close-menu-button" 
            aria-label="Close mobile menu"
          >
            ✕
          </CloseButton>
          <MobileNavLinks className="mobile-nav-links">
            <a href="/" onClick={closeMobileMenu} className="mobile-nav-link active" aria-current="page">Home</a>
            <a href="/what-we-offer" onClick={closeMobileMenu} className="mobile-nav-link">What We Offer</a>
            <a href="/platform" onClick={closeMobileMenu} className="mobile-nav-link">Platform</a>
          </MobileNavLinks>
          <MobileAuthButtons className="mobile-auth-buttons">
            <LoginButton 
              to="/signin"
              onClick={closeMobileMenu}
              className="mobile-login-button" 
              aria-label="Sign in to your account"
            >
              Sign In
            </LoginButton>
            <DemoButton onClick={closeMobileMenu} className="mobile-demo-button" aria-label="Request a demo">
              Request Demo
            </DemoButton>
          </MobileAuthButtons>
        </MobileNav>
      </HeaderWrapper>
      
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  );
};

export default Header;