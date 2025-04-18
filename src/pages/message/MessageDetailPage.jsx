/**
 * Message Detail Page
 * 
 * Displays a chat thread with messages, members, and thread controls.
 * Combines all the chat container components into a cohesive chat experience.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useThreadSummaryQuery, useMarkThreadAsReadMutation } from '../../hooks/queries/useChatListQueries';
import { useMessagesQuery } from '../../hooks/queries/useMessagingQueries';
import { useResponsive } from '../../utils/responsive';
import { createAccessibleClickProps } from '../../utils/accessibility';
import { announceToScreenReader } from '../../utils/accessibility';
import websocketService from '../../services/websocketService';
import { SOCKET_EVENTS } from '../../services/websocketService';

// UI Components
import ChatHeader from '../../components/messaging/ChatHeader';
import ChatModeBanner from '../../components/messaging/ChatModeBanner';
import MemberList from '../../components/messaging/MemberList';
import LeaveChatButton from '../../components/messaging/LeaveChatButton';
import MessageList from '../../components/messaging/MessageList';
import MessageInput from '../../components/messaging/MessageInput';
import MessageTypingIndicator from '../../components/messaging/MessageTypingIndicator';

// Empty States
import EmptyThread from '../../components/messaging/EmptyStates/EmptyThread';
import ThreadNotFound from '../../components/messaging/EmptyStates/ThreadNotFound';
import '../../styles/MessageDetailPage.css';

const MessageDetailPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isMobile } = useResponsive();
  
  // Component state
  const [showMemberList, setShowMemberList] = useState(!isMobile);
  const [currentUserId, setCurrentUserId] = useState('user-1'); // In production, get from auth
  const [typingUsers, setTypingUsers] = useState([]);
  const reconnectingRef = useRef(false);
  const connectionErrorRef = useRef(false);
  
  // Queries
  const { 
    data: threadSummary,
    isLoading: isLoadingThread,
    isError: isThreadError,
    error: threadError
  } = useThreadSummaryQuery(threadId);
  
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMessagesQuery(threadId);
  
  // Mutations
  const markAsReadMutation = useMarkThreadAsReadMutation();
  
  // Mark thread as read when first loaded
  useEffect(() => {
    if (threadId && !isLoadingThread && !isThreadError && threadSummary) {
      markAsReadMutation.mutate(threadId);
    }
  }, [threadId, isLoadingThread, isThreadError, threadSummary, markAsReadMutation]);
  
  // Join thread via WebSocket for real-time updates
  useEffect(() => {
    if (threadId) {
      // Initialize connection status
      const handleConnectionError = () => {
        connectionErrorRef.current = true;
        announceToScreenReader('Connection lost. Attempting to reconnect...');
      };
      
      const handleReconnecting = () => {
        reconnectingRef.current = true;
      };
      
      const handleReconnected = () => {
        if (reconnectingRef.current) {
          announceToScreenReader('Connection restored.');
          // Refresh data
          queryClient.invalidateQueries(['messages', threadId]);
          queryClient.invalidateQueries(['threadSummary', threadId]);
          queryClient.invalidateQueries(['members', threadId]);
        }
        reconnectingRef.current = false;
        connectionErrorRef.current = false;
      };
      
      websocketService.joinThread(threadId);
      
      // Listen for new messages
      const unsubscribeMessage = websocketService.subscribe(
        SOCKET_EVENTS.NEW_MESSAGE,
        (data) => {
          if (data.threadId === threadId) {
            // Invalidate messages query to refetch with new message
            queryClient.invalidateQueries(['messages', threadId]);
            
            // Play notification sound if message is from someone else
            if (data.senderId !== currentUserId) {
              // Play notification sound (implemented elsewhere)
            }
          }
        }
      );
      
      // Listen for member status changes
      const unsubscribeStatus = websocketService.subscribe(
        SOCKET_EVENTS.MEMBER_STATUS_CHANGE,
        (data) => {
          // Update member list query
          queryClient.invalidateQueries(['members', threadId]);
        }
      );
      
      // Listen for typing indicators
      const unsubscribeTyping = websocketService.subscribe(
        SOCKET_EVENTS.TYPING_INDICATOR,
        (data) => {
          if (data.threadId === threadId && data.userId !== currentUserId) {
            if (data.isTyping) {
              setTypingUsers(prev => {
                // Add user if not already in the list
                if (!prev.some(user => user.id === data.userId)) {
                  return [...prev, { id: data.userId, name: data.userName || 'Someone' }];
                }
                return prev;
              });
            } else {
              // Remove user when they stop typing
              setTypingUsers(prev => prev.filter(user => user.id !== data.userId));
            }
          }
        }
      );
      
      // Listen for connection status
      const unsubscribeError = websocketService.subscribe(SOCKET_EVENTS.ERROR, handleConnectionError);
      const unsubscribeReconnecting = websocketService.subscribe(SOCKET_EVENTS.RECONNECT_ATTEMPT, handleReconnecting);
      const unsubscribeReconnected = websocketService.subscribe(SOCKET_EVENTS.RECONNECT, handleReconnected);
      
      // Cleanup when unmounting
      return () => {
        websocketService.leaveThread(threadId);
        unsubscribeMessage();
        unsubscribeStatus();
        unsubscribeTyping();
        unsubscribeError();
        unsubscribeReconnecting();
        unsubscribeReconnected();
      };
    }
  }, [threadId, queryClient, currentUserId]);
  
  // Handle back navigation
  const handleBackClick = useCallback(() => {
    navigate('/messages');
  }, [navigate]);
  
  // Toggle member list visibility
  const handleToggleMemberList = useCallback(() => {
    setShowMemberList(prev => !prev);
  }, []);
  
  // Detect typing and send indicator
  const handleTypingStart = useCallback(() => {
    if (threadId) {
      websocketService.sendTypingIndicator(threadId, true);
    }
  }, [threadId]);
  
  const handleTypingStop = useCallback(() => {
    if (threadId) {
      websocketService.sendTypingIndicator(threadId, false);
    }
  }, [threadId]);

  // Check if thread is in read-only mode
  const isReadOnly = threadSummary?.thread?.status === 'read-only';
  const isConnectionIssue = connectionErrorRef.current || reconnectingRef.current;
  
  // Render loading state
  if (isLoadingThread) {
    return (
      <div className="message-detail-page loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (isThreadError) {
    return (
      <ThreadNotFound 
        error={threadError} 
        onBack={handleBackClick}
      />
    );
  }
  
  // If thread not found
  if (!threadSummary) {
    return (
      <ThreadNotFound
        onBack={handleBackClick}
      />
    );
  }
  
  const thread = threadSummary.thread;
  
  return (
    <div className="message-detail-page">
      <div className="chat-container">
        <ChatHeader 
          threadId={thread.id}
          threadName={thread.name}
          memberCount={thread.memberCount}
          chatMode={thread.chatMode}
          isAdmin={threadSummary.members?.admins > 0}
          onBackClick={handleBackClick}
          onToggleMemberList={handleToggleMemberList}
        />
        
        <ChatModeBanner 
          chatMode={thread.chatMode}
          closingTime={thread.closingTime}
          isReadOnly={isReadOnly}
        />
        
        <div className="chat-main-content">
          <div className="chat-message-area">
            <MessageList 
              threadId={threadId}
              messages={messagesData?.pages.flatMap(page => page.data) || []}
              isLoading={isLoadingMessages}
              isError={isMessagesError}
              error={messagesError}
              currentUserId={currentUserId}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage}
              isLoadingMore={isFetchingNextPage}
              EmptyState={EmptyThread}
            />
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator-container">
                <MessageTypingIndicator users={typingUsers} />
              </div>
            )}
            
            {isConnectionIssue && (
              <div className="connection-status-banner">
                {reconnectingRef.current && (
                  <div className="reconnecting-indicator">
                    Reconnecting...
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                {connectionErrorRef.current && !reconnectingRef.current && (
                  <div className="connection-error">
                    Connection lost. Messages will be sent when reconnected.
                  </div>
                )}
              </div>
            )}
            
            <MessageInput 
              threadId={threadId}
              isReadOnly={isReadOnly}
              currentUserId={currentUserId}
              chatMode={thread.chatMode}
              isAdmin={threadSummary.members?.preview.some(m => m.id === currentUserId && m.isAdmin)}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={isConnectionIssue}
            />
          </div>
          
          {showMemberList && (
            <div className="chat-sidebar">
              <MemberList 
                threadId={threadId}
                currentUserId={currentUserId}
                isAdmin={threadSummary.members?.preview.some(m => m.id === currentUserId && m.isAdmin)}
              />
              {/* Show LeaveChatButton for non-admins */}
              {threadSummary && !threadSummary.members?.preview.some(m => m.id === currentUserId && m.isAdmin) && (
                <div style={{ marginTop: 16 }}>
                  <LeaveChatButton
                    chatId={threadId}
                    currentUserId={currentUserId}
                    onLeft={() => navigate('/messages')}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPage;
