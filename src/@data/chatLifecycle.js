/**
 * Mock Chat Lifecycle Data
 * 
 * Following Global Development Rule #1:
 * "Store all mock data in the @data directory to improve maintainability and reusability."
 */

// Helper function to generate dates relative to now
const getRelativeTime = (hours) => {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
};

// Mock lifecycle data for different chat states
export const chatLifecycleData = {
  'thread-1': {
    eventEndTime: getRelativeTime(-1), // Event ended 1 hour ago
    closingTime: getRelativeTime(5),   // Chat closes in 5 hours
    status: 'active',
    isReadOnly: false,
    extensionCount: 0,
    lastExtension: null,
    eventName: 'Project Tymout Discussion',
    eventId: 'event-123'
  },
  'thread-2': {
    eventEndTime: getRelativeTime(-2), // Event ended 2 hours ago
    closingTime: getRelativeTime(4),   // Chat closes in 4 hours
    status: 'active',
    isReadOnly: false,
    extensionCount: 0,
    lastExtension: null,
    eventName: 'Weekly Team Sync',
    eventId: 'event-456'
  },
  'thread-3': {
    eventEndTime: getRelativeTime(-5), // Event ended 5 hours ago
    closingTime: getRelativeTime(1),   // Chat closing soon (1 hour)
    status: 'active',
    isReadOnly: false,
    extensionCount: 0,
    lastExtension: null,
    eventName: 'Product Demo Preparation',
    eventId: 'event-789'
  },
  'thread-4': {
    eventEndTime: getRelativeTime(-7), // Event ended 7 hours ago
    closingTime: getRelativeTime(0.15), // Chat closing very soon (9 minutes)
    status: 'active',
    isReadOnly: false,
    extensionCount: 0,
    lastExtension: null,
    eventName: 'Marketing Campaign Review',
    eventId: 'event-101'
  },
  'thread-5': {
    eventEndTime: getRelativeTime(-24), // Event ended 24 hours ago
    closingTime: getRelativeTime(-18),  // Chat closed 18 hours ago
    status: 'archived',
    isReadOnly: true,
    extensionCount: 0,
    lastExtension: null,
    eventName: 'Customer Support Team',
    eventId: 'event-202'
  }
};

// Get lifecycle data for a specific chat
export const getChatLifecycle = (chatId) => {
  return chatLifecycleData[chatId] || null;
};

// Get lifecycle data for all chats
export const getAllChatLifecycles = () => {
  return chatLifecycleData;
};

export default chatLifecycleData;
