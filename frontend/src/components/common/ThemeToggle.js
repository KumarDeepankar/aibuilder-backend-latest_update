import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  margin-right: 10px;
  color: ${props => props.theme.colors.text};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: ${props => props.iconOnly ? 'none' : 'inline-block'};
  width: 52px;
  height: 26px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:focus + span {
    box-shadow: 0 0 1px ${props => props.theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.name === 'dark' ? '#4285f4' : '#ccc'};
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ThemeIcon = styled.button`
  margin-left: ${props => props.iconOnly ? '0' : '8px'};
  font-size: ${props => props.iconOnly ? '18px' : '16px'};
  cursor: pointer;
  padding: ${props => props.iconOnly ? '8px' : '0'};
  border-radius: ${props => props.iconOnly ? '50%' : '0'};
  background-color: ${props => props.iconOnly ? props.theme.colors.surfaceHover : 'transparent'};
  transition: background-color 0.2s, transform 0.2s;
  border: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.iconOnly ? '36px' : 'auto'};
  height: ${props => props.iconOnly ? '36px' : 'auto'};
  
  &:hover {
    background-color: ${props => props.iconOnly ? props.theme.colors.inputHoverBackground : 'transparent'};
    transform: ${props => props.iconOnly ? 'scale(1.05)' : 'none'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryShadow};
  }
`;

const ThemeToggle = ({ showLabel = true, iconOnly = false }) => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  return (
    <ToggleContainer>
      {showLabel && <ToggleLabel>Dark Mode</ToggleLabel>}
      <ToggleSwitch iconOnly={iconOnly}>
        <ToggleInput 
          type="checkbox" 
          checked={isDarkMode}
          onChange={toggleTheme}
          aria-label="Toggle theme"
        />
        <ToggleSlider />
      </ToggleSwitch>
      <ThemeIcon 
        iconOnly={iconOnly} 
        onClick={toggleTheme}
        role="button"
        aria-label="Toggle theme"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </ThemeIcon>
    </ToggleContainer>
  );
};

export default ThemeToggle;