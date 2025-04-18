/**
 * Empty Thread List Component
 * 
 * Displays when a user has no message threads.
 * Provides a welcoming experience and guidance on how to start messaging.
 */

import React from 'react';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { createAccessibleClickProps } from '../../../utils/accessibility';
import '../../../styles/EmptyStates.css';

const EmptyThreadList = ({ onCreateNew }) => {
  return (
    <div className="empty-state-container" data-testid="empty-thread-list">
      <div className="empty-state-icon">
        <FiMessageSquare size={48} />
      </div>
      
      <h2 className="empty-state-title">No messages yet</h2>
      
      <p className="empty-state-description">
        You don't have any message threads. Start a new conversation to connect with teammates.
      </p>
      
      <button 
        className="empty-state-action"
        onClick={onCreateNew}
        {...createAccessibleClickProps(onCreateNew)}
      >
        Start a new conversation
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
};

export default EmptyThreadList;
