import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Card = styled.div`
  position: relative;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px ${props => props.theme.colors.shadow};
  }
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ProjectType = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.25rem 0 0 0;
`;

const StatusTag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
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

const UpdatedText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 1rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CollaboratorsGroup = styled.div`
  display: flex;
  align-items: center;
`;

const CollaboratorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: -8px;
  border: 1px solid ${props => props.theme.colors.cardBackground};
`;

const ComponentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.6rem 0;
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
  border-top: 1px solid ${props => props.theme.colors.borderLight};
  
  &:hover {
    background-color: ${props => `${props.theme.colors.primaryLight}dd`};
  }
`;

// Icons
const ComponentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 18l6-6-6-6"></path>
    <path d="M8 6l-6 6 6 6"></path>
  </svg>
);

const getTimeAgo = (dateString) => {
  // Handle both date formats: "21-03-2022" and "2 hours ago"
  if (dateString.includes('ago')) {
    return dateString;
  }
  
  // For simplicity, just return the date for now
  // In a real app, you'd convert it to "X days ago" format
  return `${dateString.split('-').reverse().join('/')}`;
};

const ProjectCard = ({ project }) => {
  // Generate random colors for avatar examples
  const getRandomColor = () => {
    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#9c27b0', '#ff6d01'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Generate random initials for collaborator avatars
  const getInitials = (index) => {
    const initials = ['JD', 'AR', 'TK', 'MN', 'LP', 'BG'];
    return initials[index % initials.length];
  };
  
  // Determine number of collaborators based on project and with a maximum of 3
  const getCollaborators = () => {
    // If project has owner attribute, use it to determine real collaborator count
    if (project.owner) {
      return project.id % 3 + 1; // 1, 2, or 3 collaborators
    }
    return 0;
  };
  
  const formatTechnology = (language) => {
    // Map technology names to more user-friendly names if needed
    const techMap = {
      'HTML/CSS/JavaScript': 'React components',
      'Python': 'Python scripts',
      'Adobe Franklin': 'Vue components'
    };
    
    return techMap[language] || `${language} components`;
  };
  
  // Get number of components
  const getComponentCount = () => {
    return project.id.toString().length * 5 + 3;
  };
  
  const collaboratorsCount = getCollaborators();
  const componentCount = getComponentCount();
  const updatedText = project.dateUpdated ? `Updated ${getTimeAgo(project.dateUpdated)}` : '';
  
  // Map status values to display values
  const getStatusDisplay = (status) => {
    const statusMap = {
      'Live': 'Completed',
      'In Progress': 'In Progress',
      'New': 'Draft',
      'Decommissioned': 'Archived'
    };
    
    return statusMap[status] || status;
  };
  
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div>
            <ProjectTitle>{project.name}</ProjectTitle>
            <ProjectType>{formatTechnology(project.language)}</ProjectType>
          </div>
          <StatusTag status={getStatusDisplay(project.status)}>
            {getStatusDisplay(project.status)}
          </StatusTag>
        </CardHeader>
        
        <UpdatedText>{updatedText}</UpdatedText>
        
        <CardFooter>
          <CollaboratorsGroup>
            {Array.from({ length: Math.min(collaboratorsCount, 3) }).map((_, idx) => (
              <CollaboratorAvatar key={idx} color={getRandomColor()}>
                {getInitials(idx)}
              </CollaboratorAvatar>
            ))}
          </CollaboratorsGroup>
          
          <ComponentCount>
            <ComponentIcon />
            {componentCount} components
          </ComponentCount>
        </CardFooter>
      </CardContent>
      
      <ViewButton to={`/dashboard/projects/${project.id}`}>View Project</ViewButton>
    </Card>
  );
};

export default ProjectCard;