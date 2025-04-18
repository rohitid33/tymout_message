// Mock data for chat detail pages, messages, and members
export const mockMessages = {
  'thread-1': [
    { id: 'msg-1', threadId: 'thread-1', sender: { id: 'user-1', name: 'Alice', avatar: '' }, content: 'Welcome to the Table chat!', timestamp: '2025-04-15T05:00:00+05:30' },
    { id: 'msg-2', threadId: 'thread-1', sender: { id: 'user-2', name: 'Bob', avatar: '' }, content: 'Thanks, Alice!', timestamp: '2025-04-15T05:01:00+05:30' }
  ],
  'thread-2': [
    { id: 'msg-3', threadId: 'thread-2', sender: { id: 'user-3', name: 'Carol', avatar: '' }, content: 'Circle chat started.', timestamp: '2025-04-15T05:10:00+05:30' }
  ]
};

export const mockMembers = {
  'thread-1': [
    { id: 'user-1', name: 'Alice', avatar: '', isAdmin: true },
    { id: 'user-2', name: 'Bob', avatar: '', isAdmin: false }
  ],
  'thread-2': [
    { id: 'user-3', name: 'Carol', avatar: '', isAdmin: true },
    { id: 'user-4', name: 'Dave', avatar: '', isAdmin: false }
  ]
};

export const mockThreadDetails = {
  'thread-1': {
    id: 'thread-1',
    name: 'Table Chat',
    type: 'table',
    status: 'active',
    memberCount: 2,
    chatMode: 'group',
    lastActivity: '2025-04-15T05:01:00+05:30',
    members: [
      { id: 'user-1', name: 'Alice', avatar: '', isAdmin: true },
      { id: 'user-2', name: 'Bob', avatar: '', isAdmin: false }
    ]
  },
  'thread-2': {
    id: 'thread-2',
    name: 'Circle Chat',
    type: 'circle',
    status: 'read-only',
    memberCount: 2,
    chatMode: 'announcements-only',
    lastActivity: '2025-04-15T05:10:00+05:30',
    members: [
      { id: 'user-3', name: 'Carol', avatar: '', isAdmin: true },
      { id: 'user-4', name: 'Dave', avatar: '', isAdmin: false }
    ]
  }
};
