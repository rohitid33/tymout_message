/**
 * Messaging Store
 * 
 * Zustand store for managing client-side UI state for messaging.
 * Following our state management standards, this handles UI state separately from server state.
 */

import { create } from 'zustand';

const useMessagingStore = create((set) => ({
  // Current active chat/thread
  activeThreadId: null,
  setActiveThreadId: (threadId) => set({ activeThreadId: threadId }),
  
  // Chat mode state (group-chat or announcements-only)
  chatMode: 'group-chat',
  setChatMode: (mode) => set({ chatMode: mode }),
  
  // UI preferences
  uiPreferences: {
    showMemberList: true,
    sound: true,
    desktopNotifications: true,
    theme: 'light',
  },
  updateUiPreferences: (preferences) => 
    set((state) => ({ 
      uiPreferences: { ...state.uiPreferences, ...preferences } 
    })),
  
  // Message input state
  draftMessages: {}, // Key is threadId, value is message draft
  setDraftMessage: (threadId, message) => 
    set((state) => ({ 
      draftMessages: { ...state.draftMessages, [threadId]: message } 
    })),
  
  // Message UI state
  messageUIState: {
    expandedMessages: [],
    selectedMessages: [],
  },
  toggleExpandMessage: (messageId) => 
    set((state) => {
      const expandedMessages = state.messageUIState.expandedMessages.includes(messageId)
        ? state.messageUIState.expandedMessages.filter(id => id !== messageId)
        : [...state.messageUIState.expandedMessages, messageId];
      
      return { 
        messageUIState: {
          ...state.messageUIState,
          expandedMessages,
        }
      };
    }),
  
  // Typing indicators
  typingUsers: {}, // Key is threadId, value is array of user ids
  setTypingUsers: (threadId, users) => 
    set((state) => ({ 
      typingUsers: { ...state.typingUsers, [threadId]: users } 
    })),
  
  // UI filters for message lists
  filters: {
    tableChatsOnly: false,
    unreadOnly: false,
    search: '',
  },
  setFilters: (filters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    })),
  
  // Reset all state
  resetState: () => set({
    activeThreadId: null,
    chatMode: 'group-chat',
    draftMessages: {},
    typingUsers: {},
    filters: {
      tableChatsOnly: false,
      unreadOnly: false,
      search: '',
    },
    // Preserve user preferences when resetting state
    uiPreferences: useMessagingStore.getState().uiPreferences,
  }),
}));

export default useMessagingStore;
