/**
 * Chat Mode Banner Component
 * 
 * Displays the current chat mode (Group Chat/Announcements Only)
 * and countdown timer for chat closing.
 * Mobile-responsive with clear visual indicators.
 */

import React, { useState, useEffect } from 'react';
import { FiInfo, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi';

const ChatModeBanner = ({ 
  chatMode = 'group-chat', // 'group-chat' or 'announcements-only'
  closingTime = null // ISO string of when the chat will close
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Format the chat mode for display
  const formattedChatMode = chatMode === 'group-chat' 
    ? 'Group Chat' 
    : 'Announcements Only';
  
  // Update countdown timer with timezone and error handling
  useEffect(() => {
    if (!closingTime) {
      setIsLoading(false);
      return;
    }
    
    // Initialize with loading state
    setIsLoading(true);
    setHasError(false);
    
    const calculateTimeRemaining = () => {
      try {
        // Use Date.now() for consistent timezone handling
        const now = Date.now();
        const closeDate = new Date(closingTime);
        
        // Check if date is valid
        if (isNaN(closeDate.getTime())) {
          console.error('Invalid closing time format:', closingTime);
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        const closeTime = closeDate.getTime();
        const diffMs = closeTime - now;
        
        // No longer loading after first calculation
        setIsLoading(false);
        
        if (diffMs <= 0) {
          setTimeRemaining('Closed');
          return;
        }
        
        // Format the remaining time
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 24) {
          const days = Math.floor(diffHours / 24);
          setTimeRemaining(`${days}d ${diffHours % 24}h remaining`);
        } else if (diffHours > 0) {
          setTimeRemaining(`${diffHours}h ${diffMinutes}m remaining`);
        } else {
          setTimeRemaining(`${diffMinutes}m remaining`);
        }
      } catch (error) {
        console.error('Error calculating time remaining:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    // Calculate immediately
    calculateTimeRemaining();
    
    // Set interval to update every minute
    const interval = setInterval(calculateTimeRemaining, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [closingTime]);
  
  // Time extension functionality removed as requested
  
  return (
    <div className="chat-mode-banner">
      <div className="mode-indicator">
        <FiInfo className="mode-icon" />
        <span className="mode-text">{formattedChatMode}</span>
      </div>
      
      {closingTime && (
        <div className="timer-container">
          <FiClock className="timer-icon" />
          {isLoading ? (
            <div className="loading-state">
              <span className="loading-icon">⏱️</span>
              <span>Loading time information...</span>
            </div>
          ) : hasError ? (
            <div className="error-state">
              <FiAlertCircle className="error-icon" />
              <span>Invalid closing time</span>
            </div>
          ) : (
            <span className="timer-text">{timeRemaining}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatModeBanner;
