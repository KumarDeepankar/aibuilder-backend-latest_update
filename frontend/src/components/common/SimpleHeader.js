import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  color: #333;
  position: relative;
  z-index: 10;
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

const SimpleHeader = () => {
  return (
    <HeaderWrapper>
      <Logo>
        <Link to="/" aria-label="CodeAI Home">
          <LogoIcon>{'</>'}</LogoIcon>
          CodeAI
        </Link>
      </Logo>
    </HeaderWrapper>
  );
};

export default SimpleHeader;