/**
 * Chat Lifecycle Store
 * 
 * Store for managing chat lifecycle state using Zustand,
 * following the Global Development Rule #3 for state management.
 */

import { create } from 'zustand';

const useChatLifecycleStore = create((set, get) => ({
  // Chat status tracking
  activeChats: {}, // Map of chatId -> lifecycle data
  
  // Warning flags
  showingWarning: {}, // Map of chatId -> boolean
  
  // Initialize lifecycle data for a chat
  initChat: (chatId, eventEndTime, status = 'active') => {
    set(state => ({
      activeChats: {
        ...state.activeChats,
        [chatId]: {
          status,
          eventEndTime,
          closingTime: new Date(new Date(eventEndTime).getTime() + 6 * 60 * 60 * 1000), // 6 hours after event end
          warningTime: null,
          lastExtension: null,
          extensionCount: 0,
          isReadOnly: status === 'archived'
        }
      }
    }));
  },
  
  // Update chat lifecycle data
  updateChatLifecycle: (chatId, lifecycleData) => {
    set(state => ({
      activeChats: {
        ...state.activeChats,
        [chatId]: {
          ...(state.activeChats[chatId] || {}),
          ...lifecycleData
        }
      }
    }));
  },
  
  // Extend chat closing time
  extendChat: (chatId, hoursToAdd = 6) => {
    const state = get();
    const chat = state.activeChats[chatId];
    
    if (!chat) return;
    
    const newClosingTime = new Date(
      chat.closingTime ? new Date(chat.closingTime).getTime() : Date.now()
    );
    newClosingTime.setHours(newClosingTime.getHours() + hoursToAdd);
    
    set(state => ({
      activeChats: {
        ...state.activeChats,
        [chatId]: {
          ...chat,
          closingTime: newClosingTime.toISOString(),
          lastExtension: new Date().toISOString(),
          extensionCount: chat.extensionCount + 1,
          status: 'active',
          isReadOnly: false,
          warningTime: null
        }
      },
      showingWarning: {
        ...state.showingWarning,
        [chatId]: false
      }
    }));
    
    return newClosingTime.toISOString();
  },
  
  // Set chat to read-only mode
  setReadOnly: (chatId, isReadOnly = true) => {
    set(state => {
      const chat = state.activeChats[chatId];
      if (!chat) return state;
      
      return {
        activeChats: {
          ...state.activeChats,
          [chatId]: {
            ...chat,
            isReadOnly,
            status: isReadOnly ? 'archived' : chat.status
          }
        }
      };
    });
  },
  
  // Set warning for a specific chat
  setWarning: (chatId, isWarning = true) => {
    set(state => ({
      showingWarning: {
        ...state.showingWarning,
        [chatId]: isWarning
      },
      activeChats: {
        ...state.activeChats,
        [chatId]: {
          ...(state.activeChats[chatId] || {}),
          warningTime: isWarning ? new Date().toISOString() : null
        }
      }
    }));
  },
  
  // Deactivate a chat
  deactivateChat: (chatId) => {
    set(state => {
      const chat = state.activeChats[chatId];
      if (!chat) return state;
      
      return {
        activeChats: {
          ...state.activeChats,
          [chatId]: {
            ...chat,
            status: 'archived',
            isReadOnly: true
          }
        },
        showingWarning: {
          ...state.showingWarning,
          [chatId]: false
        }
      };
    });
  },
  
  // Check if chat is in warning period (10 minutes before deactivation)
  isInWarningPeriod: (chatId) => {
    const state = get();
    const chat = state.activeChats[chatId];
    
    if (!chat || !chat.closingTime) return false;
    
    const closingTime = new Date(chat.closingTime).getTime();
    const now = Date.now();
    const tenMinutesMs = 10 * 60 * 1000;
    
    return closingTime - now <= tenMinutesMs && closingTime > now;
  },
  
  // Check if chat is expired
  isExpired: (chatId) => {
    const state = get();
    const chat = state.activeChats[chatId];
    
    if (!chat || !chat.closingTime) return false;
    
    const closingTime = new Date(chat.closingTime).getTime();
    const now = Date.now();
    
    return now >= closingTime;
  },
  
  // Calculate time remaining until deactivation
  getTimeRemaining: (chatId) => {
    const state = get();
    const chat = state.activeChats[chatId];
    
    if (!chat || !chat.closingTime) return null;
    
    const closingTime = new Date(chat.closingTime).getTime();
    const now = Date.now();
    const diff = closingTime - now;
    
    if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { expired: false, hours, minutes, seconds };
  }
}));

export default useChatLifecycleStore;
