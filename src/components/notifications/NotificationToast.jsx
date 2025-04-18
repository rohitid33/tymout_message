import React from 'react';
import useNotificationStore from '../../stores/useNotificationStore';

const NOTIF_COLORS = {
  info: '#2196f3',
  success: '#4caf50',
  warning: '#ffc107',
  error: '#f44336',
};

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="notification-toast-container">
      {notifications.slice(-3).map((notif) => (
        <div
          key={notif.id}
          className={`notification-toast notification-${notif.type}`}
          style={{ borderLeft: `4px solid ${NOTIF_COLORS[notif.type] || '#2196f3'}` }}
        >
          <span className="toast-message">{notif.message}</span>
          <button className="toast-close" onClick={() => removeNotification(notif.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
