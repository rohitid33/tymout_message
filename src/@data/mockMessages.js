/**
 * Mock Messages Data
 * 
 * Contains sample message data for development and testing of
 * messaging UI components.
 */

// Get a date object for a relative time in the past (minutes)
const getRelativeDate = (minutesAgo) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

// Sample message data with various types and statuses
export const mockMessages = [
  // System messages
  {
    id: 'system-1',
    content: 'Chat has been created for the Table: Weekly Brunch',
    senderId: 'system',
    timestamp: getRelativeDate(120),
    isSystemMessage: true
  },
  {
    id: 'system-2',
    content: 'User John Doe joined the chat',
    senderId: 'system',
    timestamp: getRelativeDate(115),
    isSystemMessage: true
  },
  
  // Regular text messages
  {
    id: 'msg-1',
    content: 'Hey everyone! Looking forward to our brunch this weekend.',
    senderId: 'user123', // Current user
    timestamp: getRelativeDate(110),
    status: 'read',
    isSystemMessage: false,
    messageType: 'text'
  },
  {
    id: 'msg-2',
    content: 'Me too! Do we need to bring anything?',
    senderId: 'user456',
    timestamp: getRelativeDate(105),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  },
  {
    id: 'msg-3',
    content: 'I can bring some pastries from that bakery we all like.',
    senderId: 'user789',
    timestamp: getRelativeDate(100),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  },
  {
    id: 'msg-4',
    content: 'That would be great! I\'ll handle the mimosas then.',
    senderId: 'user123', // Current user
    timestamp: getRelativeDate(95),
    status: 'read',
    isSystemMessage: false,
    messageType: 'text'
  },
  
  // Image message
  {
    id: 'msg-5',
    content: 'https://picsum.photos/500/300',
    caption: 'Here\'s the menu from last time',
    senderId: 'user456',
    timestamp: getRelativeDate(90),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'image'
  },
  
  // System notification
  {
    id: 'system-3',
    content: 'User Emma Watson joined the chat',
    senderId: 'system',
    timestamp: getRelativeDate(85),
    isSystemMessage: true
  },
  
  // More text messages
  {
    id: 'msg-6',
    content: 'Hi everyone! Sorry I\'m late to the chat.',
    senderId: 'user101',
    timestamp: getRelativeDate(80),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  },
  {
    id: 'msg-7',
    content: 'Welcome Emma! We were just discussing what to bring to brunch.',
    senderId: 'user123', // Current user
    timestamp: getRelativeDate(75),
    status: 'read',
    isSystemMessage: false,
    messageType: 'text',
    threadReplies: [
      {
        id: 'reply-1',
        content: 'Thanks for the warm welcome!',
        senderId: 'user101',
        timestamp: getRelativeDate(74)
      }
    ]
  },
  
  // Link preview message
  {
    id: 'msg-8',
    content: 'https://recipe-example.com/avocado-toast',
    senderId: 'user789',
    timestamp: getRelativeDate(70),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'link',
    linkData: {
      title: 'Perfect Avocado Toast Recipe',
      description: 'The ultimate guide to making the best avocado toast with various toppings and seasonings.',
      image: 'https://picsum.photos/400/200'
    }
  },
  
  // Long message to test wrapping
  {
    id: 'msg-9',
    content: 'I just wanted to confirm the details for everyone. We\'ll be meeting at 11 AM at the usual place. The reservation is under my name. Parking should be available in the garage across the street, and they validate for up to 3 hours. If anyone needs a ride, please let me know by tomorrow evening so I can plan accordingly. Looking forward to seeing everyone there!',
    senderId: 'user456',
    timestamp: getRelativeDate(65),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  },
  
  // More recent messages
  {
    id: 'msg-10',
    content: 'Thanks for organizing this!',
    senderId: 'user101',
    timestamp: getRelativeDate(60),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  },
  {
    id: 'msg-11',
    content: 'No problem at all, it\'s always fun.',
    senderId: 'user123', // Current user
    timestamp: getRelativeDate(55),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text'
  }
];

// Additional sample message data for various display states
export const messageExamples = {
  sending: {
    id: 'example-sending',
    content: 'This message is currently sending...',
    senderId: 'user123',
    timestamp: new Date().toISOString(),
    status: 'sending',
    isSystemMessage: false,
    messageType: 'text'
  },
  failed: {
    id: 'example-failed',
    content: 'This message failed to send',
    senderId: 'user123',
    timestamp: new Date().toISOString(),
    status: 'failed',
    isSystemMessage: false,
    messageType: 'text'
  },
  thread: {
    id: 'example-thread',
    content: 'This message has thread replies',
    senderId: 'user456',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    isSystemMessage: false,
    messageType: 'text',
    threadReplies: [
      {
        id: 'thread-reply-1',
        content: 'First reply',
        senderId: 'user123',
        timestamp: new Date().toISOString()
      },
      {
        id: 'thread-reply-2',
        content: 'Second reply',
        senderId: 'user789',
        timestamp: new Date().toISOString()
      }
    ]
  }
};

// Export message status types for reference
export const messageStatuses = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

// Export message types for reference
export const messageTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  LINK: 'link',
  NOTIFICATION: 'notification'
};
