import React from 'react';
import '../../styles/ChatCategoryTabs.css';

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'table', label: 'Tables' },
  { key: 'circle', label: 'Circles' },
  { key: 'private', label: 'Private' }
];

const ChatCategoryTabs = ({ selectedCategory, onChange, counts = {} }) => (
  <div className="wa-category-tabs" role="tablist" aria-label="Chat Categories">
    {CATEGORY_OPTIONS.map(opt => (
      <button
        key={opt.key}
        className={`category-tab${selectedCategory === opt.key ? ' active' : ''}`}
        onClick={() => onChange(opt.key)}
        role="tab"
        aria-selected={selectedCategory === opt.key}
        aria-controls={`tab-panel-${opt.key}`}
        tabIndex={selectedCategory === opt.key ? 0 : -1}
      >
        {opt.label}
        {counts[opt.key] > 0 && (
          <span className="tab-count">{counts[opt.key]}</span>
        )}
      </button>
    ))}
  </div>
);

export default ChatCategoryTabs;
