/**
 * Member List Component
 * 
 * Displays a list of chat members with their online/offline status
 * and admin badges. Supports filtering and searching.
 * Mobile-first responsive design.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiUser, FiUsers, FiShield, FiMoreVertical, FiAlertCircle } from 'react-icons/fi';
import { useThreadMembers, useRemoveMember } from '../../hooks/queries/useMessagingQueries';

const MemberList = ({
  threadId,
  isAdmin = false,
  currentUserId,
  onViewProfile = null,
  testMembers = null // Add testMembers parameter with null default
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Always call hooks at the top level, never conditionally
  const { 
    data: fetchedMembers = [], 
    isLoading: apiIsLoading, 
    isError: apiIsError,
    error: apiError
  } = useThreadMembers(threadId, { 
    // Only enable the API call if we don't have test data
    enabled: !testMembers, 
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Error fetching members:', error);
      setErrorMessage('Unable to load members. Please try again later.');
    }
  });
  
  // Set error message when API errors occur
  useEffect(() => {
    if (apiIsError && !testMembers) {
      setErrorMessage('Unable to load members. Please try again later.');
    } else {
      setErrorMessage('');
    }
  }, [apiIsError, testMembers]);

  // Use either test data or fetched data
  // Always prioritize test data, especially in test environments
  const members = testMembers || fetchedMembers;
  const isLoading = !testMembers && apiIsLoading;
  const isError = !testMembers && apiIsError;
  
  // For removing members (admin only)
  const removeMemberMutation = useRemoveMember();
  
  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    
    return members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);
  
  // Sort members: admins first, then online users, then alphabetical
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      // Current user always first
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      
      // Admins second
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      
      // Online users third
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      
      // Then alphabetical by name
      return a.name.localeCompare(b.name);
    });
  }, [filteredMembers, currentUserId]);
  
  // Request confirmation for member removal
  const requestRemoveMember = (memberId) => {
    if (!isAdmin) return;
    
    // Validate that the member exists
    const memberExists = members.some(member => member.id === memberId);
    if (!memberExists) {
      console.error(`Member with ID ${memberId} not found`); 
      setErrorMessage('Member not found');
      return;
    }
    
    // Show confirmation dialog
    setMemberToRemove(memberId);
    setShowConfirmDialog(true);
    setShowDropdown(null);
  };
  
  // Handle confirmed member removal
  const handleRemoveMember = () => {
    if (!isAdmin || !memberToRemove) return;
    
    // If using test data, don't make actual API calls
    if (testMembers) {
      console.log(`Test Mode: Would remove member ${memberToRemove} from thread ${threadId}`);
      setShowConfirmDialog(false);
      setMemberToRemove(null);
      return;
    }
    
    // Only call the API if we're not in test mode
    removeMemberMutation.mutate({
      threadId,
      memberId: memberToRemove
    }, {
      onSuccess: () => {
        setShowConfirmDialog(false);
        setMemberToRemove(null);
      },
      onError: (error) => {
        console.error('Error removing member:', error);
        setErrorMessage('Failed to remove member. Please try again.');
        setShowConfirmDialog(false);
        setMemberToRemove(null);
      }
    });
  };
  
  // Cancel member removal
  const cancelRemoveMember = () => {
    setShowConfirmDialog(false);
    setMemberToRemove(null);
  };
  
  // Toggle member dropdown menu
  const toggleDropdown = (memberId) => {
    setShowDropdown(showDropdown === memberId ? null : memberId);
  };
  
  // Generate user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return <div className="member-list-loading">Loading members...</div>;
  }
  
  if (isError) {
    return (
      <div className="member-list-error">
        <FiAlertCircle className="error-icon" />
        <p>{errorMessage || 'Error loading members'}</p>
        {!testMembers && (
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="member-list-container">
      <div className="member-list-header">
        <div className="member-count">
          <FiUsers className="member-icon" />
          <span>{members.length} Members</span>
        </div>
        
        <div className="member-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for members"
          />
        </div>
      </div>
      
      <div className="member-list" style={{
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '5px'
      }}>
        {sortedMembers.length === 0 ? (
          <div className="no-members">
            {searchTerm ? 'No members match your search' : 'No members found'}
          </div>
        ) : (
          sortedMembers.map(member => (
            <div 
              key={member.id} 
              className={`member-item ${member.isOnline ? 'online' : 'offline'} ${member.id === currentUserId ? 'current-user' : ''}`}
            >
              <div className="member-avatar">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={`${member.name}'s avatar`}
                    className="avatar"
                  />
                ) : (
                  <div className="avatar-fallback">
                    {getUserInitials(member.name)}
                  </div>
                )}
                <span className={`status-indicator ${member.isOnline ? 'online' : 'offline'}`} />
              </div>
              
              <div className="member-info" onClick={() => onViewProfile && onViewProfile(member.id)}>
                <div className="member-name">
                  {member.name}
                  {member.isAdmin && (
                    <span className="admin-badge" title="Administrator">
                      <FiShield />
                    </span>
                  )}
                </div>
                <div className="member-username">@{member.username}</div>
              </div>
              
              {isAdmin && member.id !== currentUserId && (
                <div className="member-actions">
                  <button 
                    className="action-button"
                    onClick={() => toggleDropdown(member.id)}
                    aria-label="Member options"
                  >
                    <FiMoreVertical />
                  </button>
                  
                  {showDropdown === member.id && (
                    <div className="member-dropdown">
                      <button 
                        onClick={() => requestRemoveMember(member.id)}
                        className="remove-member"
                      >
                        Remove from chat
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h4>Remove Member</h4>
            <p>Are you sure you want to remove this member from the chat?</p>
            <p>This action cannot be undone.</p>
            
            <div className="confirmation-buttons">
              <button 
                className="cancel-button"
                onClick={cancelRemoveMember}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleRemoveMember}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message Toast */}
      {errorMessage && (
        <div className="error-toast">
          <FiAlertCircle />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')}>×</button>
        </div>
      )}
    </div>
  );
};

export default MemberList;
