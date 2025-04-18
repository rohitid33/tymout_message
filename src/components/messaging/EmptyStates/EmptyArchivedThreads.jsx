/**
 * Empty Archived Threads Component
 * 
 * Displays when a user has no archived message threads.
 * Provides information about archiving functionality.
 */

import React from 'react';
import { FiArchive, FiInbox } from 'react-icons/fi';
import { createAccessibleClickProps } from '../../../utils/accessibility';
import '../../../styles/EmptyStates.css';

const EmptyArchivedThreads = ({ onViewActive }) => {
  return (
    <div className="empty-state-container archived" data-testid="empty-archived-threads">
      <div className="empty-state-icon">
        <FiArchive size={48} />
      </div>
      
      <h2 className="empty-state-title">No archived messages</h2>
      
      <p className="empty-state-description">
        You don't have any archived message threads. When you archive a conversation, it will appear here.
      </p>
      
      <div className="empty-state-info">
        <h3>About archiving</h3>
        <p>
          Archiving helps you organize your messages without deleting them.
          You can archive a thread from the message options menu.
        </p>
      </div>
      
      <button 
        className="empty-state-action"
        onClick={onViewActive}
        {...createAccessibleClickProps(onViewActive)}
      >
        <FiInbox aria-hidden="true" />
        View active messages
      </button>
    </div>
  );
};

export default EmptyArchivedThreads;
