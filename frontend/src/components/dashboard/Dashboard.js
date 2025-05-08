import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ActionCard from './ActionCard';
import ProjectCard from './ProjectCard';
import ThemeToggle from '../common/ThemeToggle';
import DashboardSidebar from './DashboardSidebar';

// Add a screen reader only class
const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

// New styled component for empty state
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  margin-top: 1.5rem;
  border: 1px dashed ${props => props.theme.colors.border};
  
  p {
    margin: 1.5rem 0;
    font-size: 15px;
    max-width: 400px;
    line-height: 1.5;
  }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Sidebar = styled.div`
  width: 70px;
  background-color: ${props => props.theme.colors.sidebarBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0 5px ${props => props.theme.colors.shadow};
`;

const SidebarLogo = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  cursor: pointer;
  color: white;
`;

const SidebarIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 12px;
  color: ${props => props.active 
    ? props.theme.colors.primary 
    : props.theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)' 
      : props.theme.colors.textSecondary
  };
  background-color: ${props => props.active 
    ? props.theme.name === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : props.theme.colors.primarySoft
    : 'transparent'
  };
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background-color: ${props => props.theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : props.theme.colors.primarySoft
    };
    color: ${props => props.theme.colors.primary};
  }
`;

const ProfileButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4285f4;
  margin-top: auto;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-left: ${props => props.sidebarCollapsed ? '70px' : '240px'};
  width: calc(100% - ${props => props.sidebarCollapsed ? '70px' : '240px'});
  transition: margin-left 0.3s ease, width 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  border-radius: 8px;
  font-size: 14px;
  margin-right: 16px;
  min-width: 260px;
  flex: 1;
  
  &::placeholder {
    color: ${props => props.theme.colors.inputPlaceholder};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryShadow};
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    margin-right: 10px;
  }
`;

const IconButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.inputBackground};
  border: 1px solid ${props => props.theme.colors.inputBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.iconColor};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.inputHoverBackground};
    color: ${props => props.theme.colors.primary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryShadow};
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 2rem 0 1.5rem;
  padding-bottom: 0.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }
`;

const ActionCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin: 2.5rem 0 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 5px;
    margin: 2rem 0 1.5rem;
  }
`;

const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Tab = styled.button`
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 1.5rem;
  font-size: 15px;
  
  &:hover {
    color: ${props => props.theme.colors.text};
    border-bottom-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    margin-right: 1rem;
    font-size: 14px;
  }
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const ProjectCount = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px 12px;
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 30px;
`;

const ViewOptions = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 8px;
  padding: 4px;
`;

const ViewButton = styled(IconButton)`
  margin: 0 2px;
  background-color: ${props => props.active ? props.theme.colors.inputHoverBackground : 'transparent'};
  border: ${props => props.active ? `1px solid ${props.theme.colors.inputHoverBackground}` : 'none'};
  box-shadow: ${props => props.active ? `0 2px 4px ${props.theme.colors.shadow}` : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.inputHoverBackground : props.theme.colors.inputBackground};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
`;

const CreateNewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  
  svg {
    margin-right: 8px;
  }
`;

// Icons
const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Added missing icon for prompt action card
const PromptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <line x1="9" y1="10" x2="15" y2="10"></line>
  </svg>
);

// Added missing icon for image action card
const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const JiraIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.75 2.589c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zM16.205 16.455l-4.455-4.454V6.631l4.455 4.455v5.369z" fill="#2684FF"/>
    <path d="M11.75 11.086L7.295 6.631v5.369L11.75 16.455v-5.369z" fill="#2684FF"/>
  </svg>
);

const TemplateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="9"></line>
    <line x1="9" y1="13" x2="15" y2="13"></line>
    <line x1="9" y1="17" x2="15" y2="17"></line>
  </svg>
);

const ComponentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
    <line x1="12" y1="22" x2="12" y2="15.5"></line>
    <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ListViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const GridViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const EmptyStateIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="2" fill="#4285f4" />
    <path d="M12 8V16M8 12H16" stroke="#4285f4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const FlyoutMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  padding: 1rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 110;
  min-width: 220px;
`;

const FlyoutMenuItem = styled.div`
  padding: 0.75rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MenuLabel = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProjectsListContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

const ProjectsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  position: relative;
  
  &:after {
    content: ${props => props.sortable ? "''" : "none"};
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: ${props => props.sortable ? "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')" : "none"};
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.5;
    vertical-align: middle;
    margin-left: 4px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
`;

const ProjectIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.primarySoft};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
`;

const ProjectsList = ({ projects, onProjectClick }) => {
  return (
    <ProjectsListContainer>
      <ProjectsTable>
        <thead>
          <tr>
            <TableHeader>Project Name</TableHeader>
            <TableHeader sortable>Last Edited</TableHeader>
            <TableHeader>Shared With</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <TableRow key={project.id} onClick={() => onProjectClick(project.id)}>
              <TableCell>
                <ProjectName>
                  <ProjectIcon>
                    <FileIcon />
                  </ProjectIcon>
                  {project.title}
                </ProjectName>
              </TableCell>
              <TableCell>{project.lastEdited}</TableCell>
              <TableCell>{project.sharedWith || "Private"}</TableCell>
              <TableCell>
                <ActionButton title="Edit">
                  <EditIcon />
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </ProjectsTable>
    </ProjectsListContainer>
  );
};

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.inputBackground};
  border: 1px solid ${props => props.theme.colors.inputBorder};
  border-radius: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;
  color: ${props => props.theme.colors.iconColor};
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
`;

// Add new styled components for the updated dashboard design
const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ActionCardsSection = styled.div`
  margin-bottom: 2.5rem;
`;

const ActionCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionLabel = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatsCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  margin-bottom: 0.75rem;
`;

const StatValue = styled.div`
  font-size: ${props => props.large ? '1.5rem' : '1.125rem'};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 4px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: ${props => props.value || 0}%;
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

// Rename these components to avoid duplicates
const RecentProjectsContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

const RecentProjectsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const RecentTableHead = styled.thead`
  background-color: ${props => props.theme.colors.inputBackground};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const RecentTableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const RecentTableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  &:hover {
    background-color: ${props => props.theme.colors.inputBackground};
  }
`;

const RecentTableCell = styled.td`
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text};
`;

const RecentProjectName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

// Add the missing StatusBadge component
const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.status) {
      case 'Completed':
        return props.theme.name === 'dark' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)';
      case 'In Progress':
        return props.theme.name === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.1)';
      case 'Pending':
        return props.theme.name === 'dark' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(241, 196, 15, 0.1)';
      default:
        return props.theme.name === 'dark' ? 'rgba(189, 195, 199, 0.2)' : 'rgba(189, 195, 199, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed':
        return '#2ecc71';
      case 'In Progress':
        return '#3498db';
      case 'Pending':
        return '#f1c40f';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

// Icons
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeProjectTab, setActiveProjectTab] = useState('recent');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card' view mode
  const settingsMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Toggle settings menu
  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(!settingsMenuOpen);
  };
  
  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setSettingsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Example action cards data
  const actionCards = [
    {
      id: 'create-new-project',
      title: 'Create New Project',
      description: 'Onboard a project and start development.',
      icon: 'prompt'
    },
    {
      id: 'start-with-prompt',
      title: 'Start with a Prompt',
      description: 'Describe what you want to create and let AI generate the code',
      icon: 'prompt'
    },
    {
      id: 'import-design',
      title: 'Import Design',
      description: 'Upload an image or import from Figma',
      icon: 'image'
    },
    {
      id: 'create-from-jira',
      title: 'Create from Jira',
      description: 'Convert Jira stories into code automatically',
      icon: 'jira'
    },
    {
      id: 'use-template',
      title: 'Use Template',
      description: 'Start from our pre-built templates',
      icon: 'template'
    },
    {
      id: 'resume-project',
      title: 'Resume Project',
      description: 'Continue working on your recent projects',
      icon: 'resume'
    }
  ];

  // Example code generation stats
  const codeStats = [
    { label: 'React Components', value: 24 },
    { label: 'Python Scripts', value: 12 },
    { label: 'Vue Components', value: 8 },
    { label: 'Total Code Generated', value: 59 }
  ];

  // Example AI usage stats
  const aiStats = {
    credits: { used: 750, total: 1000 },
    successRate: 98,
    responseTime: 1.2
  };
  
  // Example recent projects
  const recentProjects = [
    {
      id: 1,
      name: 'Landing Page',
      language: 'React',
      created: '2 hours ago',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'API Integration',
      language: 'Python',
      created: 'Yesterday',
      status: 'In Progress'
    }
  ];
  
  // Example shared projects
  const sharedProjects = [
    {
      id: 3,
      name: 'Team Dashboard',
      language: 'React',
      created: '3 days ago',
      status: 'In Progress',
      sharedBy: 'Alice'
    },
    {
      id: 4,
      name: 'Authentication Service',
      language: 'Node.js',
      created: '1 week ago',
      status: 'Completed',
      sharedBy: 'Bob'
    }
  ];
  
  // Example pinned projects
  const pinnedProjects = [
    {
      id: 5,
      name: 'E-commerce App',
      language: 'Vue',
      created: '2 weeks ago',
      status: 'In Progress'
    },
    {
      id: 6,
      name: 'Data Analytics Dashboard',
      language: 'Python',
      created: '1 month ago',
      status: 'Completed'
    }
  ];
  
  // Get current projects based on active tab
  const getCurrentProjects = () => {
    switch (activeProjectTab) {
      case 'shared':
        return sharedProjects;
      case 'pinned':
        return pinnedProjects;
      case 'recent':
      default:
        return recentProjects;
    }
  };
  
  // Helper function to get the correct icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'prompt':
        return <PromptIcon />;
      case 'image':
        return <ImageIcon />;
      case 'jira':
        return <JiraIcon />;
      case 'template':
        return <TemplateIcon />;
      case 'component':
        return <ComponentIcon />;
      case 'resume':
        return <FolderIcon />;
      default:
        return <CodeIcon />;
    }
  };
  
  // Handle action card clicks, including create new project
  const handleActionCardClick = (cardId) => {
    console.log(`Action card clicked: ${cardId}`);
    // Navigate to the appropriate tool based on the card ID
    switch (cardId) {
      case 'create-new-project':
        navigate('/dashboard/create-new-project');
        break;
      case 'start-with-prompt':
        navigate('/dashboard/prompt-to-page');
        break;
      case 'import-design':
        navigate('/dashboard/code-assistant');
        break;
      case 'use-template':
        navigate('/dashboard/templates');
        break;
      case 'create-component':
        navigate('/dashboard/component-builder');
        break;
      case 'create-from-jira':
        navigate('/dashboard/jira-integration');
        break;
      case 'resume-project':
        navigate('/dashboard/projects');
        break;
      default:
        break;
    }
  };

  const handleProjectClick = (projectId) => {
    console.log(`Project clicked: ${projectId}`);
    navigate(`/dashboard/project/${projectId}`);
  };

  return (
    <DashboardContainer role="main" aria-label="Dashboard">
      <DashboardSidebar onToggle={handleSidebarToggle} />
      
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Header>
          <Title>CodeAI</Title>
          <SearchBar>
            <SearchInput 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
            <div style={{ position: 'relative' }}>
              <IconButton 
                aria-label="Settings" 
                onClick={toggleSettingsMenu}
                aria-haspopup="true"
                aria-expanded={settingsMenuOpen}
              >
                <SettingsIcon />
              </IconButton>
              <FlyoutMenu 
                isOpen={settingsMenuOpen}
                ref={settingsMenuRef}
                role="menu"
                aria-label="Settings Menu"
              >
                <FlyoutMenuItem>
                  <MenuLabel>Theme</MenuLabel>
                  <ThemeToggle showLabel={false} />
                </FlyoutMenuItem>
              </FlyoutMenu>
            </div>
            <IconButton aria-label="User account">
              <UserIcon />
            </IconButton>
          </SearchBar>
        </Header>

        {/* New Dashboard Content */}
        <WelcomeSection>
          <WelcomeTitle>Welcome back, John!</WelcomeTitle>
          <WelcomeSubtitle>Start creating code from various sources</WelcomeSubtitle>
        </WelcomeSection>

        <ActionCardsSection>
          <SectionLabel>What would you like to do today?</SectionLabel>
          <ActionCardsGrid>
            {actionCards.map(card => (
              <ActionCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={getIconComponent(card.icon)}
                onClick={() => handleActionCardClick(card.id)}
              />
            ))}
          </ActionCardsGrid>
        </ActionCardsSection>

        <StatsContainer>
          <StatsCard>
            <StatsCardTitle>Code Generation Stats</StatsCardTitle>
            <StatsGrid>
              {codeStats.map((stat, index) => (
                <StatItem key={index}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsGrid>
          </StatsCard>

          <StatsCard>
            <StatsCardTitle>AI Usage</StatsCardTitle>
            <StatItem>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <StatLabel>Monthly Credits</StatLabel>
                <StatValue style={{ fontSize: '0.875rem' }}>{aiStats.credits.used}/{aiStats.credits.total}</StatValue>
              </div>
              <ProgressBarContainer>
                <ProgressBar value={(aiStats.credits.used / aiStats.credits.total) * 100} />
              </ProgressBarContainer>
            </StatItem>
            <StatsGrid>
              <StatItem>
                <StatValue>{aiStats.successRate}%</StatValue>
                <StatLabel>Successful Generations</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{aiStats.responseTime}s</StatValue>
                <StatLabel>Average Response Time</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsCard>
        </StatsContainer>

        <section>
          <SectionLabel>Projects</SectionLabel>
          
          <TabsContainer>
            <TabsList>
              <Tab 
                active={activeProjectTab === 'recent'} 
                onClick={() => setActiveProjectTab('recent')}
              >
                Recent ({recentProjects.length})
              </Tab>
              <Tab 
                active={activeProjectTab === 'shared'} 
                onClick={() => setActiveProjectTab('shared')}
              >
                Shared ({sharedProjects.length})
              </Tab>
              <Tab 
                active={activeProjectTab === 'pinned'} 
                onClick={() => setActiveProjectTab('pinned')}
              >
                Pinned ({pinnedProjects.length})
              </Tab>
            </TabsList>
            <ViewOptions>
              <ViewButton 
                active={viewMode === 'list'} 
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListViewIcon />
              </ViewButton>
              <ViewButton 
                active={viewMode === 'card'} 
                onClick={() => setViewMode('card')}
                aria-label="Card view"
              >
                <GridViewIcon />
              </ViewButton>
            </ViewOptions>
          </TabsContainer>
          
          {viewMode === 'list' ? (
            <RecentProjectsContainer>
              <RecentProjectsTable>
                <RecentTableHead>
                  <tr>
                    <RecentTableHeader>Project Name</RecentTableHeader>
                    <RecentTableHeader>Language</RecentTableHeader>
                    <RecentTableHeader>Created</RecentTableHeader>
                    <RecentTableHeader>Status</RecentTableHeader>
                    {activeProjectTab === 'shared' && <RecentTableHeader>Shared By</RecentTableHeader>}
                  </tr>
                </RecentTableHead>
                <tbody>
                  {getCurrentProjects().map(project => (
                    <RecentTableRow key={project.id} onClick={() => handleProjectClick(project.id)}>
                      <RecentTableCell>
                        <RecentProjectName>{project.name}</RecentProjectName>
                      </RecentTableCell>
                      <RecentTableCell>{project.language}</RecentTableCell>
                      <RecentTableCell>{project.created}</RecentTableCell>
                      <RecentTableCell>
                        <StatusBadge status={project.status}>{project.status}</StatusBadge>
                      </RecentTableCell>
                      {activeProjectTab === 'shared' && <RecentTableCell>{project.sharedBy}</RecentTableCell>}
                    </RecentTableRow>
                  ))}
                </tbody>
              </RecentProjectsTable>
            </RecentProjectsContainer>
          ) : (
            <ProjectsGrid>
              {getCurrentProjects().map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </ProjectsGrid>
          )}
          
          {getCurrentProjects().length === 0 && (
            <EmptyState>
              <EmptyStateIcon />
              <p>No {activeProjectTab} projects found.</p>
              <CreateNewButton onClick={() => navigate('/dashboard/create-new-project')}>
                <PlusIcon /> Create New Project
              </CreateNewButton>
            </EmptyState>
          )}
        </section>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;