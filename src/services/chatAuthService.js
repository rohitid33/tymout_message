/**
 * Chat Authorization Service
 * 
 * Provides specialized authorization helpers for chat access.
 * Handles permission checks for various chat operations.
 */

import authService from './authService';
import axios from 'axios';

// Base API URL from environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tymout.example';

/**
 * Chat user roles
 * @type {Object}
 */
export const CHAT_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest'
};

/**
 * Service for chat authorization operations
 */
const chatAuthService = {
  /**
   * Checks if the current user has access to a specific chat
   * @param {string} chatId - The chat ID to check access for
   * @returns {Promise<boolean>} Promise resolving to access status
   */
  hasAccessToChat: async (chatId) => {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/access`);
      return response.data.hasAccess;
    } catch (error) {
      console.error(`Error checking access for chat ${chatId}:`, error);
      return false;
    }
  },

  /**
   * Gets the current user's role in a specific chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<string>} Promise resolving to user role (admin, member, guest)
   */
  getUserChatRole: async (chatId) => {
    if (!authService.isAuthenticated()) {
      return CHAT_ROLES.GUEST;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}/role`);
      return response.data.role;
    } catch (error) {
      console.error(`Error getting role for chat ${chatId}:`, error);
      return CHAT_ROLES.GUEST;
    }
  },

  /**
   * Checks if the current user is an admin of a specific chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to admin status
   */
  isAdmin: async (chatId) => {
    const role = await chatAuthService.getUserChatRole(chatId);
    return role === CHAT_ROLES.ADMIN;
  },

  /**
   * Checks if the current user can send messages in the chat
   * @param {string} chatId - The chat ID
   * @param {string} chatMode - The chat mode (group-chat or announcements-only)
   * @returns {Promise<boolean>} Promise resolving to send permission status
   */
  canSendMessage: async (chatId, chatMode) => {
    const role = await chatAuthService.getUserChatRole(chatId);
    
    // In group-chat mode, all members can send messages
    if (chatMode === 'group-chat') {
      return role === CHAT_ROLES.ADMIN || role === CHAT_ROLES.MEMBER;
    }
    
    // In announcements-only mode, only admins can send messages to everyone
    return role === CHAT_ROLES.ADMIN;
  },

  /**
   * Checks if the current user can extend a chat's active period
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to extend permission status
   */
  canExtendChat: async (chatId) => {
    return await chatAuthService.isAdmin(chatId);
  },

  /**
   * Checks if the current user can deactivate a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to deactivate permission status
   */
  canDeactivateChat: async (chatId) => {
    return await chatAuthService.isAdmin(chatId);
  },

  /**
   * Checks if the current user can manage join requests
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to management permission status
   */
  canManageJoinRequests: async (chatId) => {
    return await chatAuthService.isAdmin(chatId);
  },

  /**
   * Checks if the current user can change the chat mode
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to mode change permission status
   */
  canChangeChatMode: async (chatId) => {
    return await chatAuthService.isAdmin(chatId);
  },

  /**
   * Checks if the current user can remove members from the chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<boolean>} Promise resolving to remove member permission status
   */
  canRemoveMember: async (chatId) => {
    return await chatAuthService.isAdmin(chatId);
  }
};

export default chatAuthService;
