/**
 * Thread Not Found Component
 * 
 * Displays when a user attempts to access a thread that doesn't exist
 * or that they don't have access to.
 */

import React from 'react';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { createAccessibleClickProps } from '../../../utils/accessibility';
import '../../../styles/EmptyStates.css';

const ThreadNotFound = ({ error, onBack }) => {
  const errorMessage = error?.message || "The thread you're looking for could not be found or you don't have access to it.";
  
  return (
    <div className="empty-state-container not-found" data-testid="thread-not-found">
      <div className="empty-state-icon error">
        <FiAlertCircle size={48} />
      </div>
      
      <h2 className="empty-state-title">Thread Not Found</h2>
      
      <p className="empty-state-description">
        {errorMessage}
      </p>
      
      <button 
        className="empty-state-action"
        onClick={onBack}
        {...createAccessibleClickProps(onBack)}
      >
        <FiArrowLeft aria-hidden="true" />
        Back to messages
      </button>
    </div>
  );
};

export default ThreadNotFound;
