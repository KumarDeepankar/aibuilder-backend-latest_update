import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// Import Dashboard sidebar components
import Sidebar from '../dashboard/DashboardSidebar';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  display: flex;
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

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  border-radius: 8px;
  font-size: 14px;
  margin-right: 16px;
  min-width: 220px;
  
  &::placeholder {
    color: ${props => props.theme.colors.inputPlaceholder};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryShadow};
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

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subheading = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  text-align: center;
`;

const InputBox = styled.div`
  width: 100%;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background-color: ${props => props.theme.colors.cardBackground};
  margin-bottom: 2rem;
`;

const TextAreaContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  font-size: 16px;
  resize: none;
  
  &::placeholder {
    color: ${props => props.theme.colors.inputPlaceholder};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryShadow};
  }
`;

const InputActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputActionButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    margin-right: 8px;
  }
`;

const PrototypeButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  svg {
    margin-left: 8px;
  }
`;

const FrameworksSection = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const FrameworksTitle = styled.p`
  font-size: 14px;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const FrameworksGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FrameworkCard = styled.div`
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 12px;
  background-color: ${props => props.selected ? props.theme.colors.primarySoft : props.theme.colors.cardBackground};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primarySoft};
  }
`;

const FrameworkIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const FrameworkName = styled.span`
  font-size: 12px;
  text-align: center;
`;

// Icons
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

const FigmaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path>
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path>
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path>
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path>
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>
  </svg>
);

const AttachmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SparkleIcon = () => (
  <span style={{ marginLeft: '8px', fontSize: '24px' }}>✨</span>
);

const PromptToPage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedFramework, setSelectedFramework] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  const frameworks = [
    { id: 'python', name: 'Python', icon: '/logos/python-logo.svg' },
    { id: 'drupal', name: 'Drupal', icon: '/logos/drupal-logo.svg' },
    { id: 'react', name: 'React', icon: '/logos/react-logo.svg' },
    { id: 'adobe', name: 'Adobe', icon: '/logos/adobe-logo.svg' },
    { id: 'vue', name: 'Vue', icon: '/logos/vue-logo.svg' },
  ];
  
  const handlePrototype = () => {
    console.log('Generating prototype with:', prompt);
    console.log('Selected framework:', selectedFramework);
    // Navigate to the code assistant page
    navigate('/dashboard/code-assistant');
  };
  
  return (
    <Container>
      <Sidebar onToggle={handleSidebarToggle} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <TopBar>
          <Title>AI Builder</Title>
          <SearchBar>
            <SearchInput 
              placeholder="Search..." 
              aria-label="Search projects"
            />
            <IconButton aria-label="Settings">
              <SettingsIcon />
            </IconButton>
            <IconButton aria-label="User account">
              <UserIcon />
            </IconButton>
          </SearchBar>
        </TopBar>
        
        <CenterContent>
          <Heading>Start building with AI <SparkleIcon /></Heading>
          <Subheading>Prompt, run, edit, and deploy full-stack web and mobile apps...</Subheading>
          
          <InputBox>
            <TextAreaContainer>
              <StyledTextArea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a description of what you want to build..."
                aria-label="Prompt input"
              />
            </TextAreaContainer>
            
            <InputActions>
              <div style={{ display: 'flex', gap: '10px' }}>
                <InputActionButton>
                  <AttachmentIcon />
                  Attach file
                </InputActionButton>
                <InputActionButton>
                  <FigmaIcon />
                  Figma Import
                </InputActionButton>
              </div>
              <PrototypeButton onClick={handlePrototype}>
                Prototype with AI
                <ArrowRightIcon />
              </PrototypeButton>
            </InputActions>
          </InputBox>
          
          <FrameworksSection>
            <FrameworksTitle>Select coding Languages/framework...</FrameworksTitle>
            <FrameworksGrid>
              {frameworks.map((framework) => (
                <FrameworkCard 
                  key={framework.id}
                  selected={selectedFramework === framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                >
                  <FrameworkIcon>
                    <img 
                      src={framework.icon} 
                      alt={`${framework.name} logo`} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/32?text=' + framework.name[0];
                      }}
                    />
                  </FrameworkIcon>
                  <FrameworkName>{framework.name}</FrameworkName>
                </FrameworkCard>
              ))}
            </FrameworksGrid>
          </FrameworksSection>
        </CenterContent>
      </MainContent>
    </Container>
  );
};

export default PromptToPage;