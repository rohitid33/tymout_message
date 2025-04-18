/**
 * Mock Data for Chat Container Components
 * 
 * Following Global Development Rule #1:
 * "Store all mock data in the @data directory to improve maintainability and reusability."
 *
 * This file has been structured to match the exact API response structure
 * to prevent discrepancies between testing and production environments.
 */

/**
 * API Response Structure Reference:
 * GET /api/messages/threads
 * {
 *   data: ThreadData[],
 *   meta: { total: number, page: number, limit: number }
 * }
 *
 * ThreadData Structure:
 * {
 *   id: string,
 *   name: string,
 *   type: string,
 *   chatMode: "group-chat" | "announcements-only",
 *   status: "active" | "read-only" | "closed",
 *   metadata: { eventId?: string, createdBy: string },
 *   closingTime: ISO string,
 *   memberCount: number,
 *   lastActivity: ISO string,
 *   createdAt: ISO string,
 *   updatedAt: ISO string
 * }
 */

// Generates a fixed date for testing to ensure consistency
const getFixedDate = (offsetHours) => {
  const baseDate = new Date('2025-04-14T12:00:00Z');
  return new Date(baseDate.getTime() + offsetHours * 60 * 60 * 1000).toISOString();
};

// Mock thread data matching API structure
export const mockThreads = [
  {
    id: "thread-1",
    name: "Project Tymout Discussion",
    type: "event",
    chatMode: "group-chat",
    status: "active",
    metadata: { 
      eventId: "event-123", 
      createdBy: "user-1" 
    },
    isReadOnly: false, // Client-side computed property
    closingTime: getFixedDate(24), // 24 hours from base
    memberCount: 8,
    lastActivity: getFixedDate(-1), // 1 hour ago
    createdAt: getFixedDate(-48), // 2 days ago
    updatedAt: getFixedDate(-1) // 1 hour ago
  },
  {
    id: "thread-2",
    name: "Engineering Team Announcements",
    type: "team",
    chatMode: "announcements-only",
    status: "active",
    metadata: { 
      departmentId: "eng-123", 
      createdBy: "user-4" 
    },
    isReadOnly: false, // Client-side computed property
    closingTime: getFixedDate(72), // 72 hours from base
    memberCount: 15,
    lastActivity: getFixedDate(-2), // 2 hours ago
    createdAt: getFixedDate(-120), // 5 days ago
    updatedAt: getFixedDate(-2) // 2 hours ago
  },
  {
    id: "thread-3",
    name: "UI Component Review",
    type: "task",
    chatMode: "group-chat",
    status: "read-only",
    metadata: { 
      taskId: "task-789", 
      createdBy: "user-3" 
    },
    isReadOnly: true, // Client-side computed property
    closingTime: getFixedDate(-12), // 12 hours before base (expired)
    memberCount: 5,
    lastActivity: getFixedDate(-16), // 16 hours ago
    createdAt: getFixedDate(-96), // 4 days ago
    updatedAt: getFixedDate(-16) // 16 hours ago
  }
];

/**
 * API Response Structure Reference:
 * GET /api/messages/threads/{threadId}/members
 * {
 *   data: MemberData[],
 *   meta: { total: number }
 * }
 *
 * MemberData Structure:
 * {
 *   id: string,
 *   userId: string,
 *   threadId: string,
 *   role: "admin" | "member",
 *   joinedAt: ISO string,
 *   user: {
 *     id: string,
 *     name: string,
 *     username: string,
 *     avatar: string | null,
 *     status: "online" | "offline" | "away",
 *     lastActive: ISO string
 *   }
 * }
 */

// Mock members data matching API structure
export const mockMembers = {
  "thread-1": [
    {
      id: "member-101", // membership id
      userId: "user-1",
      threadId: "thread-1",
      role: "admin",
      joinedAt: getFixedDate(-48),
      user: {
        id: "user-1",
        name: "Jane Smith",
        username: "janesmith",
        avatar: null,
        status: "online",
        lastActive: getFixedDate(0)
      },
      // Client-side computed properties for backward compatibility
      isAdmin: true,
      isOnline: true,
      lastActive: getFixedDate(0)
    },
    {
      id: "member-102",
      userId: "user-2",
      threadId: "thread-1",
      role: "member",
      joinedAt: getFixedDate(-47),
      user: {
        id: "user-2",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "online",
        lastActive: getFixedDate(0)
      },
      // Client-side computed properties for backward compatibility
      isAdmin: false,
      isOnline: true,
      lastActive: getFixedDate(0)
    },
    {
      id: "member-103",
      userId: "user-3",
      threadId: "thread-1",
      role: "member",
      joinedAt: getFixedDate(-46),
      user: {
        id: "user-3",
        name: "Alex Johnson",
        username: "alexj",
        avatar: null,
        status: "offline",
        lastActive: getFixedDate(-2) // 2 hours ago
      },
      // Client-side computed properties for backward compatibility
      isAdmin: false,
      isOnline: false,
      lastActive: getFixedDate(-2) // 2 hours ago
    },
    {
      id: "member-104",
      userId: "user-4",
      threadId: "thread-1",
      role: "admin",
      joinedAt: getFixedDate(-45),
      user: {
        id: "user-4",
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        status: "offline",
        lastActive: getFixedDate(-0.5) // 30 minutes ago
      },
      // Client-side computed properties for backward compatibility
      isAdmin: true,
      isOnline: false,
      lastActive: getFixedDate(-0.5) // 30 minutes ago
    },
    {
      id: "user-5",
      name: "Michael Brown",
      username: "mikeb",
      avatar: null,
      isAdmin: false,
      isOnline: false,
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    {
      id: "user-6",
      name: "Emily Davis",
      username: "emilyd",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      isAdmin: false,
      isOnline: true,
      lastActive: new Date().toISOString()
    },
    {
      id: "user-7",
      name: "Robert Wilson",
      username: "robertw",
      avatar: null,
      isAdmin: false,
      isOnline: true,
      lastActive: new Date().toISOString()
    },
    {
      id: "user-8",
      name: "Lisa Martinez",
      username: "lisam",
      avatar: null,
      isAdmin: false,
      isOnline: false,
      lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    }
  ],
  "thread-2": [
    // 15 members for thread-2
    // (abbreviated for clarity, would include similar user objects)
  ],
  "thread-3": [
    // 5 members for thread-3
    // (abbreviated for clarity, would include similar user objects)
  ]
};

// Mock thread status information
export const mockThreadStatusInfo = {
  "thread-1": {
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    eventEndTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isPrivate: false,
    timeExtensions: [
      {
        extendedBy: "user-1",
        extendedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        hoursAdded: 24
      }
    ]
  },
  "thread-2": {
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    eventEndTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
    isPrivate: true,
    timeExtensions: [
      {
        extendedBy: "user-4",
        extendedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 72 hours ago
        hoursAdded: 48
      },
      {
        extendedBy: "user-1",
        extendedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
        hoursAdded: 72
      }
    ]
  },
  "thread-3": {
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    eventEndTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    isPrivate: false,
    timeExtensions: [] // No extensions for this thread
  }
};
