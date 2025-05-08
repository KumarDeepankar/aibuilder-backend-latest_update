import React from 'react';
import styled from 'styled-components';

const HeroWrapper = styled.div`
  background-color: #121212;
  background-image: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1), transparent 40%), 
                    radial-gradient(circle at 90% 80%, rgba(100, 60, 240, 0.08), transparent 40%);
  width: 100%;
`;

const HeroContainer = styled.section`
  color: white;
  padding: 5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 600px;
  
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 4rem 1.5rem;
    min-height: unset;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  padding-right: 2rem;
  max-width: 600px;
  
  @media (max-width: 992px) {
    padding-right: 0;
    margin-bottom: 3rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white;
  
  @media (max-width: 992px) {
    font-size: 2.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.25rem;
  }
  
  .highlight {
    background: linear-gradient(90deg, #3B82F6, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    position: relative;
    display: inline-block;
    font-size: inherit;
    padding: 0 0.1em;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  max-width: 90%;
  
  @media (max-width: 992px) {
    max-width: 100%;
    padding: 0 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Button = styled.button`
  padding: 0.85rem 1.75rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background-color: #3B82F6;
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  
  &:hover {
    background-color: #2563EB;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .device-mockup {
    width: 100%;
    max-width: 580px;
    height: auto;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
    position: relative;
    z-index: 1;
  }
  
  .code-display {
    position: absolute;
    width: 90%;
    height: 80%;
    top: 10%;
    left: 5%;
    background-color: #0F111A;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .code-header {
    height: 30px;
    background-color: #1A1C25;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }
  
  .code-dots {
    display: flex;
    gap: 6px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  
  .red { background-color: #FF5F56; }
  .yellow { background-color: #FFBD2E; }
  .green { background-color: #27C93F; }
  
  .code-content {
    flex: 1;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #CBD5E0;
    line-height: 1.5;
    overflow: hidden;
  }
  
  .comment { color: #676E95; }
  .keyword { color: #C678DD; }
  .string { color: #98C379; }
  .property { color: #E06C75; }
  .function { color: #61AFEF; }
  .number { color: #D19A66; }
  .tag { color: #E06C75; }
  .attribute { color: #D19A66; }
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 500px;
  }
`;

const CodeLine = styled.div`
  display: flex;
  margin-bottom: 6px;
`;

const LineNumber = styled.span`
  color: #3D4559;
  margin-right: 16px;
  user-select: none;
`;

// Placeholder mockup image paths - these should be stored in your assets folder
const deviceMockupUrl = '/images/device-mockup.png';

// Code snippet to display in the mockup
const codeSnippet = [
  { number: 1, content: '<span class="keyword">import</span> React <span class="keyword">from</span> <span class="string">\'react\'</span>;' },
  { number: 2, content: '' },
  { number: 3, content: '<span class="comment">// Component for a responsive button</span>' },
  { number: 4, content: '<span class="keyword">const</span> <span class="function">Button</span> <span class="keyword">=</span> ({ label, onClick, primary }) <span class="keyword">=></span> {' },
  { number: 5, content: '  <span class="keyword">return</span> (' },
  { number: 6, content: '    <span class="tag"><</span><span class="tag">button</span>' },
  { number: 7, content: '      <span class="attribute">className</span>=<span class="string">`btn ${primary ? \'btn-primary\' : \'btn-secondary\'}`</span>' },
  { number: 8, content: '      <span class="attribute">onClick</span>={onClick}' },
  { number: 9, content: '    <span class="tag">></span>' },
  { number: 10, content: '      {label}' },
  { number: 11, content: '    <span class="tag"><</span>/<span class="tag">button</span><span class="tag">></span>' },
  { number: 12, content: '  );' },
  { number: 13, content: '};' },
  { number: 14, content: '' },
  { number: 15, content: '<span class="keyword">export</span> <span class="keyword">default</span> Button;' },
];

const HeroSection = () => {
  return (
    <HeroWrapper className="hero-section-wrapper">
      <HeroContainer className="hero-section-container" role="region" aria-labelledby="hero-title">
        <HeroContent className="hero-content">
          <HeroTitle className="hero-title" id="hero-title">
            Transform Your <span className="highlight">Designs</span> Into Production-Ready <span className="highlight">Code</span>
          </HeroTitle>
          <HeroDescription className="hero-description">
            Turn your Figma designs into clean, responsive code with our AI-powered platform. Generate production-ready code in React, Vue, or your technology stack of choice in seconds, not hours.
          </HeroDescription>
          <ButtonGroup className="hero-button-group">
            <PrimaryButton className="hero-primary-button" aria-label="Start your free trial">Start Free Trial</PrimaryButton>
            <SecondaryButton className="hero-secondary-button" aria-label="Request a product demonstration">Request a Demo</SecondaryButton>
          </ButtonGroup>
        </HeroContent>
        <HeroImage className="hero-image">
          <div className="code-display">
            <div className="code-header">
              <div className="code-dots">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
            </div>
            <div className="code-content">
              {codeSnippet.map((line) => (
                <CodeLine key={line.number}>
                  <LineNumber>{line.number}</LineNumber>
                  <div dangerouslySetInnerHTML={{ __html: line.content }}></div>
                </CodeLine>
              ))}
            </div>
          </div>
          <img 
            src={deviceMockupUrl} 
            alt="Device displaying generated code" 
            className="device-mockup" 
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </HeroImage>
      </HeroContainer>
    </HeroWrapper>
  );
};

export default HeroSection;