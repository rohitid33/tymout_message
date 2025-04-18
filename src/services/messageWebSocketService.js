/**
 * Message WebSocket Service
 * 
 * Handles real-time communication for the messaging system.
 * Manages connection, reconnection, and messaging events.
 */

import { io } from 'socket.io-client';

// Base WebSocket URL would typically come from environment configuration
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.tymout.example/ws';

class MessageWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {
      message: [],
      status: [],
      typing: [],
      reconnect: [],
      disconnect: [],
      memberStatus: [],
      chatModeChanged: [],
      chatExtended: [],
      chatDeactivated: [],
      memberJoined: [],
      memberLeft: [],
      joinRequest: []
    };
  }

  /**
   * Initializes WebSocket connection
   * @param {string} token - Authentication token
   * @param {string} threadId - Current thread ID (optional)
   */
  connect(token, threadId = null) {
    if (this.socket) {
      this.disconnect();
    }

    const query = { token };
    if (threadId) {
      query.threadId = threadId;
    }

    this.socket = io(WS_BASE_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      query
    });

    this._setupEventListeners();
  }

  /**
   * Disconnects WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Setup internal socket event listeners
   * @private
   */
  _setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
      this.isConnected = false;
      this._notifyListeners('disconnect', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this._notifyListeners('reconnect', attemptNumber);
    });

    this.socket.on('message', (data) => {
      this._notifyListeners('message', data);
    });

    this.socket.on('typing', (data) => {
      this._notifyListeners('typing', data);
    });

    this.socket.on('status', (data) => {
      this._notifyListeners('status', data);
    });
    
    // Chat event listeners
    this.socket.on('memberStatus', (data) => {
      this._notifyListeners('memberStatus', data);
    });
    
    this.socket.on('chatModeChanged', (data) => {
      this._notifyListeners('chatModeChanged', data);
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
  }

  /**
   * Sends a message via WebSocket
   * @param {string} threadId - Thread ID
   * @param {object} content - Message content
   */
  sendMessage(threadId, content) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.socket.emit('message', { threadId, content });
  }

  /**
   * Sends typing indicator
   * @param {string} threadId - Thread ID
   * @param {boolean} isTyping - Typing status
   */
  sendTypingIndicator(threadId, isTyping) {
    if (!this.isConnected) {
      return;
    }

    this.socket.emit('typing', { threadId, isTyping });
  }
  
  /**
   * Subscribe to a specific thread for real-time updates
   * @param {string} threadId - Thread ID to subscribe to
   */
  subscribeToThread(threadId) {
    if (!this.isConnected) {
      return;
    }
    
    this.socket.emit('subscribe', { threadId });
  }

  /**
   * Unsubscribe from a specific thread
   * @param {string} threadId - Thread ID to unsubscribe from
   */
  unsubscribeFromThread(threadId) {
    if (!this.isConnected) {
      return;
    }
    
    this.socket.emit('unsubscribe', { threadId });
  }

  /**
   * Request member online status updates for a thread
   * @param {string} threadId - Thread ID
   */
  requestMemberStatusUpdates(threadId) {
    if (!this.isConnected) {
      return;
    }
    
    this.socket.emit('requestMemberStatus', { threadId });
  }

  /**
   * Register event listener
   * @param {string} event - Event name (message, status, typing, reconnect, disconnect, etc.)
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners for an event
   * @param {string} event - Event name
   * @param {*} data - Event data
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
}

// Export as singleton instance
const messageWebSocketService = new MessageWebSocketService();
export default messageWebSocketService;
