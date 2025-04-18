import React from 'react';

const STATUS_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'read-only', label: 'Read-Only' },
  { key: 'archived', label: 'Archived' }
];

const ChatStatusFilterChips = ({ selectedStatus, onChange, counts = {} }) => (
  <div className="chat-status-filter-chips" role="group" aria-label="Chat Status Filters">
    {STATUS_OPTIONS.map(opt => (
      <button
        key={opt.key}
        className={`status-chip${selectedStatus === opt.key ? ' active' : ''}`}
        onClick={() => onChange(opt.key)}
        aria-pressed={selectedStatus === opt.key}
        tabIndex={selectedStatus === opt.key ? 0 : -1}
      >
        {opt.label}
        {counts[opt.key] > 0 && (
          <span className="chip-count">{counts[opt.key]}</span>
        )}
      </button>
    ))}
  </div>
);

export default ChatStatusFilterChips;
