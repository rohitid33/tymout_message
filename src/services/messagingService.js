/**
 * Messaging Service
 * 
 * Handles all API interactions related to messaging functionality.
 * Follows the interface contract defined in the architecture documentation.
 */

import axios from 'axios';

// Base API URL would typically come from environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tymout.example';

/**
 * Service for all messaging operations
 */
const messagingService = {
  /**
   * Fetches all message threads for current user
   * @returns {Promise} Promise resolving to threads array
   */
  getMessageThreads: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message threads:', error);
      throw error;
    }
  },
  
  /**
   * Fetches messages for a specific thread
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to messages array
   */
  getThreadMessages: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Sends a new message to a thread
   * @param {string} threadId - The thread ID
   * @param {object} content - Message content
   * @returns {Promise} Promise resolving to created message
   */
  sendMessage: async (threadId, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/threads/${threadId}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error sending message to thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Marks a thread as read
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to updated thread
   */
  markThreadAsRead: async (threadId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking thread ${threadId} as read:`, error);
      throw error;
    }
  },
  
  /**
   * Extends the active period of a chat
   * @param {string} threadId - The thread ID
   * @param {number} hours - Hours to extend (default: 6)
   * @returns {Promise} Promise resolving to updated thread
   */
  extendChatPeriod: async (threadId, hours = 6) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/extend`, { hours });
      return response.data;
    } catch (error) {
      console.error(`Error extending chat period for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Toggles the chat mode between group-chat and announcements-only
   * @param {string} threadId - The thread ID
   * @param {string} mode - The mode to set (group-chat or announcements-only)
   * @returns {Promise} Promise resolving to updated thread
   */
  setChatMode: async (threadId, mode) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/mode`, { mode });
      return response.data;
    } catch (error) {
      console.error(`Error setting chat mode for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get join requests for a thread (admin only)
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to join requests array
   */
  getJoinRequests: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/requests`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching join requests for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Respond to a join request (accept or reject)
   * @param {string} requestId - The request ID
   * @param {string} threadId - The thread ID
   * @param {boolean} accept - Whether to accept the request
   * @param {string} message - Optional message to include with the response
   * @returns {Promise} Promise resolving to updated request
   */
  respondToJoinRequest: async (requestId, threadId, accept, message) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/messages/threads/${threadId}/requests/${requestId}`, {
        accept,
        message
      });
      return response.data;
    } catch (error) {
      console.error(`Error responding to join request ${requestId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a comment to a join request conversation
   * @param {string} requestId - The request ID
   * @param {string} threadId - The thread ID
   * @param {string} content - Comment content
   * @returns {Promise} Promise resolving to updated request conversation
   */
  addJoinRequestComment: async (requestId, threadId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/threads/${threadId}/requests/${requestId}/comments`,
        { content }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to join request ${requestId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get members of a thread
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to members array
   */
  getThreadMembers: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Remove a member from a thread (admin only)
   * @param {string} threadId - The thread ID
   * @param {string} userId - The user ID to remove
   * @returns {Promise} Promise resolving to success status
   */
  removeMember: async (threadId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/messages/threads/${threadId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing member ${userId} from thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Leave a thread (current user)
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to success status
   */
  leaveThread: async (threadId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/messages/threads/${threadId}/members/me`);
      return response.data;
    } catch (error) {
      console.error(`Error leaving thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get detailed information about a thread
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to thread details
   */
  getThreadInfo: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching thread info for ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get thread status information including closing time and event details
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to thread status information
   */
  getThreadStatusInfo: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching status info for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get online status of thread members
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to member online status
   */
  getMemberOnlineStatus: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/members/status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member online status for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get the history of time extensions for a thread
   * @param {string} threadId - The thread ID
   * @returns {Promise} Promise resolving to extension history
   */
  getTimeExtensionHistory: async (threadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/threads/${threadId}/extensions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time extension history for thread ${threadId}:`, error);
      throw error;
    }
  }
};

export default messagingService;
