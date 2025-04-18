/**
 * Chat Deactivation Countdown
 * 
 * A component that displays a countdown timer showing the time remaining
 * before a chat is automatically deactivated.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useChatLifecycleStore from '../../../stores/useChatLifecycleStore';
import '../../styles/ChatLifecycle.css';

const ChatDeactivationCountdown = ({ chatId, onWarningStart, onDeactivation }) => {
  // Get time remaining from the store
  const { getTimeRemaining, isInWarningPeriod, setWarning } = useChatLifecycleStore();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(chatId));
  
  // Update the countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(chatId);
      setTimeLeft(remaining);
      
      // Check if we've entered the warning period
      if (isInWarningPeriod(chatId)) {
        setWarning(chatId, true);
        onWarningStart?.(chatId);
      }
      
      // Check if the chat has expired
      if (remaining?.expired) {
        clearInterval(interval);
        onDeactivation?.(chatId);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [chatId, getTimeRemaining, isInWarningPeriod, onDeactivation, onWarningStart, setWarning]);
  
  // If no time data is available, don't render anything
  if (!timeLeft) return null;
  
  // If chat has already expired, show archived message
  if (timeLeft.expired) {
    return (
      <div className="chat-deactivation-countdown expired" data-testid="chat-countdown-expired">
        <span className="countdown-icon">🔒</span>
        This chat has been archived
      </div>
    );
  }
  
  // Format the time for display
  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    } else {
      return `${seconds}s remaining`;
    }
  };
  
  // Display the time remaining
  const { hours, minutes, seconds } = timeLeft;
  const timeString = formatTime(hours, minutes, seconds);
  
  // Determine class based on time remaining
  const isWarning = hours === 0 && minutes < 10;
  const countdownClass = isWarning ? 'warning' : '';
  
  return (
    <div 
      className={`chat-deactivation-countdown ${countdownClass}`}
      data-testid="chat-countdown"
    >
      <span className="countdown-icon">⏱️</span>
      <span className="countdown-text">{timeString}</span>
    </div>
  );
};

ChatDeactivationCountdown.propTypes = {
  chatId: PropTypes.string.isRequired,
  onWarningStart: PropTypes.func,
  onDeactivation: PropTypes.func
};

export default ChatDeactivationCountdown;
