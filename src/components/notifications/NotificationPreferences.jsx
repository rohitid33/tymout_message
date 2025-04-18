import React from 'react';
import useNotificationStore from '../../stores/useNotificationStore';

const NOTIF_TYPES = [
  { key: 'newMessage', label: 'New Messages' },
  { key: 'mention', label: 'Mentions' },
  { key: 'system', label: 'System Events' },
  { key: 'member', label: 'Member Events' },
  { key: 'error', label: 'Errors' },
];

const NotificationPreferences = () => {
  const { preferences, setPreferences } = useNotificationStore();

  const handleToggle = (key) => {
    setPreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="notification-preferences">
      <h3>Notification Preferences</h3>
      <ul>
        {NOTIF_TYPES.map(({ key, label }) => (
          <li key={key}>
            <label>
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={() => handleToggle(key)}
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPreferences;
