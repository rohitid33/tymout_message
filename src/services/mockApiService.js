// Mock API Service for Tymout Chat Platform
import { mockThreadList } from '../@data/mockChatThreads';
import { mockUsers } from '../@data/mockUsers';
import { mockMessages, mockMembers, mockThreadDetails } from '../@data/mockChatDetail';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

const mockApiService = {
  getChatThreads: async (options = {}) => {
    await delay();
    // Filtering, sorting, pagination logic
    let data = [...mockThreadList.data];
    if (options.filter && options.filter !== 'all') {
      data = data.filter(t => t.status === options.filter);
    }
    if (options.type && options.type !== 'all') {
      data = data.filter(t => t.type === options.type);
    }
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      data = data.filter(t => t.name.toLowerCase().includes(q));
    }
    // Sort and paginate
    if (options.sortBy) {
      data.sort((a, b) => (b[options.sortBy] > a[options.sortBy] ? 1 : -1));
    }
    const page = options.page || 1;
    const limit = options.limit || 10;
    const total = data.length;
    const pages = Math.ceil(total / limit);
    const paged = data.slice((page - 1) * limit, page * limit);
    return {
      data: paged,
      meta: { total, pages }
    };
  },

  getThreadMessages: async (threadId) => {
    await delay();
    return mockMessages[threadId] || [];
  },

  getThreadMembers: async (threadId) => {
    await delay();
    return mockMembers[threadId] || [];
  },

  getThreadDetail: async (threadId) => {
    await delay();
    return mockThreadDetails[threadId] || null;
  },

  getThreadById: async (threadId) => {
    await delay();
    return mockThreads.find(t => t.id === threadId) || null;
  },

  getUnreadCount: async () => {
    await delay();
    return { total: mockThreads.filter(t => t.hasUnread).length };
  },

  getUsers: async () => {
    await delay();
    return mockUsers;
  },

  getJoinRequests: async () => {
    await delay();
    return mockJoinRequests;
  }
};

export default mockApiService;
