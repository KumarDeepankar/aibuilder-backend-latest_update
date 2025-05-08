import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ApiService from '../services/ApiService';
import config from '../config/config';

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

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
  }
`;

const FormContainer = styled.form`
  max-width: 800px;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 6px ${props => props.theme.colors.shadow};
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme.colors.text};
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryShadow};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.inputPlaceholder};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  appearance: auto;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryShadow};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${props => props.theme.colors.inputBorder};
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.inputText};
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryShadow};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.inputPlaceholder};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const TemplateOption = styled.div`
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  background-color: ${props => props.selected ? props.theme.colors.primaryLight : props.theme.colors.inputBackground};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const TemplateName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const TemplateDescription = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
`;

const TechCard = styled.div`
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 12px;
  background-color: ${props => props.selected ? props.theme.colors.primaryLight : props.theme.colors.cardBackground};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.shadow};
  }
`;

const TechIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const TechName = styled.span`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;

const FileInputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.inputBackground};
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.isDragging ? props.theme.colors.primaryLight : props.theme.colors.inputBackground};
  }
`;

const FileInputText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background-color: ${props => props.theme.colors.inputBackground};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch(props.filetype) {
      case 'pdf': return '#FF5252';
      case 'zip': return '#FFA000';
      case 'png': 
      case 'jpg': 
      case 'jpeg': return '#4CAF50';
      default: return props.theme.colors.textSecondary;
    }
  }};
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveFileButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const PdfIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M9 15h6"></path>
    <path d="M9 11h6"></path>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const ZipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0-2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.29 7 12 12 20.71 7"></polyline>
    <line x1="12" y1="22" x2="12" y2="12"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CreateNewProject = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    projectTechnology: '',
    projectStatus: 'New',
    projectJira: '',
    projectGit: '',
    projectTemplate: '',
    projectBrief: ''
  });
  
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Technology options
  const technologies = [
    { id: 'react', name: 'React', icon: '/logos/react-logo.svg' },
    { id: 'vue', name: 'Vue', icon: '/logos/vue-logo.svg' },
    { id: 'angular', name: 'Angular', icon: '/public/images/angular-logo.svg' },
    { id: 'python', name: 'Python', icon: '/logos/python-logo.svg' },
    { id: 'drupal', name: 'Drupal', icon: '/logos/drupal-logo.svg' },
    { id: 'adobe', name: 'Adobe', icon: '/logos/adobe-logo.svg' }
  ];
  
  // Regular templates for other technologies
  const regularTemplates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with a clean slate. No predefined components or structure.'
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'A template with hero section, features, testimonials, and contact form.'
    },
    {
      id: 'dashboard',
      name: 'Dashboard UI',
      description: 'Admin dashboard with sidebar navigation, cards, and data visualization components.'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Product listings, cart functionality, and checkout process.'
    }
  ];
  
  // Special templates for Adobe technology
  const adobeTemplates = [
    {
      id: 'template-1',
      name: 'Template 1',
      description: 'Adobe-specific template with Franklin components and AEM integration.'
    },
    {
      id: 'template-2',
      name: 'Template 2',
      description: 'Advanced Adobe template with Experience Manager and Analytics support.'
    }
  ];
  
  // Template state
  const [templates, setTemplates] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  
  // Fetch templates from API for Adobe technology type
  useEffect(() => {
    if (formData.projectTechnology === 'adobe') {
      setTemplateLoading(true);
      
      ApiService.getTemplates('adobe')
        .then(data => {
          if (data && data.length > 0) {
            setTemplates(data.map(template => ({
              id: template.id.toString(),
              name: template.name,
              description: template.description || 'Adobe Experience Manager template'
            })));
            
            // Set first template as default if none selected
            if (!formData.projectTemplate) {
              setFormData(prev => ({
                ...prev,
                projectTemplate: data[0].id.toString()
              }));
            }
          }
        })
        .catch(error => {
          console.error('Error fetching templates:', error);
          // Fallback to default templates if API fails
          setTemplates(adobeTemplates);
        })
        .finally(() => {
          setTemplateLoading(false);
        });
    } else {
      // Use regular templates for non-Adobe technologies
      setTemplates(regularTemplates);
    }
  }, [formData.projectTechnology]);
  
  // Get current templates based on selected technology
  const getTemplates = () => {
    if (formData.projectTechnology === 'adobe') {
      return templateLoading ? [] : templates.length > 0 ? templates : adobeTemplates;
    }
    return regularTemplates;
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle technology selection
  const handleTechSelect = (techId) => {
    // Update selected technology
    const newFormData = {
      ...formData,
      projectTechnology: techId
    };
    
    // Reset template selection when switching technologies
    if (techId === 'adobe') {
      // Set default Adobe template
      newFormData.projectTemplate = 'template-1';
    } else if (formData.projectTechnology === 'adobe') {
      // When switching from Adobe to another tech, reset to regular template
      newFormData.projectTemplate = 'blank';
    }
    
    setFormData(newFormData);
    
    // Clear error if there was one
    if (errors.projectTechnology) {
      setErrors({
        ...errors,
        projectTechnology: ''
      });
    }
  };
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      projectTemplate: template
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!formData.projectTechnology) {
      newErrors.projectTechnology = 'Please select a technology';
    }
    
    return newErrors;
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };
  
  // Validate allowed file types and add to state
  const validateAndAddFiles = (selectedFiles) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/zip', 'application/x-zip-compressed'];
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      return (
        allowedTypes.includes(fileType) || 
        ['png', 'jpg', 'jpeg', 'pdf', 'zip'].includes(fileExtension)
      );
    });
    
    if (validFiles.length !== selectedFiles.length) {
      setErrors({
        ...errors,
        files: 'Some files were skipped. Only PNG, JPG, ZIP, and PDF files are allowed.'
      });
      
      // Clear the error after 5 seconds
      setTimeout(() => {
        setErrors(prevErrors => ({
          ...prevErrors,
          files: undefined
        }));
      }, 5000);
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };
  
  // Remove a file from the list
  const removeFile = (fileToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };
  
  // Get file icon based on file type
  const getFileIcon = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
      return <PdfIcon />;
    } else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      return <ImageIcon />;
    } else if (fileExtension === 'zip') {
      return <ZipIcon />;
    }
    
    return <PdfIcon />;
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the project data structure to match the backend schema
      const projectData = {
        project_name: formData.projectName,
        project_type: formData.projectTechnology,
        project_description: formData.projectBrief,
        title: formData.projectName,
        project_metadata: {
          jira_board_url: formData.projectJira,
          selected_template: formData.projectTemplate,
          status: formData.projectStatus
        },
        github_repo_url: formData.projectGit,
        is_active: true
      };
      
      // Submit the project to the backend
      const createdProject = await ApiService.createProject(projectData);
      
      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          await ApiService.uploadProjectFile(createdProject.id, file);
        }
      }
      
      console.log('Project created successfully:', createdProject);
      
      // Navigate based on technology
      if (formData.projectTechnology === 'adobe') {
        navigate('/dashboard/adobe-franklin-project');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Check for specific error messages
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('already exists')) {
        setErrors({
          projectName: 'A project with this name already exists. Please use a different name.'
        });
      } else if (errorMessage.includes('GitHub repository URL is already linked to project')) {
        setErrors({
          projectGit: 'This GitHub repository is already linked to another project.'
        });
      } else if (errorMessage.includes('Invalid GitHub repository URL format')) {
        setErrors({
          projectGit: 'Invalid GitHub URL format. Please use: https://github.com/username/repository'
        });
      } else {
        setErrors({
          submit: 'Failed to create project. Please try again.'
        });
      }

      // Log the exact error for debugging
      console.log('Detailed error:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageContainer>
      <DashboardSidebar onToggle={handleSidebarToggle} />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <PageHeader>
          <HeaderTitle>
            <h1>Create New Project</h1>
            <p>Set up your project with the details below to get started</p>
          </HeaderTitle>
        </PageHeader>
        
        <FormContainer onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Project Information</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Enter project name"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
                {errors.projectName && <ErrorMessage>{errors.projectName}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            
            {/* Hidden status field */}
            <input 
              type="hidden" 
              name="projectStatus" 
              value={formData.projectStatus}
            />
            
            <FormGroup>
              <Label>Technology *</Label>
              <TechGrid>
                {technologies.map(tech => (
                  <TechCard
                    key={tech.id}
                    selected={formData.projectTechnology === tech.id}
                    onClick={() => handleTechSelect(tech.id)}
                  >
                    <TechIcon>
                      <img 
                        src={tech.icon} 
                        alt={`${tech.name} logo`} 
                        onError={(e) => {
                          e.target.onerror = null;
                          // Use a data URI for a simple colored circle with text instead of external placeholder
                          const letter = tech.name.charAt(0).toUpperCase();
                          const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#5F6368', '#8ab4f8'];
                          const colorIndex = tech.name.length % colors.length;
                          e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="${colors[colorIndex]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" font-weight="bold" fill="white" dominant-baseline="middle" text-anchor="middle">${letter}</text></svg>`;
                        }}
                      />
                    </TechIcon>
                    <TechName>{tech.name}</TechName>
                  </TechCard>
                ))}
              </TechGrid>
              {errors.projectTechnology && <ErrorMessage>{errors.projectTechnology}</ErrorMessage>}
            </FormGroup>
            
            <FileInputContainer>
              <Label>Project Files</Label>
              <FileInputLabel 
                htmlFor="project-files"
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileInputText>
                  <UploadIcon />
                  <div>
                    <p><strong>Drag and drop files here</strong> or click to browse</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      Supported formats: PNG, JPG, ZIP, PDF
                    </p>
                  </div>
                </FileInputText>
              </FileInputLabel>
              <FileInput
                type="file"
                id="project-files"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.zip"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              
              {errors.files && <ErrorMessage>{errors.files}</ErrorMessage>}
              
              {files.length > 0 && (
                <FileList>
                  {files.map((file, index) => (
                    <FileItem key={`${file.name}-${index}`}>
                      <FileIcon filetype={file.name.split('.').pop().toLowerCase()}>
                        {getFileIcon(file)}
                      </FileIcon>
                      <div>
                        {file.name.length > 20 
                          ? file.name.substring(0, 17) + '...' 
                          : file.name}
                        <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', opacity: 0.7 }}>
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <FileActions>
                        <RemoveFileButton 
                          type="button" 
                          onClick={() => removeFile(file)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <CloseIcon />
                        </RemoveFileButton>
                      </FileActions>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </FileInputContainer>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Project Links</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="projectJira">JIRA Board URL</Label>
                <Input
                  type="text"
                  id="projectJira"
                  name="projectJira"
                  placeholder="https://company.atlassian.net/jira/projects/..."
                  value={formData.projectJira}
                  onChange={handleInputChange}
                />
                <HelpText>Add your JIRA board URL to sync issues</HelpText>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="projectGit">Git Repository</Label>
                <Input
                  type="text"
                  id="projectGit"
                  name="projectGit"
                  placeholder="https://github.com/username/repository"
                  value={formData.projectGit}
                  onChange={handleInputChange}
                />
                <HelpText>Link your git repository for version control</HelpText>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Template</SectionTitle>
            
            <div>
              {getTemplates().map(template => (
                <TemplateOption 
                  key={template.id}
                  selected={formData.projectTemplate === template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateOption>
              ))}
            </div>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Project Brief</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="projectBrief">Brief Description</Label>
              <TextArea
                id="projectBrief"
                name="projectBrief"
                placeholder="Describe your project, its goals, and any specific requirements..."
                value={formData.projectBrief}
                onChange={handleInputChange}
              />
              <HelpText>Provide a brief description of your project to help AI understand your needs better</HelpText>
            </FormGroup>
          </FormSection>
          
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          
          <ButtonGroup>
            <SecondaryButton type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </PrimaryButton>
          </ButtonGroup>
        </FormContainer>
      </MainContent>
    </PageContainer>
  );
};

export default CreateNewProject;