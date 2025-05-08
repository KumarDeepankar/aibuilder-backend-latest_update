import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #161c2d;
  color: white;
  padding: 3rem 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div``;

const Logo = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  margin-bottom: 1rem;
  
  .highlight {
    color: #3B82F6;
  }
`;

const CompanyDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: #fff;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.75rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #3B82F6;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s ease;
    
    &:hover {
      color: #3B82F6;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

// Icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <FooterColumn>
            <Logo>
              Code<span className="highlight">AI</span>
            </Logo>
            <CompanyDescription>
              Transform your designs into code with artificial intelligence.
            </CompanyDescription>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <FooterLinks>
              <li><a href="/features">Features</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/documentation">Documentation</a></li>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Legal</ColumnTitle>
            <FooterLinks>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookie-policy">Cookie Policy</a></li>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Connect</ColumnTitle>
            <SocialLinks>
              <a href="https://twitter.com/codeai" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://github.com/codeai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a href="https://linkedin.com/company/codeai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            </SocialLinks>
          </FooterColumn>
        </FooterContent>
        
        <Copyright>
          © 2025 CodeAI. All rights reserved.
        </Copyright>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;