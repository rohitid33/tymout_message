/**
 * Join Request Item Component
 * 
 * A component for displaying an individual join request with options
 * to view details, accept, or reject the request.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserProfilePreview from './UserProfilePreview';
import RequestConversation from './RequestConversation';
import '../../styles/JoinRequests.css';

const JoinRequestItem = ({ 
  request, 
  onAccept, 
  onReject, 
  onSendReply, 
  currentUser,
  isExpanded = false
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge styling based on request status
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle accept request
  const handleAccept = async () => {
    try {
      setIsLoading(true);
      await onAccept(request.id);
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject request
  const handleReject = async () => {
    try {
      setIsLoading(true);
      await onReject(request.id);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a reply in the conversation
  const handleSendReply = async (message) => {
    try {
      await onSendReply(request.id, message);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="join-request-item" data-testid="join-request-item">
      <div 
        className="request-header" 
        onClick={() => setExpanded(!expanded)}
        data-testid="request-header"
      >
        <UserProfilePreview user={{
          userId: request.userId,
          userName: request.userName,
          userAvatar: request.userAvatar
        }} compact={true} />
        
        <div className="request-meta">
          <span className="request-date">{formatDate(request.createdAt)}</span>
          {getStatusBadge(request.status)}
        </div>
        
        <button 
          className="expand-button"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse request details" : "Expand request details"}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      
      {expanded && (
        <div className="request-details">
          <div className="request-message">
            <h4>Request Message:</h4>
            <p>{request.message}</p>
          </div>
          
          <div className="request-conversation-container">
            <h4>Conversation:</h4>
            <RequestConversation 
              conversation={request.conversation} 
              onSendReply={handleSendReply}
              currentUser={currentUser}
            />
          </div>
          
          {request.status === 'pending' && (
            <div className="request-actions">
              <button 
                className="action-button reject"
                onClick={handleReject}
                disabled={isLoading}
                data-testid="reject-button"
              >
                Reject
              </button>
              <button 
                className="action-button accept"
                onClick={handleAccept}
                disabled={isLoading}
                data-testid="accept-button"
              >
                {isLoading ? 'Processing...' : 'Accept'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

JoinRequestItem.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    chatId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    conversation: PropTypes.array.isRequired
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onSendReply: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired
  }),
  isExpanded: PropTypes.bool
};

export default JoinRequestItem;
