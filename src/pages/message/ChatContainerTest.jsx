/**
 * Chat Container Components Test Page
 * 
 * Tests the following components:
 * 1. ChatModeBanner - Displays chat mode and countdown timers
 * 2. MemberList - Shows members with online/offline status and admin badges
 * 3. ChatHeader - Navigation and action buttons
 */

import React, { useState, useEffect, useCallback } from 'react';
import ChatHeader from '../../components/messaging/ChatHeader';
import ChatModeBanner from '../../components/messaging/ChatModeBanner';
import MemberList from '../../components/messaging/MemberList';
import { mockThreads, mockMembers } from '../../@data/mockChatContainers';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    console.error('Error in component:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>An error occurred in the test component.</p>
          <details>
            <summary>Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack: {this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ChatContainerTest = () => {
  // State for testing different modes and configurations
  const [activeTest, setActiveTest] = useState('all');
  const [selectedThread, setSelectedThread] = useState(mockThreads[0]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showMemberList, setShowMemberList] = useState(true);
  const [chatMode, setChatMode] = useState(selectedThread?.chatMode || 'group-chat');
  const [closingTime, setClosingTime] = useState(selectedThread?.closingTime || new Date().toISOString());
  const [currentUserId, setCurrentUserId] = useState('user-1');
  const [threadError, setThreadError] = useState('');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refresh test data
  const refreshTestData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    console.log('Test data refreshed');
  }, []);

  // Handle changing test thread with validation
  const handleThreadChange = (threadId) => {
    try {
      // Clear any previous errors
      setThreadError('');
      
      // Find the thread and validate it exists
      const thread = mockThreads.find(t => t.id === threadId);
      if (!thread) {
        setThreadError(`Thread with ID ${threadId} not found in mock data`);
        return;
      }
      
      // Validate required properties exist
      if (!thread.chatMode) {
        setThreadError(`Thread ${threadId} is missing chatMode property`);
        return;
      }
      if (!thread.closingTime) {
        setThreadError(`Thread ${threadId} is missing closingTime property`);
        return;
      }
      
      // Set the thread data
      setSelectedThread(thread);
      setChatMode(thread.chatMode);
      setClosingTime(thread.closingTime);
      
      // Refresh test data to ensure components are updated
      refreshTestData();
    } catch (error) {
      console.error('Error changing thread:', error);
      setThreadError(`Error changing thread: ${error.message}`);
    }
  };
  
  // Sync thread data when thread changes
  useEffect(() => {
    if (selectedThread) {
      // Keep local state in sync with selected thread
      setChatMode(selectedThread.chatMode || 'group-chat');
      setClosingTime(selectedThread.closingTime || new Date().toISOString());
    }
  }, [selectedThread]);
  
  // Extend time functionality removed as requested
  
  // Toggle chat mode
  const handleToggleChatMode = () => {
    const newMode = chatMode === 'group-chat' ? 'announcements-only' : 'group-chat';
    setChatMode(newMode);
    console.log(`Changed chat mode to: ${newMode}`);
  };
  
  // Handle back button click
  const handleBackClick = () => {
    console.log('Back button clicked');
  };
  
  // Handle viewport size change
  const handleViewportChange = (size) => {
    setViewportSize(size);
  };
  
  // Render test controls
  const renderTestControls = () => (
    <div className="test-controls">
      <h2>Test Controls</h2>
      
      <div className="control-group">
        <label>Test View</label>
        <select value={activeTest} onChange={(e) => setActiveTest(e.target.value)}>
          <option value="all">All Components</option>
          <option value="banner">Chat Mode Banner</option>
          <option value="members">Member List</option>
          <option value="header">Chat Header</option>
        </select>
      </div>
      
      <div className="control-group">
        <label>Thread</label>
        <select value={selectedThread.id} onChange={(e) => handleThreadChange(e.target.value)}>
          {mockThreads.map(thread => (
            <option key={thread.id} value={thread.id}>
              {thread.name} ({thread.chatMode})
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <label>Current User</label>
        <select value={currentUserId} onChange={(e) => setCurrentUserId(e.target.value)}>
          {mockMembers[selectedThread.id]?.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.isAdmin ? 'Admin' : 'Member'})
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <label>User Role</label>
        <div className="radio-options">
          <label>
            <input 
              type="radio" 
              name="isAdmin" 
              checked={isAdmin} 
              onChange={() => setIsAdmin(true)} 
            />
            Admin
          </label>
          <label>
            <input 
              type="radio" 
              name="isAdmin" 
              checked={!isAdmin} 
              onChange={() => setIsAdmin(false)} 
            />
            Regular Member
          </label>
        </div>
      </div>
      
      <div className="control-group">
        <label>Chat Mode</label>
        <div className="radio-options">
          <label>
            <input 
              type="radio" 
              name="chatMode" 
              checked={chatMode === 'group-chat'} 
              onChange={() => setChatMode('group-chat')} 
            />
            Group Chat
          </label>
          <label>
            <input 
              type="radio" 
              name="chatMode" 
              checked={chatMode === 'announcements-only'} 
              onChange={() => setChatMode('announcements-only')} 
            />
            Announcements Only
          </label>
        </div>
      </div>
      
      <div className="control-group">
        <label>Closing Time</label>
        <div className="date-display">
          {new Date(closingTime).toLocaleString()}
        </div>
      </div>
      
      <div className="control-group">
        <label>Show Member List</label>
        <div className="radio-options">
          <label>
            <input 
              type="checkbox" 
              checked={showMemberList} 
              onChange={() => setShowMemberList(!showMemberList)} 
            />
            Show Member List
          </label>
        </div>
      </div>
      
      <div className="control-group">
        <label>Test Data Management</label>
        <button 
          className="refresh-button"
          onClick={refreshTestData}
        >
          Refresh Test Data
        </button>
      </div>
      
      <div className="control-group">
        <label>Responsive Testing</label>
        <div className="viewport-controls">
          <button 
            className={`viewport-button ${viewportSize === 'mobile' ? 'active' : ''}`}
            onClick={() => handleViewportChange('mobile')}
          >
            Mobile (320px)
          </button>
          <button 
            className={`viewport-button ${viewportSize === 'tablet' ? 'active' : ''}`}
            onClick={() => handleViewportChange('tablet')}
          >
            Tablet (768px)
          </button>
          <button 
            className={`viewport-button ${viewportSize === 'desktop' ? 'active' : ''}`}
            onClick={() => handleViewportChange('desktop')}
          >
            Desktop (1024px+)
          </button>
        </div>
      </div>
      
      {threadError && (
        <div className="error-message">
          <p>{threadError}</p>
          <button onClick={() => setThreadError('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="test-page">
      <h1>Chat Container Components Test</h1>
      
      <div className="test-container">
        {renderTestControls()}
        
        <div 
          className={`component-test-area viewport-${viewportSize}`}
          style={{
            width: viewportSize === 'mobile' ? '320px' : 
                   viewportSize === 'tablet' ? '768px' : 'auto',
            margin: '0 auto',
            border: viewportSize !== 'desktop' ? '2px dashed #ccc' : 'none',
            padding: viewportSize !== 'desktop' ? '10px' : '0'
          }}
        >
          {(activeTest === 'all' || activeTest === 'header') && (
            <div className="test-section">
              <h2>Chat Header Component</h2>
              <div className="test-component chat-header-test">
                <ChatHeader 
                  threadId={selectedThread.id}
                  threadName={selectedThread.name}
                  memberCount={selectedThread.memberCount}
                  chatMode={chatMode}
                  isAdmin={isAdmin}
                  onBackClick={handleBackClick}
                  onToggleMemberList={() => setShowMemberList(!showMemberList)}
                  onToggleChatSettings={() => console.log('Toggle chat settings')}
                />
              </div>
              <div className="test-description">
                <p>Tests navigation, member list toggle, and action buttons.</p>
                <p>Admin users can see additional options for chat management.</p>
              </div>
            </div>
          )}
          
          {(activeTest === 'all' || activeTest === 'banner') && (
            <div className="test-section">
              <h2>Chat Mode Banner Component</h2>
              <div className="test-component">
                <ChatModeBanner 
                  chatMode={chatMode}
                  closingTime={closingTime}
                />
              </div>
              <div className="test-description">
                <p>Displays current chat mode and countdown timer until closing.</p>
              </div>
            </div>
          )}
          
          {(activeTest === 'all' || activeTest === 'members') && showMemberList && (
            <div className="test-section">
              <h2>Member List Component</h2>
              <div className="test-component member-list-container-test">
                <MemberList 
                  threadId={selectedThread.id}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  onViewProfile={(userId) => console.log(`View profile of user ${userId}`)}
                  // Override the useThreadMembers hook for testing
                  testMembers={mockMembers[selectedThread.id]}
                />
              </div>
              <div className="test-description">
                <p>Displays members with online/offline status and admin badges.</p>
                <p>Admin users can manage members.</p>
                <p>The current user is highlighted.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Convert to regular inline styles to avoid the jsx attribute warning */}
      <style>{`
        .error-boundary {
          padding: 20px;
          border: 2px solid #ff0000;
          border-radius: 5px;
          margin: 20px 0;
          background-color: #fff0f0;
        }
        
        .error-message {
          background-color: #ffeeee;
          border: 1px solid #ff0000;
          border-radius: 4px;
          padding: 10px;
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .error-message button {
          background-color: #ff6666;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
        }
        
        .refresh-button {
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 5px;
        }
        
        .viewport-controls {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }
        
        .viewport-button {
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f5f5f5;
          cursor: pointer;
        }
        
        .viewport-button.active {
          background-color: #007bff;
          color: white;
          border-color: #0056b3;
        }
        
        .viewport-mobile {
          width: 320px;
          margin: 0 auto;
        }
        
        .viewport-tablet {
          width: 768px;
          margin: 0 auto;
        }
        
        .test-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .test-container {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        
        .test-controls {
          flex: 0 0 300px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .component-test-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .test-section {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .test-section h2 {
          padding: 15px 20px;
          margin: 0;
          background-color: #4361ee;
          color: white;
          font-size: 18px;
        }
        
        .test-component {
          padding: 20px;
          border-bottom: 1px solid #e1e4e8;
        }
        
        .test-description {
          padding: 15px 20px;
          background-color: #f0f7ff;
          font-size: 14px;
        }
        
        .test-description p {
          margin: 5px 0;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        .control-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }
        
        .control-group select,
        .control-group input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .radio-options {
          display: flex;
          gap: 15px;
        }
        
        .radio-options label {
          font-weight: normal;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .button-group {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        
        .button-group button {
          padding: 6px 12px;
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .date-display {
          padding: 8px;
          background-color: #f0f7ff;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .chat-header-test {
          padding: 0;
        }
        
        .member-list-container-test {
          padding: 0;
          height: 400px;
        }
      `}</style>
    </div>
  );
};

// Wrap ChatContainerTest with ErrorBoundary
const ChatContainerTestWithErrorBoundary = () => (
  <ErrorBoundary>
    <ChatContainerTest />
  </ErrorBoundary>
);

export default ChatContainerTestWithErrorBoundary;
