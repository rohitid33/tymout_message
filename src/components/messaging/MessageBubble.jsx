/**
 * Message Bubble Component
 * 
 * Displays a single message in the chat interface with appropriate styling
 * based on message type and sender.
 * Supports various message types and displays relevant metadata.
 */

import React, { useState } from 'react';

/**
 * MessageBubble component renders different types of messages with appropriate styling and metadata
 * @param {Object} message - The message object containing content, sender, timestamp, etc.
 * @param {string} currentUserId - ID of the current user to determine message alignment
 * @param {Object} senderData - Optional user data for the sender (avatar, display name)
 * @param {Function} onReply - Optional callback when user replies to a message
 */
const MessageBubble = ({ 
  message,
  currentUserId,
  senderData,
  onReply
}) => {
  const { 
    id, 
    content, 
    senderId, 
    timestamp, 
    status, 
    isSystemMessage,
    messageType = 'text', // text, image, notification, etc.
    reactionCount,
    threadReplies
  } = message;
  
  // Local state
  const [showActions, setShowActions] = useState(false);
  
  // Determine message alignment and styling
  const isCurrentUser = senderId === currentUserId;
  
  // Get user display info
  const senderName = senderData?.name || senderId;
  const avatarUrl = senderData?.avatar || null;
  
  // Format timestamp for display with date if not today
  const messageDate = new Date(timestamp);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();
  
  const formattedTime = messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = isToday 
    ? formattedTime 
    : `${messageDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${formattedTime}`;
  
  // Render system messages/notifications
  if (isSystemMessage || messageType === 'notification') {
    return (
      <div className="message-system">
        <div className="message-system-content">
          {content}
        </div>
        <div className="message-system-time">
          {formattedDate}
        </div>
      </div>
    );
  }
  
  // Handle message with media content
  const renderContent = () => {
    switch (messageType) {
      case 'image':
        return (
          <div className="message-image-container">
            <img src={content} alt="Shared image" className="message-image" />
            {message.caption && <div className="message-image-caption">{message.caption}</div>}
          </div>
        );
      case 'link':
        return (
          <div className="message-link-preview">
            {message.linkData?.image && (
              <div className="message-link-image">
                <img src={message.linkData.image} alt="Link preview" />
              </div>
            )}
            <div className="message-link-content">
              <div className="message-link-title">{message.linkData?.title || content}</div>
              {message.linkData?.description && (
                <div className="message-link-description">{message.linkData.description}</div>
              )}
              <a href={content} target="_blank" rel="noopener noreferrer" className="message-link-url">
                {content}
              </a>
            </div>
          </div>
        );
      default: // text
        return <div className="message-content">{content}</div>;
    }
  };
  
  // Render delivery status with appropriate icon
  const renderStatus = () => {
    if (!isCurrentUser) return null;
    
    return (
      <span className="message-status" title={status}>
        {status === 'sending' && <span className="status-icon status-sending">⌛️</span>}
        {status === 'sent' && <span className="status-icon status-sent">✓</span>}
        {status === 'delivered' && <span className="status-icon status-delivered">✓</span>}
        {status === 'read' && <span className="status-icon status-read">✓✓</span>}
        {status === 'failed' && <span className="status-icon status-failed">!</span>}
      </span>
    );
  };
  
  // Handle mouse events for showing action buttons
  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => setShowActions(false);
  
  // Render regular user messages
  return (
    <div 
      className={`message-bubble ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sender avatar for incoming messages */}
      {!isCurrentUser && (
        <div className="message-sender-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={senderName} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">{senderName.charAt(0).toUpperCase()}</div>
          )}
        </div>
      )}
      
      <div className="message-content-container">
        {/* Display sender name for incoming messages */}
        {!isCurrentUser && (
          <div className="message-sender-name">
            {senderName}
          </div>
        )}
        
        {/* Message content based on type */}
        {renderContent()}
        
        {/* Message metadata (time, status) */}
        <div className="message-metadata">
          <span className="message-time" title={messageDate.toLocaleString()}>{formattedDate}</span>
          {renderStatus()}
        </div>
        
        {/* Message actions (visible on hover) */}
        {showActions && (
          <div className="message-actions">
            {onReply && (
              <button 
                className="message-action-button" 
                onClick={() => onReply(message)}
                title="Reply"
              >
                Reply
              </button>
            )}
            {threadReplies && threadReplies.length > 0 && (
              <div className="message-thread-indicator">
                {threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
