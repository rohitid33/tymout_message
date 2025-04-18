/**
 * Chat Header Component
 * 
 * Header for chat interface with navigation and action buttons.
 * Includes thread name, member count, and controls for chat management.
 * Mobile-first responsive design.
 */

import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiUsers, 
  FiMoreVertical, 
  FiSettings,
  FiLogOut,
  FiClock,
  FiMessageSquare,
  FiVolume2
} from 'react-icons/fi';
import { useSetChatMode, useLeaveThread } from '../../hooks/queries/useMessagingQueries';

const ChatHeader = ({ 
  threadId,
  threadName,
  memberCount = 0,
  chatMode = 'group-chat',
  isAdmin = false,
  onBackClick,
  onToggleMemberList,
  onToggleChatSettings
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Mutations for chat actions
  const setChatModeMutation = useSetChatMode();
  const leaveThreadMutation = useLeaveThread();
  
  // Toggle dropdown menu
  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };
  
  // Handle chat mode toggle
  const handleToggleChatMode = () => {
    const newMode = chatMode === 'group-chat' ? 'announcements-only' : 'group-chat';
    
    setChatModeMutation.mutate({
      threadId,
      mode: newMode
    }, {
      onSuccess: () => {
        setShowOptions(false);
      }
    });
  };
  
  // Handle leaving the thread
  const handleLeaveThread = () => {
    if (window.confirm(`Are you sure you want to leave "${threadName}"?`)) {
      leaveThreadMutation.mutate(threadId, {
        onSuccess: () => {
          if (onBackClick) onBackClick();
        }
      });
    }
  };
  
  return (
    <div className="chat-header">
      <div className="header-left">
        <button 
          className="back-button"
          onClick={onBackClick}
          aria-label="Go back"
        >
          <FiArrowLeft />
        </button>
        
        <div className="thread-info">
          <h2 className="thread-name">{threadName}</h2>
          <div className="thread-meta">
            <span className="member-count">
              <FiUsers className="meta-icon" />
              {memberCount}
            </span>
            <span className={`chat-mode-indicator ${chatMode}`}>
              {chatMode === 'group-chat' 
                ? <FiMessageSquare className="meta-icon" />
                : <FiVolume2 className="meta-icon" />
              }
              {chatMode === 'group-chat' ? 'Group Chat' : 'Announcements Only'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="header-actions">
        <button 
          className="member-list-toggle"
          onClick={onToggleMemberList}
          aria-label="Toggle member list"
        >
          <FiUsers />
        </button>
        
        {isAdmin && (
          <button 
            className="settings-button"
            onClick={onToggleChatSettings}
            aria-label="Chat settings"
          >
            <FiSettings />
          </button>
        )}
        
        <div className="options-menu">
          <button 
            className="options-toggle"
            onClick={toggleOptions}
            aria-label="More options"
          >
            <FiMoreVertical />
          </button>
          
          {showOptions && (
            <div className="dropdown-menu">
              {isAdmin && (
                <button 
                  className="dropdown-item mode-toggle"
                  onClick={handleToggleChatMode}
                >
                  {chatMode === 'group-chat' 
                    ? <><FiVolume2 className="item-icon" /> Switch to Announcements Only</> 
                    : <><FiMessageSquare className="item-icon" /> Switch to Group Chat</>
                  }
                </button>
              )}
              
              {isAdmin && (
                <button 
                  className="dropdown-item extend-time"
                  onClick={onToggleChatSettings}
                >
                  <FiClock className="item-icon" /> Extend Chat Time
                </button>
              )}
              
              <button 
                className="dropdown-item leave-thread"
                onClick={handleLeaveThread}
              >
                <FiLogOut className="item-icon" /> Leave Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
