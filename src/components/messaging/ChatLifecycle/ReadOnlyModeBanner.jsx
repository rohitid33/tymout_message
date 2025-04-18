/**
 * Read-Only Mode Banner
 * 
 * A component that displays a banner when a chat is in read-only mode,
 * informing users that they can no longer send messages.
 */

import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ChatLifecycle.css';

const ReadOnlyModeBanner = ({ visible, message }) => {
  if (!visible) return null;
  
  return (
    <div className="read-only-banner" data-testid="read-only-banner">
      <span className="read-only-icon">🔒</span>
      <span className="read-only-message">
        {message || 'This chat is now in read-only mode. You cannot send new messages.'}
      </span>
    </div>
  );
};

ReadOnlyModeBanner.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string
};

export default ReadOnlyModeBanner;
