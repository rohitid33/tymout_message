/**
 * User Profile Preview Component
 * 
 * A component for displaying a condensed preview of a user profile
 * in join request contexts.
 */

import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/JoinRequests.css';

const UserProfilePreview = ({ user, onClick, compact = false }) => {
  // Generate initials from user name as fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // If in compact mode, return a simplified version
  if (compact) {
    return (
      <div 
        className="user-profile-preview-compact" 
        onClick={onClick}
        data-testid="user-profile-preview-compact"
      >
        <div className="user-avatar">
          {user.userAvatar ? (
            <img src={user.userAvatar} alt={`${user.userName}'s avatar`} />
          ) : (
            <div className="avatar-initials">{getInitials(user.userName)}</div>
          )}
        </div>
        <div className="user-name">{user.userName}</div>
      </div>
    );
  }

  return (
    <div 
      className="user-profile-preview" 
      onClick={onClick}
      data-testid="user-profile-preview"
    >
      <div className="user-avatar">
        {user.userAvatar ? (
          <img src={user.userAvatar} alt={`${user.userName}'s avatar`} />
        ) : (
          <div className="avatar-initials">{getInitials(user.userName)}</div>
        )}
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.userName}</h3>
        {user.userRole && <div className="user-role">{user.userRole}</div>}
        
        {user.userBio && (
          <p className="user-bio">{user.userBio}</p>
        )}
        
        <div className="user-meta">
          {user.joinDate && (
            <span className="join-date">Member since: {new Date(user.joinDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfilePreview.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    userRole: PropTypes.string,
    userBio: PropTypes.string,
    joinDate: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  compact: PropTypes.bool
};

export default UserProfilePreview;
