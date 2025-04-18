/**
 * Empty Thread Component
 * 
 * Displays when a thread exists but has no messages yet.
 * Encourages the user to start the conversation.
 */

import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import '../../../styles/EmptyStates.css';

const EmptyThread = ({ threadName, isReadOnly, chatMode }) => {
  return (
    <div className="empty-state-container thread" data-testid="empty-thread">
      <div className="empty-state-icon">
        <FiMessageCircle size={48} />
      </div>
      
      <h2 className="empty-state-title">No messages yet</h2>
      
      <p className="empty-state-description">
        {isReadOnly ? (
          "This thread doesn't have any messages and is now read-only."
        ) : chatMode === 'announcements-only' ? (
          "This is an announcements-only thread. Only admins can post messages that everyone can see."
        ) : (
          "Be the first to start the conversation! Type a message below to get started."
        )}
      </p>
      
      {chatMode === 'announcements-only' && !isReadOnly && (
        <div className="empty-state-info">
          <h3>About Announcements-Only Mode</h3>
          <p>
            In this mode, only admins can post messages that everyone can see.
            Regular members can send private messages to admins.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyThread;
