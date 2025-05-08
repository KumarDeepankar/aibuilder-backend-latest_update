import axios from 'axios';
import config from '../config/config';

const ApiService = {
  // Create a new project
  async createProject(projectData) {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/projects/`, projectData);
      localStorage.setItem('project_id', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data?.detail || 'Server error occurred';
        throw new Error(message); // Don't add prefix to keep original error message
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        throw error;
      }
    }
  },

  // Upload a file for a project
  async uploadProjectFile(projectId, file) {
    try {
      // Validate file size
      if (file.size > config.MAX_UPLOAD_SIZE) {
        throw new Error(`File size exceeds maximum allowed size of ${config.MAX_UPLOAD_SIZE / (1024 * 1024)}MB`);
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${config.API_BASE_URL}/projects/${projectId}/images/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        const message = error.response.data?.detail || 'File upload failed';
        throw new Error(`Upload error: ${message}`);
      } else if (error.request) {
        throw new Error('Network error during upload. Please try again.');
      } else {
        throw error;
      }
    }
  },

  // Get templates
  async getTemplates(templateType = null) {
    try {
      const params = templateType ? { template_type: templateType } : {};
      const response = await axios.get(`${config.API_BASE_URL}/aem-templates/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      if (error.response) {
        const message = error.response.data?.detail || 'Failed to load templates';
        throw new Error(`Template error: ${message}`);
      } else if (error.request) {
        throw new Error('Network error when loading templates. Using default templates.');
      } else {
        throw error;
      }
    }
  },

  // Get Metadata.
  async getMetadata() {
    const project_data = localStorage.getItem('project_id');
    localStorage.removeItem('project_id');
    const response = await axios.get(`${config.API_BASE_URL}/api/analysis-metadata/`, project_data);
    return response.data;
    // try {
    //   if (!project_metadata || Object.keys(project_metadata).length === 0) {
    //     throw new Error('No project metadata available');
    //   }
    //   console.log('Fetching metadata for project:', project_metadata);
    //   return project_metadata;
    // } catch (error) {
    //   console.error('Error fetching metadata:', error);
    //   throw new Error('Data is not present');
    // }
  }
};

export default ApiService;