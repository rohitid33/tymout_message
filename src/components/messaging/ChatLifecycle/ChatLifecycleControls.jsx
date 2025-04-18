/**
 * Chat Lifecycle Controls
 * 
 * A component that provides admin controls for managing chat lifecycle,
 * including extending chat time and manual deactivation.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useChatLifecycleStore from '../../../stores/useChatLifecycleStore';
import { useQueryClient } from '@tanstack/react-query';
import '../../styles/ChatLifecycle.css';

const ChatLifecycleControls = ({ 
  chatId, 
  onExtend, 
  onDeactivate, 
  isAdmin = false,
  disabled = false
}) => {
  const [isExtending, setIsExtending] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    getTimeRemaining, 
    extendChat, 
    deactivateChat,
    activeChats
  } = useChatLifecycleStore();
  
  const chatData = activeChats[chatId];
  const timeLeft = getTimeRemaining(chatId);
  
  // If no lifecycle data, don't render controls
  if (!chatData) return null;
  
  // Only admins can see these controls
  if (!isAdmin) return null;
  
  // Handle extending chat time
  const handleExtend = async () => {
    if (disabled || isExtending) return;
    
    setIsExtending(true);
    try {
      const newClosingTime = extendChat(chatId);
      onExtend?.(chatId, newClosingTime);
      // Invalidate any relevant queries
      queryClient.invalidateQueries(['chatLifecycle', chatId]);
    } catch (error) {
      console.error('Error extending chat:', error);
    } finally {
      setIsExtending(false);
    }
  };
  
  // Handle manually deactivating the chat
  const handleDeactivate = async () => {
    if (disabled || isDeactivating) return;
    
    if (!window.confirm('Are you sure you want to archive this chat? It will become read-only.')) {
      return;
    }
    
    setIsDeactivating(true);
    try {
      deactivateChat(chatId);
      onDeactivate?.(chatId);
      // Invalidate any relevant queries
      queryClient.invalidateQueries(['chatLifecycle', chatId]);
    } catch (error) {
      console.error('Error deactivating chat:', error);
    } finally {
      setIsDeactivating(false);
    }
  };
  
  // Format the closing time
  const formatClosingTime = () => {
    if (!chatData.closingTime) return 'Not set';
    
    const closingDate = new Date(chatData.closingTime);
    return closingDate.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="chat-lifecycle-controls" data-testid="chat-lifecycle-controls">
      <div className="lifecycle-info">
        <div className="info-item">
          <span className="info-label">Status:</span>
          <span className={`info-value status-${chatData.status}`}>
            {chatData.status.charAt(0).toUpperCase() + chatData.status.slice(1)}
          </span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Closing at:</span>
          <span className="info-value">{formatClosingTime()}</span>
        </div>
        
        {chatData.extensionCount > 0 && (
          <div className="info-item">
            <span className="info-label">Extensions:</span>
            <span className="info-value">{chatData.extensionCount}</span>
          </div>
        )}
      </div>
      
      <div className="lifecycle-actions">
        {chatData.status === 'active' && (
          <>
            <button
              className="lifecycle-button extend"
              onClick={handleExtend}
              disabled={disabled || isExtending}
              data-testid="extend-chat-button"
            >
              {isExtending ? 'Extending...' : 'Extend by 6 hours'}
            </button>
            
            <button
              className="lifecycle-button deactivate"
              onClick={handleDeactivate}
              disabled={disabled || isDeactivating}
              data-testid="deactivate-chat-button"
            >
              {isDeactivating ? 'Archiving...' : 'Archive Now'}
            </button>
          </>
        )}
        
        {chatData.status === 'archived' && (
          <div className="archived-message">
            This chat has been archived and is now read-only.
          </div>
        )}
      </div>
    </div>
  );
};

ChatLifecycleControls.propTypes = {
  chatId: PropTypes.string.isRequired,
  onExtend: PropTypes.func,
  onDeactivate: PropTypes.func,
  isAdmin: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ChatLifecycleControls;
