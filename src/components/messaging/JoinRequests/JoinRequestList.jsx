/**
 * Join Request List Component (Admin View)
 * 
 * A component displaying a list of join requests for a chat with functionality
 * to review, approve, or reject requests.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JoinRequestItem from './JoinRequestItem';
import { useQueryClient } from '@tanstack/react-query';
import '../../styles/JoinRequests.css';

const JoinRequestList = ({ 
  requests, 
  onAccept, 
  onReject, 
  onSendReply, 
  isLoading,
  currentUser,
  emptyMessage = "No pending join requests"
}) => {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();
  
  // Filter requests based on selected filter
  const getFilteredRequests = () => {
    if (filter === 'all') return requests;
    return requests.filter(req => req.status === filter);
  };
  
  // Get counts for the filter badges
  const getCounts = () => {
    const counts = {
      all: requests.length,
      pending: requests.filter(req => req.status === 'pending').length,
      approved: requests.filter(req => req.status === 'approved').length,
      rejected: requests.filter(req => req.status === 'rejected').length
    };
    return counts;
  };
  
  const counts = getCounts();
  const filteredRequests = getFilteredRequests();

  // Handle accepting a request
  const handleAccept = async (requestId) => {
    await onAccept(requestId);
    // Invalidate the requests query to refetch data
    queryClient.invalidateQueries('joinRequests');
  };

  // Handle rejecting a request
  const handleReject = async (requestId) => {
    await onReject(requestId);
    // Invalidate the requests query to refetch data
    queryClient.invalidateQueries('joinRequests');
  };

  // Handle sending a reply
  const handleSendReply = async (requestId, message) => {
    await onSendReply(requestId, message);
    // Invalidate the requests query to refetch data
    queryClient.invalidateQueries('joinRequests');
  };

  return (
    <div className="join-request-list" data-testid="join-request-list">
      <div className="request-list-header">
        <h3>Join Requests</h3>
        <div className="request-filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            data-testid="filter-all"
          >
            All <span className="count">{counts.all}</span>
          </button>
          <button 
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
            data-testid="filter-pending"
          >
            Pending <span className="count">{counts.pending}</span>
          </button>
          <button 
            className={`filter-button ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
            data-testid="filter-approved"
          >
            Approved <span className="count">{counts.approved}</span>
          </button>
          <button 
            className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
            data-testid="filter-rejected"
          >
            Rejected <span className="count">{counts.rejected}</span>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-state" data-testid="loading-state">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">{emptyMessage}</div>
      ) : (
        <div className="request-items">
          {filteredRequests.map(request => (
            <JoinRequestItem
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
              onSendReply={handleSendReply}
              currentUser={currentUser}
              isExpanded={filter !== 'all' && filteredRequests.length === 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

JoinRequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onSendReply: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired
  }),
  emptyMessage: PropTypes.string
};

export default JoinRequestList;
