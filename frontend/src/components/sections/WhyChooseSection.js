import React from 'react';
import styled from 'styled-components';

const WhyChooseWrapper = styled.div`
  background-color: #f5f7fa;
  width: 100%;
  padding: 6rem 2rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const WhyChooseContainer = styled.section`
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

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: ${props => props.backgroundColor || 'rgba(59, 130, 246, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.iconColor || '#3B82F6'};
  }
`;

const BenefitTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2c303a;
`;

const BenefitDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #6c757d;
`;

// Icons
const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const AccuracyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CustomizableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IntegrationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const SecurityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const benefits = [
  {
    title: "Lightning Fast",
    description: "Generate code in seconds, not hours. Our AI processes your designs and outputs clean, optimized code instantly.",
    icon: LightningIcon,
    color: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.15)"
  },
  {
    title: "Pixel-Perfect Accuracy",
    description: "Our AI ensures that your code matches your design with precision, maintaining the exact spacing, colors, and proportions.",
    icon: AccuracyIcon,
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.15)"
  },
  {
    title: "Highly Customizable",
    description: "Tailor the output to your needs with customizable options for component structure, naming conventions, and code style.",
    icon: CustomizableIcon,
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.15)"
  },
  {
    title: "24/7 Support",
    description: "Our dedicated team is available around the clock to help you with any questions or issues you might encounter.",
    icon: SupportIcon,
    color: "#EC4899",
    bgColor: "rgba(236, 72, 153, 0.15)"
  },
  {
    title: "Seamless Integration",
    description: "Integrate with your existing tools and workflows via our API or use our platform directly in your favorite design tools.",
    icon: IntegrationIcon,
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.15)"
  },
  {
    title: "Enterprise-Grade Security",
    description: "Your designs and code are protected with industry-leading security practices and regular security audits.",
    icon: SecurityIcon,
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.15)"
  }
];

const WhyChooseSection = () => {
  return (
    <WhyChooseWrapper id="why-choose">
      <WhyChooseContainer>
        <SectionHeader>
          <SectionTitle>Why Choose Our AI Solution</SectionTitle>
          <SectionSubtitle>
            Our platform is designed to make your development process faster, more efficient, and more enjoyable with these powerful features.
          </SectionSubtitle>
        </SectionHeader>
        
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <IconContainer 
                backgroundColor={benefit.bgColor} 
                iconColor={benefit.color}
              >
                {React.createElement(benefit.icon)}
              </IconContainer>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitItem>
          ))}
        </BenefitsGrid>
      </WhyChooseContainer>
    </WhyChooseWrapper>
  );
};

export default WhyChooseSection;