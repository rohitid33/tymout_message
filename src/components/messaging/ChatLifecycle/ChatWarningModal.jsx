/**
 * Chat Warning Modal
 * 
 * A modal component that displays a warning when a chat is about to be deactivated,
 * allowing admins to extend the chat time.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useChatLifecycleStore from '../../../stores/useChatLifecycleStore';
import '../../styles/ChatLifecycle.css';

const ChatWarningModal = ({ chatId, visible, onClose, onExtend }) => {
  const [isExtending, setIsExtending] = useState(false);
  const { getTimeRemaining, extendChat } = useChatLifecycleStore();
  const timeLeft = getTimeRemaining(chatId);
  
  if (!visible || !timeLeft) return null;
  
  const { minutes, seconds } = timeLeft;
  
  // Handle extending the chat
  const handleExtend = async () => {
    setIsExtending(true);
    try {
      const newClosingTime = extendChat(chatId);
      onExtend?.(chatId, newClosingTime);
      onClose?.();
    } catch (error) {
      console.error('Error extending chat:', error);
    } finally {
      setIsExtending(false);
    }
  };
  
  return (
    <div className="chat-warning-modal-overlay" data-testid="chat-warning-modal">
      <div className="chat-warning-modal">
        <div className="warning-header">
          <span className="warning-icon">⚠️</span>
          <h3>Chat Closing Soon</h3>
        </div>
        
        <div className="warning-content">
          <p>
            This chat will be automatically archived in{' '}
            <strong>{minutes} minutes and {seconds} seconds</strong>.
          </p>
          <p>
            After archiving, the chat will be in read-only mode and no new messages can be sent.
          </p>
        </div>
        
        <div className="warning-actions">
          <button 
            className="warning-button secondary"
            onClick={onClose}
            data-testid="warning-dismiss-button"
          >
            Dismiss
          </button>
          <button 
            className="warning-button primary"
            onClick={handleExtend}
            disabled={isExtending}
            data-testid="warning-extend-button"
          >
            {isExtending ? 'Extending...' : 'Extend by 6 hours'}
          </button>
        </div>
      </div>
    </div>
  );
};

ChatWarningModal.propTypes = {
  chatId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onExtend: PropTypes.func
};

export default ChatWarningModal;
