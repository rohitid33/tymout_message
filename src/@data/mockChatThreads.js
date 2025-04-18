/**
 * Mock Chat Thread List Data
 * 
 * Following Global Development Rule #1:
 * "Store all mock data in the @data directory to improve maintainability and reusability."
 */

// Helper for consistent date generation
const getRelativeDate = (offsetHours) => {
  const baseDate = new Date('2025-04-14T12:00:00Z');
  return new Date(baseDate.getTime() + offsetHours * 60 * 60 * 1000).toISOString();
};

// Generate a standardized avatar URL
const getAvatarUrl = (userId) => {
  const id = parseInt(userId.replace('user-', ''));
  return `https://randomuser.me/api/portraits/${id % 2 === 0 ? 'men' : 'women'}/${id % 70 || 1}.jpg`;
};

/**
 * Mock thread list response matching API format
 * {
 *   data: Array of threads
 *   meta: {
 *     total: Total number of threads
 *     page: Current page number
 *     limit: Items per page
 *     pages: Total number of pages
 *   }
 * }
 */
export const mockThreadList = {
  data: [
    {
      id: "thread-1",
      name: "Project Tymout Discussion",
      type: "event",
      chatMode: "group-chat",
      status: "active",
      isArchived: false,
      hasUnread: true,
      unreadCount: 7,
      metadata: { 
        eventId: "event-123", 
        createdBy: "user-1" 
      },
      lastActivity: getRelativeDate(-1), // 1 hour ago
      lastMessage: {
        id: "msg-123",
        content: "Can we discuss the new feature requirements this week?",
        sender: {
          id: "user-3",
          name: "Alex Johnson",
          avatar: getAvatarUrl("user-3")
        },
        createdAt: getRelativeDate(-1)
      },
      memberCount: 8,
      members: [
        { id: "user-1", name: "Jane Smith", avatar: null, isOnline: true },
        { id: "user-2", name: "John Doe", avatar: getAvatarUrl("user-2"), isOnline: true },
        { id: "user-3", name: "Alex Johnson", avatar: getAvatarUrl("user-3"), isOnline: false }
      ],
      createdAt: getRelativeDate(-48), // 2 days ago
      updatedAt: getRelativeDate(-1)
    },
    {
      id: "thread-2",
      name: "Engineering Team Announcements",
      type: "team",
      chatMode: "announcements-only",
      status: "active",
      isArchived: false,
      hasUnread: true,
      unreadCount: 2,
      metadata: { 
        departmentId: "eng-123", 
        createdBy: "user-4" 
      },
      lastActivity: getRelativeDate(-2), // 2 hours ago
      lastMessage: {
        id: "msg-234",
        content: "We'll be deploying the new authentication system on Friday.",
        sender: {
          id: "user-4",
          name: "Miguel Rodriguez",
          avatar: getAvatarUrl("user-4")
        },
        createdAt: getRelativeDate(-2)
      },
      memberCount: 15,
      members: [
        { id: "user-4", name: "Miguel Rodriguez", avatar: getAvatarUrl("user-4"), isOnline: true },
        { id: "user-5", name: "Sarah Johnson", avatar: getAvatarUrl("user-5"), isOnline: false },
        { id: "user-1", name: "Jane Smith", avatar: null, isOnline: true }
      ],
      createdAt: getRelativeDate(-120), // 5 days ago
      updatedAt: getRelativeDate(-2)
    },
    {
      id: "thread-3",
      name: "UI Component Review",
      type: "task",
      chatMode: "group-chat",
      status: "read-only",
      isArchived: false,
      hasUnread: false,
      unreadCount: 0,
      metadata: { 
        taskId: "task-789", 
        createdBy: "user-3" 
      },
      lastActivity: getRelativeDate(-16), // 16 hours ago
      lastMessage: {
        id: "msg-345",
        content: "The implementation looks good, I've approved the pull request.",
        sender: {
          id: "user-3",
          name: "Alex Johnson",
          avatar: getAvatarUrl("user-3")
        },
        createdAt: getRelativeDate(-16)
      },
      memberCount: 5,
      members: [
        { id: "user-3", name: "Alex Johnson", avatar: getAvatarUrl("user-3"), isOnline: false },
        { id: "user-2", name: "John Doe", avatar: getAvatarUrl("user-2"), isOnline: true }
      ],
      createdAt: getRelativeDate(-96), // 4 days ago
      updatedAt: getRelativeDate(-16)
    },
    {
      id: "thread-4",
      name: "Marketing Campaign Planning",
      type: "project",
      chatMode: "group-chat",
      status: "active",
      isArchived: false,
      hasUnread: false,
      unreadCount: 0,
      metadata: { 
        projectId: "project-456", 
        createdBy: "user-5" 
      },
      lastActivity: getRelativeDate(-6), // 6 hours ago
      lastMessage: {
        id: "msg-456",
        content: "Let's finalize the social media calendar by EOD.",
        sender: {
          id: "user-5",
          name: "Sarah Johnson",
          avatar: getAvatarUrl("user-5")
        },
        createdAt: getRelativeDate(-6)
      },
      memberCount: 7,
      members: [
        { id: "user-5", name: "Sarah Johnson", avatar: getAvatarUrl("user-5"), isOnline: false },
        { id: "user-6", name: "David Wilson", avatar: getAvatarUrl("user-6"), isOnline: true },
        { id: "user-7", name: "Emily Chen", avatar: getAvatarUrl("user-7"), isOnline: false }
      ],
      createdAt: getRelativeDate(-72), // 3 days ago
      updatedAt: getRelativeDate(-6)
    },
    {
      id: "thread-5",
      name: "Customer Support Team",
      type: "team",
      chatMode: "group-chat",
      status: "active",
      isArchived: false,
      hasUnread: true,
      unreadCount: 12,
      metadata: { 
        departmentId: "support-123", 
        createdBy: "user-8" 
      },
      lastActivity: getRelativeDate(-0.5), // 30 minutes ago
      lastMessage: {
        id: "msg-567",
        content: "We need to address the recent spike in API errors reported by customers.",
        sender: {
          id: "user-8",
          name: "Thomas Garcia",
          avatar: getAvatarUrl("user-8")
        },
        createdAt: getRelativeDate(-0.5)
      },
      memberCount: 12,
      members: [
        { id: "user-8", name: "Thomas Garcia", avatar: getAvatarUrl("user-8"), isOnline: true },
        { id: "user-9", name: "Olivia Martinez", avatar: getAvatarUrl("user-9"), isOnline: true },
        { id: "user-10", name: "William Brown", avatar: getAvatarUrl("user-10"), isOnline: false }
      ],
      createdAt: getRelativeDate(-144), // 6 days ago
      updatedAt: getRelativeDate(-0.5)
    }
  ],
  meta: {
    total: 22, // Total threads in the system
    page: 1,   // Current page
    limit: 5,  // Items per page
    pages: 5   // Total number of pages
  }
};

/**
 * Mock thread summary with latest messages
 */
export const mockThreadSummary = {
  thread: {
    id: "thread-1",
    name: "Project Tymout Discussion",
    type: "event",
    chatMode: "group-chat",
    status: "active",
    memberCount: 8,
    metadata: { 
      eventId: "event-123", 
      createdBy: "user-1",
      eventTitle: "Quarterly Product Review",
      eventDate: getRelativeDate(48), // 2 days in future
      location: "Conference Room A"
    },
    createdAt: getRelativeDate(-48), // 2 days ago
    updatedAt: getRelativeDate(-1) // 1 hour ago
  },
  members: {
    total: 8,
    online: 3,
    admins: 2,
    preview: [
      { id: "user-1", name: "Jane Smith", avatar: null, isOnline: true, isAdmin: true },
      { id: "user-2", name: "John Doe", avatar: getAvatarUrl("user-2"), isOnline: true, isAdmin: false },
      { id: "user-3", name: "Alex Johnson", avatar: getAvatarUrl("user-3"), isOnline: false, isAdmin: false },
      { id: "user-4", name: "Miguel Rodriguez", avatar: getAvatarUrl("user-4"), isOnline: true, isAdmin: true }
    ]
  },
  messages: {
    total: 47,
    unread: 7,
    latest: [
      {
        id: "msg-123",
        content: "Can we discuss the new feature requirements this week?",
        sender: {
          id: "user-3",
          name: "Alex Johnson",
          avatar: getAvatarUrl("user-3")
        },
        createdAt: getRelativeDate(-1),
        attachments: []
      },
      {
        id: "msg-122",
        content: "I've updated the UI mockups based on yesterday's feedback.",
        sender: {
          id: "user-2",
          name: "John Doe",
          avatar: getAvatarUrl("user-2")
        },
        createdAt: getRelativeDate(-1.5),
        attachments: [
          {
            id: "att-1",
            name: "ui-mockups-v2.pdf",
            type: "application/pdf",
            size: 2457862,
            url: "#"
          }
        ]
      }
    ]
  }
};

/**
 * Mock unread count data
 */
export const mockUnreadCount = {
  total: 21,
  threads: {
    "thread-1": 7,
    "thread-2": 2,
    "thread-5": 12
  }
};

/**
 * Mock API response for empty states
 */
export const mockEmptyThreadList = {
  data: [],
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  }
};

/**
 * Mock API response for search with no results
 */
export const mockEmptySearchResults = {
  data: [],
  meta: {
    total: 0,
    query: "nonexistent query",
    page: 1,
    limit: 20,
    pages: 0
  }
};

/**
 * Empty threads list data for inactive filters
 */
export const mockArchivedThreadList = {
  data: [
    {
      id: "thread-6",
      name: "Archived Project Alpha",
      type: "project",
      chatMode: "group-chat",
      status: "read-only",
      isArchived: true,
      hasUnread: false,
      unreadCount: 0,
      metadata: { 
        projectId: "project-alpha", 
        createdBy: "user-2" 
      },
      lastActivity: getRelativeDate(-72), // 3 days ago
      lastMessage: {
        id: "msg-789",
        content: "Project has been archived. Thank you for your contributions.",
        sender: {
          id: "user-2",
          name: "John Doe",
          avatar: getAvatarUrl("user-2")
        },
        createdAt: getRelativeDate(-72)
      },
      memberCount: 12,
      members: [
        { id: "user-2", name: "John Doe", avatar: getAvatarUrl("user-2"), isOnline: true },
        { id: "user-3", name: "Alex Johnson", avatar: getAvatarUrl("user-3"), isOnline: false },
        { id: "user-5", name: "Sarah Johnson", avatar: getAvatarUrl("user-5"), isOnline: false }
      ],
      createdAt: getRelativeDate(-240), // 10 days ago
      updatedAt: getRelativeDate(-72)
    },
    {
      id: "thread-7",
      name: "Archived Marketing Campaign",
      type: "project",
      chatMode: "announcements-only",
      status: "read-only",
      isArchived: true,
      hasUnread: false,
      unreadCount: 0,
      metadata: { 
        campaignId: "campaign-22", 
        createdBy: "user-5" 
      },
      lastActivity: getRelativeDate(-120), // 5 days ago
      lastMessage: {
        id: "msg-999",
        content: "Campaign completed successfully. Final metrics report attached.",
        sender: {
          id: "user-5",
          name: "Sarah Johnson",
          avatar: getAvatarUrl("user-5")
        },
        createdAt: getRelativeDate(-120)
      },
      memberCount: 8,
      members: [
        { id: "user-5", name: "Sarah Johnson", avatar: getAvatarUrl("user-5"), isOnline: false },
        { id: "user-4", name: "Miguel Rodriguez", avatar: getAvatarUrl("user-4"), isOnline: true },
        { id: "user-1", name: "Jane Smith", avatar: null, isOnline: true }
      ],
      createdAt: getRelativeDate(-336), // 14 days ago
      updatedAt: getRelativeDate(-120)
    }
  ],
  meta: {
    total: 8, // Total archived threads
    page: 1,
    limit: 5,
    pages: 2
  }
};

/**
 * Helper function to get mock API responses with support for filtering, pagination and search
 */
export const getMockThreadList = (filter = 'active', announcementsOnly = false) => {
  // Create copies to avoid modifying the original data
  const activeThreads = JSON.parse(JSON.stringify(mockThreadList));
  const archivedThreads = JSON.parse(JSON.stringify(mockArchivedThreadList));
  
  // Modify data for announcements-only mode if requested
  if (announcementsOnly) {
    activeThreads.data.forEach(thread => {
      thread.chatMode = 'announcements-only';
    });
  }
  
  // Return appropriate data based on filter
  switch(filter) {
    case 'archived':
      return archivedThreads;
    case 'all':
      // Combine active and archived threads
      return {
        data: [...activeThreads.data, ...archivedThreads.data],
        meta: {
          total: activeThreads.meta.total + archivedThreads.meta.total,
          page: 1,
          limit: 10,
          pages: Math.ceil((activeThreads.meta.total + archivedThreads.meta.total) / 10)
        }
      };
    case 'active':
    default:
      return activeThreads;
  }
};

/**
 * Helper function to get mock search results
 */
export const getSearchResults = (query) => {
  if (!query || query.trim().length < 2) {
    return mockEmptySearchResults;
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Combine all threads for searching
  const allThreads = [...mockThreadList.data, ...mockArchivedThreadList.data];
  
  // Filter threads that match the query in name, last message, or member names
  const results = allThreads.filter(thread => {
    // Search in thread name
    if (thread.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in last message content
    if (thread.lastMessage && 
        thread.lastMessage.content.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in member names
    if (thread.members && thread.members.some(member => 
        member.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }
    
    return false;
  });
  
  return {
    data: results,
    meta: {
      total: results.length,
      query: query,
      page: 1,
      limit: 20,
      pages: Math.ceil(results.length / 20)
    }
  };
};

export const getMockThreadSummary = (threadId) => {
  return {
    ...mockThreadSummary,
    thread: {
      ...mockThreadSummary.thread,
      id: threadId
    }
  };
};

export const getMockUnreadCount = () => {
  return mockUnreadCount;
};
