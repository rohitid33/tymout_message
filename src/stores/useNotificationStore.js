import create from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [], // { id, type, message, timestamp, read }
  preferences: {
    newMessage: true,
    mention: true,
    system: true,
    member: true,
    error: true
  },
  addNotification: (notif) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notif, id: Date.now(), read: false, timestamp: new Date().toISOString() }
    ]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  setPreferences: (prefs) => set((state) => ({
    preferences: { ...state.preferences, ...prefs }
  })),
}));

export default useNotificationStore;
