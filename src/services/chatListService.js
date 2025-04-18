/**
 * Chat List Service
 * 
 * Provides methods for fetching and manipulating chat lists and thread data
 * for the Tymout messaging platform.
 */

import axios from 'axios';
import { handleApiError } from '../utils/errorHandling';

// Base API URL - should be configured from environment variables in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tymout.example';

/**
 * Service for chat list and thread detail operations
 */
const chatListService = {
  /**
   * Get list of chat threads with pagination
   * 
   * @param {Object} options Query options
   * @param {number} options.page Page number (1-based)
   * @param {number} options.limit Items per page
   * @param {string} options.sortBy Sort field
   * @param {string} options.sortOrder Sort direction ('asc' or 'desc')
   * @param {string} options.filter Filter by type ('all', 'active', 'archived', etc.)
   * @returns {Promise} Promise resolving to paginated chat threads
   */
  getChatThreads: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'lastActivity',
        sortOrder = 'desc',
        filter = 'all'
      } = options;
      
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads`, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          filter
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chat threads:', error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Search chat threads
   * 
   * @param {string} query Search query
   * @param {Object} options Additional search options
   * @returns {Promise} Promise resolving to search results
   */
  searchChatThreads: async (query, options = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/search`, {
        params: {
          query,
          ...options
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching chat threads:', error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Get thread summary with latest message and participant preview
   * 
   * @param {string} threadId Thread ID
   * @returns {Promise} Promise resolving to thread summary
   */
  getThreadSummary: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching thread summary for ${threadId}:`, error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Mark a thread as read
   * 
   * @param {string} threadId Thread ID
   * @returns {Promise} Promise resolving to operation result
   */
  markThreadAsRead: async (threadId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking thread ${threadId} as read:`, error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Archive a thread
   * 
   * @param {string} threadId Thread ID
   * @returns {Promise} Promise resolving to operation result
   */
  archiveThread: async (threadId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Error archiving thread ${threadId}:`, error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Unarchive a thread
   * 
   * @param {string} threadId Thread ID
   * @returns {Promise} Promise resolving to operation result
   */
  unarchiveThread: async (threadId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error(`Error unarchiving thread ${threadId}:`, error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new thread
   * 
   * @param {Object} threadData Thread data
   * @returns {Promise} Promise resolving to created thread
   */
  createThread: async (threadData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/threads`, threadData);
      return response.data;
    } catch (error) {
      console.error('Error creating new thread:', error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Get unread thread count
   * 
   * @returns {Promise} Promise resolving to unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/unread/count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw handleApiError(error);
    }
  }
};

export default chatListService;
