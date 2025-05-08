import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const SidebarContainer = styled.aside`
  width: ${props => props.isCollapsed ? '70px' : '240px'};
  height: 100vh;
  background-color: ${props => props.theme.colors.sidebarBackground};
  border-right: 1px solid ${props => props.theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: width 0.3s ease;
  
  @media (max-width: 768px) {
    width: 70px;
  }
`;

const LogoContainer = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.sidebarBorder};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 1rem;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: bold;
  font-size: 1.25rem;
  
  svg {
    width: 28px;
    height: 28px;
    margin-right: ${props => props.isCollapsed ? '0' : '0.75rem'};
    color: #5654a2;
  }
  
  span {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const NavContainer = styled.nav`
  padding: 1.5rem 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.sidebarBorder};
    border-radius: 6px;
  }
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem ${props => props.isCollapsed ? '0' : '1.5rem'};
  color: ${props => props.active ? '#5654a2' : props.theme.colors.textSecondary};
  background-color: ${props => props.active ? 'rgba(86, 84, 162, 0.1)' : 'transparent'};
  text-decoration: none;
  border-left: 4px solid ${props => props.active ? '#5654a2' : 'transparent'};
  transition: all 0.2s;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    color: #5654a2;
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.isCollapsed ? '0' : '0.75rem'};
    
    @media (max-width: 768px) {
      margin-right: 0;
    }
  }
  
  span {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;
  }
`;

const UserSection = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.sidebarBorder};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.75rem;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #5654a2;
  margin-right: ${props => props.isCollapsed ? '0' : '0.75rem'};
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const UserInfo = styled.div`
  display: ${props => props.isCollapsed ? 'none' : 'block'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const UserRole = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const ThemeToggleWrapper = styled.div`
  padding: 0.75rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.sidebarBorder};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -10px;
  top: 60px;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Icons
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.9999 1L20.9999 5V11C20.9999 17.6274 15.6273 22 9 22C2.37263 22 1 17.6274 1 11V5L11.9999 1Z" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const NotificationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const DashboardSidebar = ({ onToggle }) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Notify parent component about the sidebar state change
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <SidebarContainer className="dashboard-sidebar" isCollapsed={isCollapsed}>
      <LogoContainer className="sidebar-logo" isCollapsed={isCollapsed}>
        <Logo href="/dashboard" aria-label="AI Builder Dashboard" isCollapsed={isCollapsed}>
          <CrownIcon aria-hidden="true" />
          <span>AI Builder</span>
        </Logo>
      </LogoContainer>
      
      <ToggleButton onClick={toggleSidebar} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </ToggleButton>
      
      <NavContainer className="sidebar-nav" role="navigation" aria-label="Dashboard Navigation">
        <NavItem 
          href="/dashboard" 
          active={window.location.pathname === '/dashboard'} 
          className="nav-item" 
          isCollapsed={isCollapsed}
        >
          <HomeIcon aria-hidden="true" />
          <span>Dashboard</span>
        </NavItem>
        <NavItem 
          href="/dashboard/projects" 
          className="nav-item" 
          isCollapsed={isCollapsed}
        >
          <ProjectsIcon aria-hidden="true" />
          <span>Projects</span>
        </NavItem>
        <NavItem 
          href="/notifications" 
          className="nav-item" 
          isCollapsed={isCollapsed}
        >
          <NotificationsIcon aria-hidden="true" />
          <span>Notifications</span>
        </NavItem>
        <NavItem 
          href="/settings" 
          className="nav-item" 
          isCollapsed={isCollapsed}
        >
          <SettingsIcon aria-hidden="true" />
          <span>Settings</span>
        </NavItem>
      </NavContainer>
      
      <ThemeToggleWrapper isCollapsed={isCollapsed}>
        <ThemeToggle showLabel={!isCollapsed && !isMobile} iconOnly={isCollapsed || isMobile} />
      </ThemeToggleWrapper>
      
      <UserSection className="user-section" isCollapsed={isCollapsed}>
        <Avatar className="user-avatar" isCollapsed={isCollapsed} />
        <UserInfo className="user-info" isCollapsed={isCollapsed}>
          <UserName>John Doe</UserName>
          <UserRole>Designer</UserRole>
        </UserInfo>
      </UserSection>
    </SidebarContainer>
  );
};

export default DashboardSidebar;