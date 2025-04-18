/**
 * Empty Search Results Component
 * 
 * Displays when search returns no results.
 * Guides the user with suggestions on how to improve their search.
 */

import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { createAccessibleClickProps } from '../../../utils/accessibility';
import '../../../styles/EmptyStates.css';

const EmptySearchResults = ({ query, onClear }) => {
  return (
    <div className="empty-state-container search-results" data-testid="empty-search-results">
      <div className="empty-state-icon">
        <FiSearch size={48} />
      </div>
      
      <h2 className="empty-state-title">No results found</h2>
      
      <p className="empty-state-description">
        We couldn't find any messages matching "<strong>{query}</strong>".
      </p>
      
      <div className="empty-state-suggestions">
        <h3>Suggestions:</h3>
        <ul>
          <li>Check the spelling of your search term</li>
          <li>Try using fewer or different keywords</li>
          <li>Search for a partial name or phrase</li>
        </ul>
      </div>
      
      <button 
        className="empty-state-action secondary"
        onClick={onClear}
        {...createAccessibleClickProps(onClear)}
      >
        <FiX aria-hidden="true" />
        Clear search
      </button>
    </div>
  );
};

export default EmptySearchResults;
