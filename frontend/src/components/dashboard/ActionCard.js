import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.cardBorder};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  
  &:hover, &:focus {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: ${props => {
    switch(props.iconType) {
      case 'prompt':
        return '#4c6ef5';
      case 'image':
        return '#37b24d';
      case 'jira':
        return '#2684FF';
      case 'template':
        return '#f59f00';
      case 'component':
        return '#ae3ec9';
      case 'resume':
        return '#1098ad';
      default:
        return '#4c6ef5';
    }
  }};
  
  svg {
    width: 22px;
    height: 22px;
    color: white;
  }
`;

const CardTitle = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

const ActionCard = ({ icon, title, description, onClick }) => {
  const { theme } = useTheme();
  
  const getIconComponent = () => {
    switch (icon) {
      case 'prompt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15 9L22 9L17 14L19 21L12 17.5L5 21L7 14L2 9L9 9L12 2Z"></path>
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'jira':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.004 0c-6.623 0-12 5.377-12 12s5.377 12 12 12 12-5.377 12-12-5.377-12-12-12zm5.247 16.745c-.168.212-.432.323-.711.323-.185 0-.368-.055-.525-.16l-4.011-2.751-4.011 2.751c-.157.105-.34.16-.525.16-.279 0-.543-.111-.711-.323-.307-.386-.242-.945.144-1.252l4.591-3.152c.324-.223.756-.223 1.08 0l4.591 3.152c.387.307.451.866.144 1.252z" fill="currentColor"/>
          </svg>
        );
      case 'template':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        );
      case 'component':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
            <line x1="12" y1="22" x2="12" y2="15.5"></line>
            <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
          </svg>
        );
      case 'resume':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15 9L22 9L17 14L19 21L12 17.5L5 21L7 14L2 9L9 9L12 2Z"></path>
          </svg>
        );
    }
  };

  return (
    <Card onClick={onClick} theme={theme}>
      <IconContainer theme={theme} iconType={icon}>
        {getIconComponent()}
      </IconContainer>
      <CardTitle theme={theme}>{title}</CardTitle>
      {description && <CardDescription theme={theme}>{description}</CardDescription>}
    </Card>
  );
};

export default ActionCard;