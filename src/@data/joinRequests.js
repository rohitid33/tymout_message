/**
 * Mock data for join requests
 * 
 * Contains sample join requests data for development and testing
 */

export const joinRequests = [
  {
    id: 'req-001',
    chatId: 'chat-001',
    userId: 'user-001',
    userName: 'Alex Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    status: 'pending',
    message: 'I would like to join this chat for the upcoming event discussion.',
    createdAt: '2025-04-14T10:30:00Z',
    updatedAt: '2025-04-14T10:30:00Z',
    conversation: [
      {
        id: 'conv-001',
        userId: 'user-001',
        userName: 'Alex Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        message: 'I would like to join this chat for the upcoming event discussion.',
        createdAt: '2025-04-14T10:30:00Z',
        isSystem: false
      },
      {
        id: 'conv-002',
        userId: 'admin-001',
        userName: 'Sarah Admin',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        message: 'Can you please tell us a bit more about your role in the event?',
        createdAt: '2025-04-14T11:15:00Z',
        isSystem: false
      },
      {
        id: 'conv-003',
        userId: 'user-001',
        userName: 'Alex Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        message: 'I am one of the volunteer coordinators for the Saturday sessions.',
        createdAt: '2025-04-14T11:45:00Z',
        isSystem: false
      }
    ]
  },
  {
    id: 'req-002',
    chatId: 'chat-001',
    userId: 'user-002',
    userName: 'Taylor Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    status: 'pending',
    message: 'Hello, I am the marketing partner for this event.',
    createdAt: '2025-04-14T12:15:00Z',
    updatedAt: '2025-04-14T12:15:00Z',
    conversation: [
      {
        id: 'conv-004',
        userId: 'user-002',
        userName: 'Taylor Smith',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        message: 'Hello, I am the marketing partner for this event.',
        createdAt: '2025-04-14T12:15:00Z',
        isSystem: false
      }
    ]
  },
  {
    id: 'req-003',
    chatId: 'chat-001',
    userId: 'user-003',
    userName: 'Jamie Liu',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    status: 'approved',
    message: 'Hi there, I\'m the speaker for the opening keynote.',
    createdAt: '2025-04-14T09:30:00Z',
    updatedAt: '2025-04-14T10:05:00Z',
    conversation: [
      {
        id: 'conv-005',
        userId: 'user-003',
        userName: 'Jamie Liu',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        message: 'Hi there, I\'m the speaker for the opening keynote.',
        createdAt: '2025-04-14T09:30:00Z',
        isSystem: false
      },
      {
        id: 'conv-006',
        userId: 'admin-001',
        userName: 'Sarah Admin',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        message: 'Your request has been approved.',
        createdAt: '2025-04-14T10:05:00Z',
        isSystem: true
      }
    ]
  },
  {
    id: 'req-004',
    chatId: 'chat-001',
    userId: 'user-004',
    userName: 'Morgan Wright',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    status: 'rejected',
    message: 'I would like to observe the discussion for my research.',
    createdAt: '2025-04-14T08:45:00Z',
    updatedAt: '2025-04-14T09:20:00Z',
    conversation: [
      {
        id: 'conv-007',
        userId: 'user-004',
        userName: 'Morgan Wright',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        message: 'I would like to observe the discussion for my research.',
        createdAt: '2025-04-14T08:45:00Z',
        isSystem: false
      },
      {
        id: 'conv-008',
        userId: 'admin-001',
        userName: 'Sarah Admin',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        message: 'We appreciate your interest but this chat is only for event participants.',
        createdAt: '2025-04-14T09:10:00Z',
        isSystem: false
      },
      {
        id: 'conv-009',
        userId: 'admin-001',
        userName: 'Sarah Admin',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        message: 'Your request has been rejected.',
        createdAt: '2025-04-14T09:20:00Z',
        isSystem: true
      }
    ]
  }
];

export default joinRequests;
