import React, { useState } from 'react';
import styled from 'styled-components';

// File Explorer styles
const ExplorerContainer = styled.div`
  width: 220px;
  border-right: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ExplorerHeader = styled.div`
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.text}; /* Explicitly set text color to match theme */
  background-color: ${props => props.theme.colors.cardBackground};
`;

const ExplorerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
  }
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const FileItem = styled.div`
  padding: 0.35rem 1rem 0.35rem ${props => `${props.level * 16 + 16}px`};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  user-select: none;
  font-size: 13px;
  
  &:hover {
    background-color: ${props => props.theme.colors.inputBackground};
  }
  
  &.active {
    background-color: ${props => props.theme.colors.primary + '20'};
    color: ${props => props.theme.colors.primary};
  }
  
  .icon {
    opacity: 0.7;
  }
`;

// Icons
const FolderIcon = ({ isOpen }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
    {isOpen ? (
      <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </>
    ) : (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    )}
  </svg>
);

const FileIcon = ({ extension }) => {
  let iconColor = 'currentColor';
  
  // You can customize colors based on file types
  if (extension === 'js' || extension === 'jsx') iconColor = '#f0db4f';
  if (extension === 'css') iconColor = '#264de4';
  if (extension === 'html') iconColor = '#e34c26';
  if (extension === 'json') iconColor = '#5cd240';
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      {extension && (
        <text 
          x="12" 
          y="18" 
          fontFamily="monospace" 
          fontSize="6"
          textAnchor="middle"
          fill={iconColor}
          strokeWidth="0"
        >
          {extension}
        </text>
      )}
    </svg>
  );
};

const NewFileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

const NewFolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    <line x1="12" y1="11" x2="12" y2="17"></line>
    <line x1="9" y1="14" x2="15" y2="14"></line>
  </svg>
);

const FileExplorer = ({ onFileSelect }) => {
  const [activeFile, setActiveFile] = useState('index.js');
  const [expandedFolders, setExpandedFolders] = useState({
    'src': true,
    'components': true
  });
  
  // Sample project structure - in a real app, you'd fetch this from your backend
  const projectFiles = {
    name: 'project-root',
    type: 'folder',
    children: [
      {
        name: 'package.json',
        type: 'file',
        extension: 'json'
      },
      {
        name: 'README.md',
        type: 'file',
        extension: 'md'
      },
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'index.js',
            type: 'file', 
            extension: 'js'
          },
          {
            name: 'App.js',
            type: 'file',
            extension: 'js'
          },
          {
            name: 'App.css',
            type: 'file',
            extension: 'css'
          },
          {
            name: 'components',
            type: 'folder',
            children: [
              {
                name: 'Button.js',
                type: 'file',
                extension: 'js'
              },
              {
                name: 'Card.js',
                type: 'file',
                extension: 'js'
              },
              {
                name: 'Modal.js',
                type: 'file',
                extension: 'js'
              }
            ]
          },
          {
            name: 'utils',
            type: 'folder',
            children: [
              {
                name: 'helpers.js',
                type: 'file',
                extension: 'js'
              },
              {
                name: 'api.js',
                type: 'file',
                extension: 'js'
              }
            ]
          }
        ]
      }
    ]
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleFileClick = (file, path) => {
    setActiveFile(file);
    if (onFileSelect) {
      onFileSelect(file, path);
    }
  };
  
  // Recursive function to render the file tree
  const renderFileTree = (item, level = 0, path = '') => {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    
    if (item.type === 'folder') {
      const isExpanded = expandedFolders[currentPath];
      
      return (
        <React.Fragment key={currentPath}>
          <FileItem 
            level={level}
            onClick={() => toggleFolder(currentPath)}
          >
            <FolderIcon isOpen={isExpanded} />
            <span>{item.name}</span>
          </FileItem>
          
          {isExpanded && item.children && (
            <>
              {item.children.map(child => renderFileTree(child, level + 1, currentPath))}
            </>
          )}
        </React.Fragment>
      );
    } else {
      return (
        <FileItem 
          key={currentPath}
          level={level}
          className={activeFile === item.name ? 'active' : ''}
          onClick={() => handleFileClick(item.name, currentPath)}
        >
          <FileIcon extension={item.extension} />
          <span>{item.name}</span>
        </FileItem>
      );
    }
  };

  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <span>Explorer</span>
        <ExplorerActions>
          <ActionButton title="New File">
            <NewFileIcon />
          </ActionButton>
          <ActionButton title="New Folder">
            <NewFolderIcon />
          </ActionButton>
        </ExplorerActions>
      </ExplorerHeader>
      <FileList>
        {projectFiles.children.map(item => renderFileTree(item))}
      </FileList>
    </ExplorerContainer>
  );
};

export default FileExplorer;