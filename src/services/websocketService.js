/**
 * WebSocket Service
 * 
 * Provides real-time communication for the Tymout messaging platform,
 * handling member status updates, new messages, and other real-time events.
 */

import { createAccessibleClickProps } from '../utils/accessibility';
import { handleApiError } from '../utils/errorHandling';

// Constants for WebSocket events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT: 'reconnect',
  MEMBER_STATUS_CHANGE: 'member_status_change',
  TYPING_INDICATOR: 'typing_indicator',
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read',
  THREAD_UPDATED: 'thread_updated',
  MEMBER_JOINED: 'member_joined',
  MEMBER_LEFT: 'member_left',
  MEMBER_ROLE_CHANGED: 'member_role_changed'
};

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.eventHandlers = new Map();
    this.pendingMessages = [];
    this.currentUser = null;
    this.isTestEnvironment = false;
  }

  /**
   * Initialize the WebSocket connection
   * @param {Object} config Configuration object
   * @param {string} config.url WebSocket server URL
   * @param {Object} config.user Current user information
   * @param {boolean} config.isTestEnvironment Whether we're in a test environment
   */
  initialize(config) {
    const { url, user, isTestEnvironment = false } = config;
    
    this.currentUser = user;
    this.isTestEnvironment = isTestEnvironment;
    
    // Don't actually connect in test environments unless forced
    if (isTestEnvironment && !config.forceConnect) {
      console.log('WebSocket in test environment - simulated connection');
      this._simulateConnection();
      return;
    }
    
    try {
      this.disconnect(); // Ensure no existing connection
      
      // Use native WebSocket or a library like socket.io
      this.socket = new WebSocket(url);
      
      this.socket.onopen = this._handleConnect.bind(this);
      this.socket.onclose = this._handleDisconnect.bind(this);
      this.socket.onerror = this._handleError.bind(this);
      this.socket.onmessage = this._handleMessage.bind(this);
      
      console.log('WebSocket initialized');
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      
      // Handle the error through our error handling system
      handleApiError(error, {
        silent: this.isTestEnvironment,
        onError: () => this._attemptReconnect()
      });
    }
  }
  
  /**
   * Subscribe to a WebSocket event
   * @param {string} event Event name
   * @param {Function} handler Event handler function
   * @returns {Function} Unsubscribe function
   */
  subscribe(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event).add(handler);
    
    // Return unsubscribe function
    return () => {
      if (this.eventHandlers.has(event)) {
        this.eventHandlers.get(event).delete(handler);
      }
    };
  }
  
  /**
   * Send a message via WebSocket
   * @param {string} event Event name
   * @param {*} data Message data
   */
  send(event, data) {
    const message = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sender: this.currentUser?.id
    };
    
    // If not connected, queue the message
    if (!this.isConnected) {
      this.pendingMessages.push(message);
      return;
    }
    
    // In test environment, simulate sending
    if (this.isTestEnvironment) {
      console.log('WebSocket (simulated) sending:', message);
      return;
    }
    
    try {
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
      this.pendingMessages.push(message);
      this._handleError(error);
    }
  }
  
  /**
   * Disconnect the WebSocket
   */
  disconnect() {
    if (!this.socket) return;
    
    try {
      this.socket.close();
    } catch (error) {
      console.error('Error closing WebSocket:', error);
    } finally {
      this.socket = null;
      this.isConnected = false;
    }
  }
  
  /**
   * Update user presence status
   * @param {string} status User status ('online', 'offline', 'away')
   */
  updatePresence(status) {
    this.send(SOCKET_EVENTS.MEMBER_STATUS_CHANGE, {
      userId: this.currentUser?.id,
      status
    });
  }
  
  /**
   * Send typing indicator
   * @param {string} threadId Thread ID
   * @param {boolean} isTyping Whether the user is typing
   */
  sendTypingIndicator(threadId, isTyping) {
    this.send(SOCKET_EVENTS.TYPING_INDICATOR, {
      threadId,
      userId: this.currentUser?.id,
      isTyping
    });
  }
  
  /**
   * Join a thread for real-time updates
   * @param {string} threadId Thread ID
   */
  joinThread(threadId) {
    this.send('join_thread', { threadId });
  }
  
  /**
   * Leave a thread
   * @param {string} threadId Thread ID
   */
  leaveThread(threadId) {
    this.send('leave_thread', { threadId });
  }
  
  // Private methods
  
  /**
   * Handle WebSocket connection
   */
  _handleConnect() {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    console.log('WebSocket connected');
    
    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.CONNECT);
    
    // Send any pending messages
    this._sendPendingMessages();
    
    // Authenticate if we have a current user
    if (this.currentUser) {
      this.send('authenticate', {
        userId: this.currentUser.id,
        token: this.currentUser.token
      });
    }
  }
  
  /**
   * Handle WebSocket disconnection
   */
  _handleDisconnect() {
    this.isConnected = false;
    console.log('WebSocket disconnected');
    
    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.DISCONNECT);
    
    // Attempt to reconnect
    this._attemptReconnect();
  }
  
  /**
   * Handle WebSocket errors
   * @param {Error} error The error that occurred
   */
  _handleError(error) {
    console.error('WebSocket error:', error);
    
    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.ERROR, error);
    
    // In case of error, attempt to reconnect
    if (this.isConnected) {
      this.isConnected = false;
      this._attemptReconnect();
    }
  }
  
  /**
   * Handle incoming WebSocket messages
   * @param {MessageEvent} event WebSocket message event
   */
  _handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      
      // Notify subscribers of the specific event
      if (message.event) {
        this._notifySubscribers(message.event, message.data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, event.data);
    }
  }
  
  /**
   * Notify subscribers of an event
   * @param {string} event Event name
   * @param {*} data Event data
   */
  _notifySubscribers(event, data) {
    if (!this.eventHandlers.has(event)) return;
    
    this.eventHandlers.get(event).forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }
  
  /**
   * Attempt to reconnect to the WebSocket
   */
  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    // Notify subscribers of reconnection attempt
    this._notifySubscribers(SOCKET_EVENTS.RECONNECT_ATTEMPT, {
      attempt: this.reconnectAttempts,
      max: this.maxReconnectAttempts
    });
    
    // Wait and then attempt to reconnect
    setTimeout(() => {
      if (this.socket?.url) {
        this.initialize({
          url: this.socket.url,
          user: this.currentUser,
          isTestEnvironment: this.isTestEnvironment
        });
      }
    }, this.reconnectInterval);
  }
  
  /**
   * Send any pending messages
   */
  _sendPendingMessages() {
    if (!this.pendingMessages.length) return;
    
    console.log(`Sending ${this.pendingMessages.length} pending messages...`);
    
    this.pendingMessages.forEach(message => {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send pending message:', error);
      }
    });
    
    // Clear pending messages
    this.pendingMessages = [];
  }
  
  /**
   * Simulate connection for test environments
   */
  _simulateConnection() {
    this.isConnected = true;
    console.log('WebSocket connected (simulated)');
    
    // Notify subscribers
    this._notifySubscribers(SOCKET_EVENTS.CONNECT);
  }
}

// Create and export a singleton instance
const websocketService = new WebSocketService();
export default websocketService;
