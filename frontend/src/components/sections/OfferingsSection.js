import React from 'react';
import styled from 'styled-components';

const OfferingsWrapper = styled.div`
  background-color: #f5f7fa;
  width: 100%;
  padding: 5rem 2rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const OfferingsContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c303a;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e1e4e8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${props => props.backgroundColor || 'rgba(59, 130, 246, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.iconColor || '#3B82F6'};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c303a;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
  margin-bottom: 1.5rem;
`;

const LearnMoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #3B82F6;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.95rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

// Icons
const ImageToCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const DrupalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

const StackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.66663 4L12.6666 8L8.66663 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OfferingsSection = () => {
  return (
    <OfferingsWrapper id="what-we-offer">
      <OfferingsContainer>
        <SectionHeader>
          <SectionTitle>What We Offer</SectionTitle>
          <SectionSubtitle>
            Our AI-powered platform provides a suite of tools to streamline your development workflow and save valuable engineering hours.
          </SectionSubtitle>
        </SectionHeader>
        
        <CardsContainer>
          <FeatureCard>
            <IconContainer backgroundColor="rgba(59, 130, 246, 0.2)" iconColor="#3B82F6">
              <ImageToCodeIcon />
            </IconContainer>
            <CardTitle>Image to Code</CardTitle>
            <CardDescription>
              Upload screenshots or Figma designs and get clean, responsive code in seconds. Our AI understands layout, styles, and component structure.
            </CardDescription>
            <LearnMoreLink href="/image-to-code">
              Learn More <ArrowRightIcon />
            </LearnMoreLink>
          </FeatureCard>
          
          <FeatureCard>
            <IconContainer backgroundColor="rgba(139, 92, 246, 0.2)" iconColor="#8B5CF6">
              <DrupalIcon />
            </IconContainer>
            <CardTitle>Drupal Migration Made Easy</CardTitle>
            <CardDescription>
              Seamlessly migrate your Drupal sites to modern frameworks with our specialized tools. Preserve your content structure and relationships.
            </CardDescription>
            <LearnMoreLink href="/drupal-migration">
              Learn More <ArrowRightIcon />
            </LearnMoreLink>
          </FeatureCard>
          
          <FeatureCard>
            <IconContainer backgroundColor="rgba(236, 72, 153, 0.2)" iconColor="#EC4899">
              <StackIcon />
            </IconContainer>
            <CardTitle>Output in Your Favorite Stack</CardTitle>
            <CardDescription>
              Choose from React, Vue, Angular, or even traditional HTML/CSS. Our AI adapts to your preferred technology stack and coding style.
            </CardDescription>
            <LearnMoreLink href="/output-options">
              Learn More <ArrowRightIcon />
            </LearnMoreLink>
          </FeatureCard>
        </CardsContainer>
      </OfferingsContainer>
    </OfferingsWrapper>
  );
};

export default OfferingsSection;