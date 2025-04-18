/**
 * Mock Messages Data
 * 
 * This file contains mock data for development purposes.
 * Following project standards, all mock data is stored in the @data directory.
 */

const mockUsers = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isAdmin: true,
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Sam Wilson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isAdmin: false,
    status: 'online'
  },
  {
    id: 'user3',
    name: 'Morgan Lee',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isAdmin: false,
    status: 'offline'
  },
  {
    id: 'user4',
    name: 'Taylor Smith',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isAdmin: false,
    status: 'online'
  },
  {
    id: 'user5',
    name: 'Jamie Doe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isAdmin: false,
    status: 'offline'
  }
];

const mockThreads = [
  {
    id: 'thread1',
    type: 'table',
    title: 'Coffee Shop Gathering',
    state: 'active',
    mode: 'group-chat',
    members: ['user1', 'user2', 'user3', 'user4'],
    eventDetails: {
      date: '2025-04-20T14:00:00Z',
      endTime: '2025-04-20T16:00:00Z',
      location: 'Central Coffee Shop',
      description: 'Casual coffee meetup'
    },
    lastMessage: {
      content: 'Looking forward to meeting everyone!',
      sender: 'user2',
      timestamp: '2025-04-18T10:00:00Z'
    },
    unreadCount: 2
  },
  // ... (rest of the mockThreads array)
];

const mockMessages = {
  thread1: [
    {
      id: 'msg1_1',
      threadId: 'thread1',
      sender: 'user2',
      content: 'Looking forward to meeting everyone!',
      timestamp: '2025-04-18T10:00:00Z',
      status: 'delivered'
    },
    // ... (rest of the mockMessages.thread1 array)
  ],
  // ... (other threads)
};

const mockJoinRequests = [
  {
    id: 'req1',
    userId: 'user5',
    threadId: 'thread1',
    status: 'pending',
    requestedAt: '2025-04-17T09:00:00Z'
  },
  // ... (rest of the mockJoinRequests array)
];

export { mockUsers, mockThreads, mockMessages, mockJoinRequests };
