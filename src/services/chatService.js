/**
 * Chat Service
 * 
 * Handles all API interactions related to chat functionality.
 * Provides methods for fetching chats, managing chat lifecycle,
 * and handling join requests.
 */

import axios from 'axios';

// Base API URL from environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tymout.example';

/**
 * Service for all chat operations
 */
const chatService = {
  /**
   * Fetches all available chats for the current user
   * @returns {Promise} Promise resolving to chats array
   */
  getChats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific chat by ID
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to chat details
   */
  getChatById: async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new chat
   * @param {object} chatData - Chat creation data
   * @returns {Promise} Promise resolving to created chat
   */
  createChat: async (chatData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chats`, chatData);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  /**
   * Extends the active period of a chat
   * @param {string} chatId - The chat ID
   * @param {number} hours - Hours to extend (default: 6)
   * @returns {Promise} Promise resolving to updated chat
   */
  extendChat: async (chatId, hours = 6) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/chats/${chatId}/extend`, { hours });
      return response.data;
    } catch (error) {
      console.error(`Error extending chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Deactivates a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to deactivated chat
   */
  deactivateChat: async (chatId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/chats/${chatId}/deactivate`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Changes the chat mode
   * @param {string} chatId - The chat ID
   * @param {string} mode - The target mode (group-chat or announcements-only)
   * @returns {Promise} Promise resolving to updated chat
   */
  setChatMode: async (chatId, mode) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/chats/${chatId}/mode`, { mode });
      return response.data;
    } catch (error) {
      console.error(`Error changing mode for chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches join requests for a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to join requests array
   */
  getJoinRequests: async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/requests`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching join requests for chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Submits a join request for a chat
   * @param {string} chatId - The chat ID
   * @param {string} message - Optional message with the request
   * @returns {Promise} Promise resolving to created request
   */
  submitJoinRequest: async (chatId, message = "") => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chats/${chatId}/requests`, { message });
      return response.data;
    } catch (error) {
      console.error(`Error submitting join request for chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Responds to a join request (approve/reject)
   * @param {string} chatId - The chat ID
   * @param {string} requestId - The request ID
   * @param {boolean} approved - Whether the request is approved
   * @param {string} message - Optional response message
   * @returns {Promise} Promise resolving to updated request
   */
  respondToJoinRequest: async (chatId, requestId, approved, message = "") => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/chats/${chatId}/requests/${requestId}`, {
        approved,
        message
      });
      return response.data;
    } catch (error) {
      console.error(`Error responding to join request ${requestId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches the members of a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to members array
   */
  getChatMembers: async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Removes a member from a chat (admin only)
   * @param {string} chatId - The chat ID
   * @param {string} userId - The user ID to remove
   * @returns {Promise} Promise resolving to success status
   */
  removeMember: async (chatId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/chats/${chatId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing member ${userId} from chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Leaves a chat (current user)
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to success status
   */
  leaveChat: async (chatId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/chats/${chatId}/members/current`);
      return response.data;
    } catch (error) {
      console.error(`Error leaving chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Gets the chat lifecycle information
   * @param {string} chatId - The chat ID
   * @returns {Promise} Promise resolving to chat lifecycle details
   */
  getChatLifecycle: async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/lifecycle`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lifecycle for chat ${chatId}:`, error);
      throw error;
    }
  }
};

export default chatService;
