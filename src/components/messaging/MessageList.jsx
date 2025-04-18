/**
 * Message List Component
 * 
 * Renders a list of messages with virtualization for optimal performance.
 * Uses react-window for efficient rendering of large message lists.
 */

import React, { useRef, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import MessageBubble from './MessageBubble.jsx';

/**
 * Estimates the height of a message for virtualization
 * @param {Object} message - The message object
 * @returns {number} - Estimated height in pixels
 */
const estimateMessageHeight = (message) => {
  // Base height for a simple message with short content
  let height = 70;
  
  // Add more height for longer content (rough estimate)
  if (message.content && typeof message.content === 'string') {
    // Add 20px for each ~50 characters (rough approximation)
    height += Math.floor(message.content.length / 50) * 20;
  }
  
  // Add height for different message types
  if (message.messageType === 'image') {
    height += 200; // Base height for images
  } else if (message.messageType === 'link') {
    height += 100; // Base height for link previews
  } else if (message.isSystemMessage) {
    height = 40; // System messages are typically smaller
  }
  
  // Add height for thread replies indicator
  if (message.threadReplies && message.threadReplies.length > 0) {
    height += 20;
  }
  
  return height;
};

/**
 * Message row component for virtualized list
 */
const MessageRow = ({ index, style, data }) => {
  const { messages, currentUserId, usersMap, onReplyToMessage } = data;
  const message = messages[index];
  
  // Add spacing between messages
  const rowStyle = {
    ...style,
    paddingTop: 4,
    paddingBottom: 4,
  };
  
  // Get sender data from users map if available
  const senderData = usersMap && message.senderId ? usersMap[message.senderId] : null;

  return (
    <div style={rowStyle}>
      <MessageBubble
        message={message}
        currentUserId={currentUserId}
        senderData={senderData}
        onReply={onReplyToMessage}
      />
    </div>
  );
};

/**
 * MessageList component with virtualization
 * @param {Array} messages - Array of message objects to display
 * @param {string} currentUserId - Current user's ID
 * @param {Object} usersMap - Map of user IDs to user data objects
 * @param {Function} onReplyToMessage - Callback for replying to a message
 * @param {boolean} isLoading - Whether messages are loading
 * @param {string} emptyStateMessage - Message to show when no messages exist
 */
const MessageList = ({
  messages = [],
  currentUserId,
  usersMap = {},
  onReplyToMessage,
  isLoading = false,
  emptyStateMessage = "No messages yet. Start a conversation!",
  typingUsers = []
}) => {
  const listRef = useRef();
  const sizeMap = useRef({});
  
  // Function to get message height (memoized for each message)
  const getMessageHeight = (index) => {
    const message = messages[index];
    if (!message) return 0;
    
    // Use cached height if available, or estimate a new one
    if (!sizeMap.current[message.id]) {
      sizeMap.current[message.id] = estimateMessageHeight(message);
    }
    
    return sizeMap.current[message.id];
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, "end");
    }
  }, [messages.length]);
  
  // Reset size cache when messages change completely
  useEffect(() => {
    sizeMap.current = {};
  }, [messages]);
  
  // Render empty state when no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="messages-empty-state">
        <div className="empty-state-message">{emptyStateMessage}</div>
      </div>
    );
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="messages-loading-state">
        <div className="loading-indicator">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>Loading messages...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="messages-list-container">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={getMessageHeight}
            itemData={{
              messages,
              currentUserId,
              usersMap,
              onReplyToMessage
            }}
          >
            {MessageRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default MessageList;
