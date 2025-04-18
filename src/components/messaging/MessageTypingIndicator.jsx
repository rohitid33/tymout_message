/**
 * Message Typing Indicator Component
 * 
 * Displays an animated indicator when users are typing in the chat.
 * Supports showing names of typing users and different animation styles.
 * Enhanced to show user name prominently when a single user is typing.
 */

import React, { useEffect, useState } from 'react';

/**
 * Message Typing Indicator Component
 * @param {Array} typingUsers - Array of user objects who are currently typing
 * @param {string} currentUserId - ID of the current user
 * @param {boolean} isCompact - Whether to show a compact version (dots only)
 * @param {string} customText - Optional custom text to display instead of default "[User] is typing..."
 * @param {number} timeout - Optional timeout to remove typing indicator after inactivity (ms)
 * @param {boolean} showAvatar - Whether to show user avatar when a single user is typing
 */
const MessageTypingIndicator = ({
  typingUsers = [],
  currentUserId,
  isCompact = false,
  customText = '', 
  timeout = 10000, // 10 seconds
  showAvatar = true
}) => {
  // Filter out current user and create a filtered list
  const filteredTypingUsers = typingUsers.filter(user => user.id !== currentUserId);
  
  // Track visibility with state
  const [isVisible, setIsVisible] = useState(false);
  
  // Set up timeout to hide the indicator after inactivity
  useEffect(() => {
    if (filteredTypingUsers.length > 0) {
      setIsVisible(true);
      
      // Set timeout to hide after specified period
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [filteredTypingUsers, timeout]);
  
  // Don't render if no one is typing or if hidden
  if (filteredTypingUsers.length === 0 || !isVisible) {
    return null;
  }
  
  const isSingleUser = filteredTypingUsers.length === 1;
  const singleUser = isSingleUser ? filteredTypingUsers[0] : null;
  
  // Generate text for typing users
  const getTypingText = () => {
    if (customText) return customText;
    
    const count = filteredTypingUsers.length;
    
    if (count === 1) {
      return `${filteredTypingUsers[0].name || 'Someone'} is typing...`;
    } else if (count === 2) {
      return `${filteredTypingUsers[0].name} and ${filteredTypingUsers[1].name} are typing...`;
    } else if (count === 3) {
      return `${filteredTypingUsers[0].name}, ${filteredTypingUsers[1].name}, and ${filteredTypingUsers[2].name} are typing...`;
    } else {
      return `${count} people are typing...`;
    }
  };
  
  // Get user avatar initial for single-user typing
  const getAvatarInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };
  
  // Render compact version (dots only)
  if (isCompact) {
    return (
      <div className="typing-indicator-compact" aria-label={getTypingText()}>
        <div className="typing-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isSingleUser && <div className="typing-compact-text">{singleUser.name}</div>}
      </div>
    );
  }
  
  // Render single-user typing indicator with enhanced styling
  if (isSingleUser) {
    return (
      <div className="typing-indicator typing-indicator-single">
        {showAvatar && (
          <div className="typing-user-avatar">
            {singleUser.avatar ? (
              <img src={singleUser.avatar} alt={singleUser.name} className="typing-avatar-image" />
            ) : (
              <div className="typing-avatar-placeholder">{getAvatarInitial(singleUser.name)}</div>
            )}
          </div>
        )}
        <div className="typing-content">
          <div className="typing-user-name">{singleUser.name}</div>
          <div className="typing-status">
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="typing-text">typing...</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render multi-user typing indicator with text
  return (
    <div className="typing-indicator typing-indicator-multi">
      <div className="typing-animation">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="typing-text">{getTypingText()}</div>
    </div>
  );
};

export default MessageTypingIndicator;
