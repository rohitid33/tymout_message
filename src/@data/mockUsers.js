/**
 * Mock Users Data
 * 
 * Contains sample user data for development and testing of
 * messaging UI components.
 */

// Sample users with IDs, names and avatar information
export const mockUsers = [
  {
    id: 'user123',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=user123',
    isAdmin: true,
    status: 'active'
  },
  {
    id: 'user456',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?u=user456',
    isAdmin: false,
    status: 'active'
  },
  {
    id: 'user789',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?u=user789',
    isAdmin: false,
    status: 'active'
  },
  {
    id: 'user101',
    name: 'Emma Watson',
    avatar: 'https://i.pravatar.cc/150?u=user101',
    isAdmin: false,
    status: 'active'
  },
  {
    id: 'user202',
    name: 'James Rodriguez',
    avatar: null, // Will use initial avatar
    isAdmin: false,
    status: 'inactive'
  }
];

// Mapping of user roles for reference
export const userRoles = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest'
};

// Mapping of user statuses for reference
export const userStatuses = {
  ACTIVE: 'active',
  AWAY: 'away',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
};
