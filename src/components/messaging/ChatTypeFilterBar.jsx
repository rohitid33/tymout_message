import React from 'react';

const CHAT_TYPE_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'table', label: 'Tables' },
  { key: 'circle', label: 'Circles' },
  { key: 'private', label: 'Private' }
];

const ChatTypeFilterBar = ({ selectedType, onChange }) => (
  <div className="chat-type-filter-bar">
    {CHAT_TYPE_OPTIONS.map(option => (
      <button
        key={option.key}
        className={`type-filter-btn${selectedType === option.key ? ' active' : ''}`}
        onClick={() => onChange(option.key)}
        aria-pressed={selectedType === option.key}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default ChatTypeFilterBar;
