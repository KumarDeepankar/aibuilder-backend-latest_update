import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import { useTheme } from '../../context/ThemeContext';
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import FileExplorer from './FileExplorer';

// Main container
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

// Main content area - adjust to be more responsive to sidebar states
const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${props => props.sidebarCollapsed ? '70px' : '240px'};
  width: calc(100% - ${props => props.sidebarCollapsed ? '70px' : '240px'});
  transition: margin-left 0.3s ease, width 0.3s ease;
  position: relative; /* Ensure proper positioning of absolute elements */
  
  @media (max-width: 768px) {
    margin-left: 70px;
    width: calc(100% - 70px);
  }
`;

// Standardizing heights for consistent UI
const headerHeight = '60px';

// Top navigation bar
const TopBar = styled.div`
  height: ${headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: ${props => props.theme.colors.cardBackground};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ProjectTitle = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: ${props => props.theme.colors.text}; /* Ensure text is visible in dark mode */
  
  .file-name {
    color: ${props => props.theme.colors.primary};
    margin-left: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background-color: ${props => props.theme.colors.inputBackground};
    }
  }
  
  svg {
    margin-right: 6px;
  }
`;

// Main workspace area with chat and code editor
const Workspace = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

// Chat area - adjusted for collapsible behavior with fixed sidebar
const ChatArea = styled.div`
  width: ${props => props.collapsed ? '0' : '40%'};
  margin-right: 50px; /* Make space for the always-visible sidebar */
  display: flex;
  flex-direction: column;
  border-left: ${props => props.collapsed ? 'none' : `1px solid ${props.theme.colors.border}`};
  background-color: ${props => props.theme.colors.background};
  transition: width 0.3s ease;
  overflow: ${props => props.collapsed ? 'hidden' : 'visible'};
`;

// Chat toggle sidebar - always visible, adjusted to handle left sidebar collapses
const ChatToggle = styled.div`
  display: flex;
  position: fixed; /* Fixed positioning to avoid layout shifts */
  right: 0;
  top: 60px; /* Below the TopBar */
  bottom: 0;
  width: 50px;
  background-color: ${props => props.theme.colors.cardBackground};
  border-left: 1px solid ${props => props.theme.colors.border};
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  z-index: 10;
`;

const ChatToggleButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Chat area - adjusted width and position
const ChatHeader = styled.div`
  height: ${headerHeight};
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 90%;
  
  &.user-message {
    align-self: flex-end;
    
    .message-content {
      background-color: ${props => props.theme.colors.primary};
      color: white;
      border-radius: 16px 16px 4px 16px;
    }
  }
  
  &.ai-message {
    align-self: flex-start;
    
    .message-content {
      background-color: ${props => props.theme.colors.cardBackground};
      color: ${props => props.theme.colors.text};
      border-radius: 16px 16px 16px 4px;
    }
  }
  
  .message-content {
    padding: 1rem;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .message-meta {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TextInput = styled.textarea`
  flex: 1;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  height: 60px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SendButton = styled(Button)`
  padding: 0.5rem;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin: 0;
  }
`;

const AttachmentButton = styled(Button)`
  padding: 0.5rem;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin: 0;
  }
`;

// Code editor area - improved to better handle width changes when chat is toggled
const CodeEditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.cardBackground};
  transition: all 0.3s ease;
  width: ${props => props.chatCollapsed ? '100%' : '60%'}; /* Use full width when collapsed */
  padding-right: ${props => props.chatCollapsed ? '50px' : '0'}; /* Add padding instead of margin */
  overflow: hidden; /* Prevent content overflow during resize */
  box-sizing: border-box; /* Include padding in width calculation */
`;

// Editor header - adjusted for consistent height with chat header
const EditorHeader = styled.div`
  height: ${headerHeight};
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.cardBackground};
`;

// EditorTabs - adjusted to align with the editor content
const EditorTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
  align-items: center;
  overflow-x: auto;
  flex-grow: 1;

  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EditorTab = styled.div`
  padding: 0 1rem;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  position: relative;
  color: ${props => props.theme.colors.text};
  height: calc(${headerHeight} - 20px);
  
  &.active {
    background-color: ${props => props.theme.colors.inputBackground};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${props => props.theme.colors.primary};
      border-radius: 1px;
    }
    
    span {
      color: ${props => props.theme.colors.primary};
    }
  }
  
  .close-tab {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
`;

const EditorTools = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const EditorWorkspace = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const AttachmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="close-tab">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Add new Chat Icon
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Add collapse icon - Keep this icon for potential future use
const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

// When initializing the component state, set chatCollapsed to true by default
// so the chat is initially collapsed
const CodeAssistant = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(true); // Start with chat collapsed
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you with your code. How can I assist you today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  
  // Reference to Monaco editor instance
  const editorRef = useRef(null);
  const resizeTimerRef = useRef(null);
  
  // Handle editor mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };
  
  // Force editor layout update when chat panel is toggled
  useEffect(() => {
    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current);
    }
    
    // Wait for transition to complete before relayouting
    resizeTimerRef.current = setTimeout(() => {
      if (editorRef.current) {
        try {
          editorRef.current.layout();
        } catch (err) {
          console.log("Editor layout error:", err);
        }
      }
    }, 350); // Slightly longer than transition
    
    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [chatCollapsed]);
  
  // File content state
  const [files, setFiles] = useState({
    'index.js': `// Imports
import mongoose, { Schema } from "mongoose";

// Collection name
export const collection = 'Product';

// Schema
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {timestamps: true});

// Model
export default mongoose.model(collection, schema, collection);`,
    'App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My App</h1>
        <p>Start editing to see some magic happen!</p>
      </header>
    </div>
  );
}

export default App;`,
    'Button.js': `import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button\`
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  background-color: #3498db;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
\`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;`
  });
  
  // Tabs management
  const [openTabs, setOpenTabs] = useState(['index.js']);
  const [activeTab, setActiveTab] = useState('index.js');
  
  // Handle file selection from explorer
  const handleFileSelect = (filename, path) => {
    // If file isn't in tabs, add it
    if (!openTabs.includes(filename)) {
      setOpenTabs(prev => [...prev, filename]);
    }
    setActiveTab(filename);
  };
  
  // Handle tab close
  const handleCloseTab = (e, tab) => {
    e.stopPropagation(); // Prevent tab activation when closing
    
    // Remove tab
    const newTabs = openTabs.filter(t => t !== tab);
    setOpenTabs(newTabs);
    
    // If we're closing the active tab, activate another tab
    if (activeTab === tab && newTabs.length > 0) {
      setActiveTab(newTabs[0]);
    }
  };
  
  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle code change in editor
  const handleEditorChange = (value) => {
    setFiles(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setChatHistory(prev => [
      ...prev,
      {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }
    ]);
    
    // Clear input
    setMessage('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          type: 'ai',
          content: "I see you're working with a Mongoose schema for a Product model. This looks good! A few suggestions:\n\n1. Consider adding more fields like price, inventory, or categories.\n\n2. You may want to add validation for the description field.\n\n3. For better query performance, you might want to add indexes for fields you'll frequently search by.",
          timestamp: new Date().toISOString(),
        }
      ]);
    }, 1000);
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format timestamp
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Set Monaco editor options based on theme
  const getEditorOptions = () => {
    return {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false, // Disable automatic layout to prevent ResizeObserver errors
      minimap: {
        enabled: true
      },
      scrollBeyondLastLine: false,
      scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
        arrowSize: 15
      }
    };
  };

  // Handle editor theme based on the app theme
  const getEditorTheme = () => {
    return theme.mode === 'dark' ? 'vs-dark' : 'vs';
  };

  // Determine language based on file extension
  const getLanguageByFilename = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  // Toggle chat panel
  const toggleChat = () => {
    setChatCollapsed(!chatCollapsed);
    // Add console log for debugging
    console.log("Chat toggled. New state:", !chatCollapsed);
  };

  return (
    <Container>
      <DashboardSidebar onToggle={handleSidebarToggle} />
      <ContentArea sidebarCollapsed={sidebarCollapsed}>
        <TopBar>
          <ProjectTitle>
            <FileIcon />
            <span className="file-name">{activeTab}</span>
          </ProjectTitle>
          <ActionButtons>
            <Button className="secondary">
              <DownloadIcon />
              Export
            </Button>
            <Button className="primary">
              <PlayIcon />
              Run
            </Button>
          </ActionButtons>
        </TopBar>
        
        {/* Chat toggle sidebar - always visible */}
        <ChatToggle>
          <ChatToggleButton 
            onClick={toggleChat} 
            title={chatCollapsed ? "Show chat" : "Hide chat"}
          >
            <ChatIcon />
          </ChatToggleButton>
        </ChatToggle>
        
        <Workspace>
          <CodeEditorArea chatCollapsed={chatCollapsed}>
            <EditorHeader>
              <EditorTabs>
                {openTabs.map(tab => (
                  <EditorTab 
                    key={tab} 
                    className={tab === activeTab ? 'active' : ''}
                    onClick={() => handleTabClick(tab)}
                  >
                    <FileIcon extension={tab.split('.').pop()} />
                    <span>{tab}</span>
                    <div onClick={(e) => handleCloseTab(e, tab)}>
                      <CloseIcon />
                    </div>
                  </EditorTab>
                ))}
              </EditorTabs>
              <EditorTools>
                {/* You can add editor tools here like save, format, etc. */}
              </EditorTools>
            </EditorHeader>
            <EditorWorkspace>
              <FileExplorer onFileSelect={handleFileSelect} />
              <EditorContainer>
                <Editor
                  height="100%"
                  defaultLanguage={getLanguageByFilename(activeTab)}
                  value={files[activeTab]}
                  onChange={handleEditorChange}
                  theme={getEditorTheme()}
                  options={getEditorOptions()}
                  path={activeTab}
                  key={activeTab} /* Important to re-render editor when switching tabs */
                  onMount={handleEditorDidMount}
                />
              </EditorContainer>
            </EditorWorkspace>
          </CodeEditorArea>
          
          <ChatArea collapsed={chatCollapsed}>
            <ChatHeader>
              <span>Chat Assistant</span>
            </ChatHeader>
            <ChatMessages>
              {chatHistory.map((msg, index) => (
                <Message key={index} className={`${msg.type}-message`}>
                  <div className="message-content" 
                       dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                  <div className="message-meta">
                    <span>{msg.type === 'user' ? 'You' : 'AI Assistant'}</span>
                    <span>•</span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </Message>
              ))}
            </ChatMessages>
            <ChatInput>
              <InputArea>
                <AttachmentButton className="secondary">
                  <AttachmentIcon />
                </AttachmentButton>
                <TextInput 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <SendButton className="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </SendButton>
              </InputArea>
            </ChatInput>
          </ChatArea>
        </Workspace>
      </ContentArea>
    </Container>
  );
};

export default CodeAssistant;