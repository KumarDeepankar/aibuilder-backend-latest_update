import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ApiService from '../services/ApiService';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
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
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : props.completed ? props.theme.colors.primary : props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active || props.completed ? 'white' : props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StepLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? '500' : '400'};
  text-align: center;
  max-width: 100px;
`;

const StepConnector = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: ${props => props.completed ? props.theme.colors.primary : props.theme.colors.border};
  margin: 0 0.5rem;
  position: relative;
  top: -18px;
  z-index: 0;
`;

const ContentCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px ${props => props.theme.colors.shadow};
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const MetadataSection = styled.div`
  margin-bottom: 2rem;
`;

const MetadataHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CompleteBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 1rem;
`;

const CompleteIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  
  svg {
    width: 10px;
    height: 10px;
    color: white;
  }
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetadataCard = styled.div`
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 8px;
  padding: 1rem;
`;

const MetadataLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const MetadataValue = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  word-break: break-all;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 8px;
  padding: 1rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  margin-right: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.inputBackground};
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }
`;

// Icon components
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AdobeFranklinProject = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Set the active step (1-based index)
  const activeStep = 1;
  
  // Project data
  const projectData = {
    name: 'AEM Sidekick Library',
    url: 'https://sidekick-library--aem-block-collection--adobe.aem.page/',
    brand: 'ABC',
    totalBlocks: 24,
    globalBlocks: 2,
    siteBuildingBlocks: 22,
    imageMetadata: {
      progress: '10/10 (100%)',
      pages: 10,
      links: 27,
      images: 20,
      blocks: 75,
      forms: 0,
      videos: 0
    }
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Steps in the process
  const steps = [
    { number: 1, label: 'Image Analysis', completed: true, active: true },
    { number: 2, label: 'UI Component Mapping', completed: false, active: false },
    { number: 3, label: 'Document Generation', completed: false, active: false },
    { number: 4, label: 'Preview Website', completed: false, active: false }
  ];
  
  // Handle run mapping action
  const handleRunMapping = () => {
    console.log('Running mapping...');
    // In a real implementation, this would start the mapping process
    // and then navigate to the next step
  };

  const handleMetaData = async () => {
    try {
      const createdMetaProject = await ApiService.getMetadata();
      console.log('Created Project:', createdMetaProject);
      // You can add navigation or state updates here if needed
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  // handleCreateProject();

  // const projectDatas = {
  //       project_name: formData.projectName,
  //       project_type: formData.projectTechnology,
  //       project_description: formData.projectBrief,
  //       title: formData.projectName,
  //       project_metadata: {
  //         jira_board_url: formData.projectJira,
  //         selected_template: formData.projectTemplate,
  //         status: formData.projectStatus
  //       },
  //       github_repo_url: formData.projectGit,
  //       is_active: true
  //     };
  //   console.log('Project Data:', projectDatas);
  handleMetaData();
  console.log('Project Data1:', handleMetaData.github_repo_url);
  
  return (
    <PageContainer>
      <DashboardSidebar onToggle={handleSidebarToggle} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Header>
          <PageTitle>Adobe Franklin</PageTitle>
        </Header>
        
        <StepperContainer>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <Step>
                <StepNumber active={step.active} completed={step.completed}>
                  {step.completed ? <CheckIcon /> : step.number}
                </StepNumber>
                <StepLabel active={step.active}>{step.label}</StepLabel>
              </Step>
              {index < steps.length - 1 && (
                <StepConnector completed={step.completed} />
              )}
            </React.Fragment>
          ))}
        </StepperContainer>
        
        <ContentCard>
          <CardTitle>{projectData.name}</CardTitle>
          
          <MetadataSection>
            <MetadataHeader>
              <SectionTitle>Template Metadata</SectionTitle>
              <CompleteBadge>
                <CompleteIcon>
                  <CheckIcon />
                </CompleteIcon>
                Complete
              </CompleteBadge>
            </MetadataHeader>
            
            <MetadataGrid>
              <MetadataCard>
                <MetadataLabel>Template</MetadataLabel>
                <MetadataValue>{handleMetaData.project_metadata}</MetadataValue>
              </MetadataCard>
              
              <MetadataCard>
                <MetadataLabel>Brand</MetadataLabel>
                <MetadataValue>{projectData.brand}</MetadataValue>
              </MetadataCard>
              
              <MetadataCard>
                <MetadataLabel>Total Blocks</MetadataLabel>
                <MetadataValue>{projectData.totalBlocks}</MetadataValue>
              </MetadataCard>
              
              <MetadataCard>
                <MetadataLabel>Global Blocks</MetadataLabel>
                <MetadataValue>{projectData.globalBlocks}</MetadataValue>
              </MetadataCard>
              
              <MetadataCard>
                <MetadataLabel>Site Building Blocks</MetadataLabel>
                <MetadataValue>{projectData.siteBuildingBlocks}</MetadataValue>
              </MetadataCard>
            </MetadataGrid>
          </MetadataSection>
          
          <MetadataSection>
            <MetadataHeader>
              <SectionTitle>Image Metadata</SectionTitle>
              <CompleteBadge>
                <CompleteIcon>
                  <CheckIcon />
                </CompleteIcon>
                Complete
              </CompleteBadge>
            </MetadataHeader>
            
            <div>{projectData.imageMetadata.progress}</div>
            
            <StatsGrid>
              <StatCard>
                <StatValue>{projectData.imageMetadata.pages}</StatValue>
                <StatLabel>pages</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{projectData.imageMetadata.links}</StatValue>
                <StatLabel>links</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{projectData.imageMetadata.images}</StatValue>
                <StatLabel>images</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{projectData.imageMetadata.blocks}</StatValue>
                <StatLabel>blocks</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{projectData.imageMetadata.forms}</StatValue>
                <StatLabel>forms</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{projectData.imageMetadata.videos}</StatValue>
                <StatLabel>videos</StatLabel>
              </StatCard>
            </StatsGrid>
          </MetadataSection>
          
          <ActionContainer>
            <CancelButton onClick={() => navigate('/dashboard')}>Cancel</CancelButton>
            <PrimaryButton onClick={handleRunMapping}>Run Mapping</PrimaryButton>
          </ActionContainer>
        </ContentCard>
      </MainContent>
    </PageContainer>
  );
};

export default AdobeFranklinProject;