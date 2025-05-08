import React from 'react';
import styled from 'styled-components';

const StatisticsWrapper = styled.div`
  background: linear-gradient(to right, #a20025, #6a0dad);
  padding: 5rem 2rem;
  width: 100%;
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const StatisticsContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconContainer = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: ${props => props.color || 'white'};
  }
`;

const StatNumber = styled.h3`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

const Underline = styled.div`
  width: 60px;
  height: 3px;
  background-color: ${props => props.color || 'white'};
  margin-top: 1rem;
`;

// Icons
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="#FFB8E6" />
    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="#FFB8E6" />
  </svg>
);

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 18L9 13.5M21 7L15 13M13.5 6.5L17.5 10.5" stroke="#A7C5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 10.5C18 10.5 14.5 15 12 15C9.5 15 7.5 13 7.5 13L11 9.5C11 9.5 12 7 15 3.5C18 0 21 1 21 1C22.5 2.5 21.5 6.5 18 10.5Z" fill="#A7C5FF" />
    <path d="M4.5 19.5L4 15.5C4 15.5 5 15 7.5 13L11 16.5C9.5 18 7.5 18.5 7.5 18.5L4.5 19.5Z" fill="#A7C5FF" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#BBA7FF" />
    <path d="M12 7V12L15 15" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#FF8FAC" stroke="#FF8FAC" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StatisticsSection = () => {
  return (
    <StatisticsWrapper>
      <StatisticsContainer>
        <SectionTitle>Our Impact In Numbers</SectionTitle>
        <SectionSubtitle>
          See how AI Code is transforming the web development industry
        </SectionSubtitle>
        
        <StatsGrid>
          <StatItem>
            <IconContainer color="#FFB8E6">
              <UsersIcon />
            </IconContainer>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Active Users</StatLabel>
            <Underline color="rgba(255, 184, 230, 0.7)" />
          </StatItem>
          
          <StatItem>
            <IconContainer color="#A7C5FF">
              <RocketIcon />
            </IconContainer>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Projects Generated</StatLabel>
            <Underline color="#A7C5FF" />
          </StatItem>
          
          <StatItem>
            <IconContainer color="#BBA7FF">
              <ClockIcon />
            </IconContainer>
            <StatNumber>1.1M</StatNumber>
            <StatLabel>Hours Saved</StatLabel>
            <Underline color="#BBA7FF" />
          </StatItem>
          
          <StatItem>
            <IconContainer color="#FF8FAC">
              <HeartIcon />
            </IconContainer>
            <StatNumber>60%</StatNumber>
            <StatLabel>Satisfaction Rate</StatLabel>
            <Underline color="#FF8FAC" />
          </StatItem>
        </StatsGrid>
      </StatisticsContainer>
    </StatisticsWrapper>
  );
};

export default StatisticsSection;