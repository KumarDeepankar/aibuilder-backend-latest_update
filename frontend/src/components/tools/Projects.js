import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import ProjectCard from '../dashboard/ProjectCard';

// Import Dashboard sidebar component
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

const ProjectsContainer = styled.div`
  padding: 1.5rem;
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProjectsTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ProjectsSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.25rem 0 0 0;
`;

const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NewProjectButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.inputBackground};
  border-radius: 4px;
  padding: 2px;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primaryLight : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  }
`;

// List view styled components
const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }
`;

const ProjectInfo = styled.div`
  flex-grow: 1;
`;

const ProjectName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProjectStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  background-color: ${props => {
    switch (props.status) {
      case 'Completed': return props.theme.colors.successLight;
      case 'In Progress': return props.theme.colors.infoLight;
      case 'Draft': return props.theme.colors.warningLight;
      default: return props.theme.colors.borderLight;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed': return props.theme.colors.success;
      case 'In Progress': return props.theme.colors.info;
      case 'Draft': return props.theme.colors.warning;
      default: return props.theme.colors.textSecondary;
    }
  }};
`;

const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

// Grid view styled components
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

// Icons
const ListViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add missing icons
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Projects = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [expandedProject, setExpandedProject] = useState('powerplatform');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Mock project data
  const projects = [
    {
      id: 'project1',
      name: 'Project 1',
      dateCreated: '21-03-2022',
      dateUpdated: '23-03-2022',
      projectId: '1586',
      status: 'In Progress',
      language: 'HTML/CSS/JavaScript',
      owner: 'Nikunj Patel'
    },
    {
      id: 'project2',
      name: 'Project 2',
      dateCreated: '21-03-2022',
      dateUpdated: '22-03-2022',
      projectId: '1585',
      status: 'Live',
      language: 'Adobe Franklin',
      owner: 'Saurabh Chugh'
    },
    {
      id: 'powerplatform',
      name: 'Powerplatform',
      dateCreated: '21-03-2022',
      dateUpdated: '22-03-2022',
      projectId: '1584',
      status: 'Decommissioned',
      language: 'Python',
      owner: 'Jay Visaria'
    },
    {
      id: 'project3',
      name: 'Project 3',
      dateCreated: '08-03-2022',
      dateUpdated: '09-03-2022',
      projectId: '1583',
      status: 'New',
      language: 'Hugo',
      owner: 'Nikunj Patel'
    },
    {
      id: 'project4',
      name: 'Project 4',
      dateCreated: '08-03-2022',
      dateUpdated: '10-03-2022',
      projectId: '1582',
      status: 'In Progress',
      language: 'Adobe Franklin',
      owner: 'Jay Visaria'
    }
  ];

  // Mock data for expanded project
  const expandedProjectMetrics = {
    performance: 75,
    accessibility: 84,
    bestPractice: 90,
    seo: 95
  };

  const expandedProjectDetails = [
    {
      id: '1',
      updatedBy: 'Nikunj Patel',
      updatedDate: '12/12/2024'
    },
    {
      id: '2',
      updatedBy: 'Saurabh Chugh',
      updatedDate: '15/01/2025'
    }
  ];

  const toggleExpandProject = (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  // Filter projects based on active tab and search query
  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'completed' && project.status === 'Completed') ||
                       (activeTab === 'in-progress' && project.status === 'In Progress') ||
                       (activeTab === 'drafts' && project.status === 'Draft');
                       
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
                         
    return matchesTab && matchesSearch;
  });

  return (
    <Container>
      <Sidebar onToggle={handleSidebarToggle} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <TopBar>
          <Title>Projects</Title>
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

        <ProjectsContainer>
          <ProjectsHeader>
            <div>
              <ProjectsTitle>Projects</ProjectsTitle>
              <ProjectsSubtitle>Manage and organize your code generation projects</ProjectsSubtitle>
            </div>
            <FilterActions>
              <SearchInput 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ViewToggle>
                <ToggleButton 
                  active={viewMode === 'list'} 
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <ListViewIcon />
                </ToggleButton>
                <ToggleButton 
                  active={viewMode === 'card'} 
                  onClick={() => setViewMode('card')}
                  title="Card view"
                >
                  <CardViewIcon />
                </ToggleButton>
              </ViewToggle>
              <NewProjectButton to="/dashboard/new-project">New Project</NewProjectButton>
            </FilterActions>
          </ProjectsHeader>
          
          <TabContainer>
            <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
              All Projects
            </Tab>
            <Tab active={activeTab === 'in-progress'} onClick={() => setActiveTab('in-progress')}>
              In Progress
            </Tab>
            <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
              Completed
            </Tab>
            <Tab active={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')}>
              Drafts
            </Tab>
          </TabContainer>

          {viewMode === 'list' ? (
            <ProjectsList>
              {filteredProjects.map(project => (
                <ProjectRow key={project.id}>
                  <ProjectInfo>
                    <ProjectName>{project.name}</ProjectName>
                    <ProjectMeta>
                      <span>Language: {project.language}</span>
                      <span>Updated: {project.created}</span>
                    </ProjectMeta>
                  </ProjectInfo>
                  <ProjectStatus status={project.status}>{project.status}</ProjectStatus>
                  <ProjectActions>
                    <ActionButton title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </ActionButton>
                    <ActionButton title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </ActionButton>
                    <ActionButton title="More">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </ActionButton>
                  </ProjectActions>
                </ProjectRow>
              ))}
            </ProjectsList>
          ) : (
            <ProjectGrid>
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                />
              ))}
            </ProjectGrid>
          )}
        </ProjectsContainer>
      </MainContent>
    </Container>
  );
};

export default Projects;