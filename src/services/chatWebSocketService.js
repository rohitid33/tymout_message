/**
 * Chat WebSocket Service
 * 
 * Manages real-time communication specifically for chat functionality.
 * Handles chat-related events, status updates, and real-time notifications.
 */

import { io } from 'socket.io-client';
import authService from './authService';

// Base WebSocket URL from environment configuration
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.tymout.example/ws';

class ChatWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.activeChats = new Set();
    this.listeners = {
      connect: [],
      disconnect: [],
      reconnect: [],
      chatMessage: [],
      typingIndicator: [],
      userOnline: [],
      userOffline: [],
      chatExtended: [],
      chatDeactivated: [],
      memberJoined: [],
      memberLeft: [],
      joinRequest: [],
      chatModeChanged: []
    };
  }

  /**
   * Initializes the WebSocket connection
   */
  connect() {
    if (this.socket) {
      this.disconnect();
    }

    const token = authService.getAccessToken();
    if (!token) {
      console.error('Cannot connect to WebSocket: No authentication token available');
      return;
    }

    this.socket = io(`${WS_BASE_URL}/chat`, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: {
        token
      }
    });

    this._setupEventListeners();
  }

  /**
   * Disconnects the WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.activeChats.clear();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Sets up internal socket event listeners
   * @private
   */
  _setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Chat WebSocket connected');
      this.isConnected = true;
      
      // Rejoin previously active chats
      this.activeChats.forEach(chatId => {
        this.joinChat(chatId);
      });
      
      this._notifyListeners('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Chat WebSocket disconnected: ${reason}`);
      this.isConnected = false;
      this._notifyListeners('disconnect', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Chat WebSocket reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this._notifyListeners('reconnect', attemptNumber);
    });

    // Chat-specific events
    this.socket.on('chatMessage', (data) => {
      this._notifyListeners('chatMessage', data);
    });

    this.socket.on('typingIndicator', (data) => {
      this._notifyListeners('typingIndicator', data);
    });

    this.socket.on('userOnline', (data) => {
      this._notifyListeners('userOnline', data);
    });

    this.socket.on('userOffline', (data) => {
      this._notifyListeners('userOffline', data);
    });

    this.socket.on('chatExtended', (data) => {
      this._notifyListeners('chatExtended', data);
    });

    this.socket.on('chatDeactivated', (data) => {
      this._notifyListeners('chatDeactivated', data);
    });

    this.socket.on('memberJoined', (data) => {
      this._notifyListeners('memberJoined', data);
    });

    this.socket.on('memberLeft', (data) => {
      this._notifyListeners('memberLeft', data);
    });

    this.socket.on('joinRequest', (data) => {
      this._notifyListeners('joinRequest', data);
    });

    this.socket.on('chatModeChanged', (data) => {
      this._notifyListeners('chatModeChanged', data);
    });
  }

  /**
   * Notifies all registered listeners for a specific event
   * @param {string} event - Event name
   * @param {any} data - Event data
   * @private
   */
  _notifyListeners(event, data) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  /**
   * Joins a chat room to receive real-time updates
   * @param {string} chatId - Chat ID to join
   */
  joinChat(chatId) {
    if (!this.isConnected) {
      this.activeChats.add(chatId);
      return;
    }

    this.socket.emit('joinChat', { chatId });
    this.activeChats.add(chatId);
  }

  /**
   * Leaves a chat room to stop receiving updates
   * @param {string} chatId - Chat ID to leave
   */
  leaveChat(chatId) {
    if (!this.isConnected) {
      this.activeChats.delete(chatId);
      return;
    }

    this.socket.emit('leaveChat', { chatId });
    this.activeChats.delete(chatId);
  }

  /**
   * Sends a message to a chat
   * @param {string} chatId - Target chat ID
   * @param {object} message - Message content
   */
  sendMessage(chatId, message) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.socket.emit('sendMessage', { chatId, message });
  }

  /**
   * Updates typing indicator status
   * @param {string} chatId - Target chat ID
   * @param {boolean} isTyping - Whether the user is typing
   */
  updateTypingStatus(chatId, isTyping) {
    if (!this.isConnected) {
      return;
    }

    this.socket.emit('typing', { chatId, isTyping });
  }

  /**
   * Registers an event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   * @returns {function} Function to unregister the listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unregisters an event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
}

// Export as singleton instance
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService;
