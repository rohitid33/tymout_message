/**
 * Request Conversation Component
 * 
 * A threaded conversation UI for join request discussions between
 * admins and requesters.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import UserProfilePreview from './UserProfilePreview';
import '../../styles/JoinRequests.css';

const RequestConversation = ({ conversation, onSendReply, currentUser }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);
  
  // Format timestamp to a readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle reply submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSendReply(message);
    setMessage('');
  };

  return (
    <div className="request-conversation" data-testid="request-conversation">
      <div className="conversation-messages">
        {conversation.map((msg) => (
          <div 
            key={msg.id} 
            className={`conversation-message ${msg.isSystem ? 'system-message' : ''} ${msg.userId === currentUser?.userId ? 'current-user' : ''}`}
          >
            {!msg.isSystem && (
              <UserProfilePreview user={msg} compact={true} />
            )}
            
            <div className="message-content">
              {msg.isSystem ? (
                <div className="system-notification">
                  <span className="system-icon">ⓘ</span>
                  {msg.message}
                </div>
              ) : (
                <p>{msg.message}</p>
              )}
              <div className="message-time">{formatTime(msg.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="conversation-reply-form" onSubmit={handleSubmit}>
        <textarea
          className="reply-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply..."
          rows={2}
          data-testid="reply-input"
        />
        <button 
          type="submit" 
          className="reply-button" 
          disabled={!message.trim()}
          data-testid="send-reply-button"
        >
          Send
        </button>
      </form>
    </div>
  );
};

RequestConversation.propTypes = {
  conversation: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      userAvatar: PropTypes.string,
      message: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      isSystem: PropTypes.bool
    })
  ).isRequired,
  onSendReply: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired
  })
};

export default RequestConversation;
