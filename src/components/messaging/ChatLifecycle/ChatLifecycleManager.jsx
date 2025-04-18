/**
 * Chat Lifecycle Manager
 * 
 * Main component for managing chat lifecycle including:
 * - Loading and initializing chat lifecycle data
 * - Displaying countdown timer
 * - Showing warning notifications
 * - Handling chat extensions
 * - Managing read-only mode transitions
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useChatLifecycleStore from '../../../stores/useChatLifecycleStore';
import { getChatLifecycle } from '../../../@data/chatLifecycle';
import ChatDeactivationCountdown from './ChatDeactivationCountdown';
import ChatWarningModal from './ChatWarningModal';
import ChatLifecycleControls from './ChatLifecycleControls';
import ReadOnlyModeBanner from './ReadOnlyModeBanner';
import chatService from '../../../services/chatService';
import '../../styles/ChatLifecycle.css';

const ChatLifecycleManager = ({ 
  chatId,
  isAdmin = false,
  onStatusChange,
  adminControlsPosition = 'top',
  className = ''
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  // Get functions and state from the store
  const { 
    initChat,
    updateChatLifecycle,
    activeChats,
    setReadOnly,
    deactivateChat,
    isExpired
  } = useChatLifecycleStore();
  
  // Get the chat lifecycle data
  const chatData = activeChats[chatId];
  
  // Fetch the latest lifecycle data from the API
  const { data: lifecycleData, isLoading } = useQuery(
    ['chatLifecycle', chatId],
    () => chatService.getChatLifecycle(chatId),
    {
      staleTime: 60000, // 1 minute
      refetchInterval: 300000, // 5 minutes
      refetchOnWindowFocus: true,
      initialData: getChatLifecycle(chatId), // Use mock data initially
      onSuccess: (data) => {
        // Initialize the chat lifecycle data if needed
        if (data && !activeChats[chatId]) {
          initChat(chatId, data.eventEndTime, data.status);
        }
        
        // Update the lifecycle data in the store
        if (data) {
          updateChatLifecycle(chatId, data);
        }
        
        // If the chat is expired, set it to read-only mode
        if (data && data.status === 'archived' && !chatData?.isReadOnly) {
          setReadOnly(chatId, true);
          onStatusChange?.(chatId, 'archived');
        }
      }
    }
  );
  
  // Handle warning notification
  const handleWarningStart = () => {
    setShowWarningModal(true);
  };
  
  // Handle chat deactivation
  const handleDeactivation = async () => {
    if (chatData?.status !== 'archived') {
      deactivateChat(chatId);
      setReadOnly(chatId, true);
      onStatusChange?.(chatId, 'archived');
      
      try {
        // Call the API to deactivate the chat
        await chatService.deactivateChat(chatId);
      } catch (error) {
        console.error('Error deactivating chat:', error);
      }
    }
  };
  
  // Handle chat extension
  const handleExtension = async (chatId, newClosingTime) => {
    onStatusChange?.(chatId, 'active');
    
    try {
      // Call the API to extend the chat
      await chatService.extendChat(chatId);
    } catch (error) {
      console.error('Error extending chat:', error);
    }
  };
  
  // Check if the chat is expired on component mount
  useEffect(() => {
    if (chatData && isExpired(chatId) && chatData.status !== 'archived') {
      handleDeactivation();
    }
  }, [chatData, chatId, isExpired]);
  
  // Initialize the chat if we have initial data but no store data
  useEffect(() => {
    if (lifecycleData && !activeChats[chatId]) {
      initChat(chatId, lifecycleData.eventEndTime, lifecycleData.status);
    }
  }, [lifecycleData, chatId, activeChats, initChat]);
  
  // If still loading and no data, show loading state
  if (isLoading && !lifecycleData) {
    return <div className="chat-lifecycle-loading">Loading chat status...</div>;
  }
  
  // If no lifecycle data available, don't render
  if (!chatData && !lifecycleData) return null;
  
  // Check if the chat is in read-only mode
  const isReadOnly = chatData?.isReadOnly || lifecycleData?.isReadOnly;
  
  // Render the components based on their position
  const renderAdminControls = () => (
    isAdmin && <ChatLifecycleControls 
      chatId={chatId}
      onExtend={handleExtension}
      onDeactivate={handleDeactivation}
      isAdmin={isAdmin}
      disabled={isLoading}
    />
  );
  
  return (
    <div className={`chat-lifecycle-manager ${className}`} data-testid="chat-lifecycle-manager">
      {/* Admin controls - top position */}
      {adminControlsPosition === 'top' && renderAdminControls()}
      
      {/* Countdown timer */}
      <ChatDeactivationCountdown 
        chatId={chatId}
        onWarningStart={handleWarningStart}
        onDeactivation={handleDeactivation}
      />
      
      {/* Read-only mode banner */}
      <ReadOnlyModeBanner 
        visible={isReadOnly}
        message={lifecycleData?.readOnlyMessage}
      />
      
      {/* Admin controls - bottom position */}
      {adminControlsPosition === 'bottom' && renderAdminControls()}
      
      {/* Warning modal */}
      <ChatWarningModal 
        chatId={chatId}
        visible={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onExtend={handleExtension}
      />
    </div>
  );
};

ChatLifecycleManager.propTypes = {
  chatId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  onStatusChange: PropTypes.func,
  adminControlsPosition: PropTypes.oneOf(['top', 'bottom']),
  className: PropTypes.string
};

export default ChatLifecycleManager;
