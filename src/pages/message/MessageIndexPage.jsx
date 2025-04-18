/**
 * Message Index Page
 * 
 * Displays a list of chat threads with filtering, sorting, and search capabilities.
 * Implements empty states for different scenarios.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useChatThreadsQuery, 
  useUnreadCountQuery,
  useMarkThreadAsReadMutation
} from '../../hooks/queries/useChatListQueries';
import { useResponsive } from '../../utils/responsive';
import { createAccessibleClickProps } from '../../utils/accessibility';
import { announceToScreenReader } from '../../utils/accessibility';
import { FiSearch, FiPlus, FiFilter, FiInbox, FiArchive, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import '../../styles/MessageIndexPage.css';
import NotificationToast from '../../components/notifications/NotificationToast';
import ChatCategoryTabs from '../../components/messaging/ChatCategoryTabs';


// Empty state components
import EmptyThreadList from '../../components/messaging/EmptyStates/EmptyThreadList';
import EmptySearchResults from '../../components/messaging/EmptyStates/EmptySearchResults';
import EmptyArchivedThreads from '../../components/messaging/EmptyStates/EmptyArchivedThreads';

const MessageIndexPage = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  // Local state for filters and search

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchActive, setSearchActive] = useState(false);
  
  // React Query hooks for data fetching
  const { 
    data: threadListData, 
    isLoading, 
    isError,
    error,
    refetch,
    isFetching
  } = useChatThreadsQuery({
    page: currentPage,
    limit: 5, // Use smaller limit to test pagination
    sortBy,
    sortOrder: 'desc',
    searchQuery: searchActive && searchQuery.length >= 2 ? searchQuery : undefined
  });
  
  // Effect to reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchActive]);
  
  const {
    data: unreadCountData,
    isLoading: isLoadingUnreadCount
  } = useUnreadCountQuery();
  
  // Effect to auto-refetch on reconnection
  useEffect(() => {
    const handleOnline = () => {
      refetch();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [refetch]);
  
  // Mutations
  const markAsReadMutation = useMarkThreadAsReadMutation();
  
  // Handling mutation states
  const isMutating = markAsReadMutation.isLoading;
  
  // Derived state
  const threads = threadListData?.data || [];
  const totalThreads = threadListData?.meta?.total || 0;
  const totalPages = threadListData?.meta?.pages || 1;
  const totalUnread = unreadCountData?.total || 0;
  // Filter threads by category and status
  const filteredThreads = selectedCategory === 'all' ? threads : threads.filter(t => t.type === selectedCategory);
  // Tab counts
  const tabCounts = threads.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    acc['all'] = (acc['all'] || 0) + 1;
    return acc;
  }, { all: 0 });
  
  const isEmpty = filteredThreads.length === 0;
  
  // Determine if we're showing search results
  const isSearchResults = searchActive && searchQuery.length >= 2;
  
  // Display information
  const getDisplayTitle = useCallback(() => {
    if (isSearchResults) {
      return `Search Results: "${searchQuery}"`;
    }
    return 'Messages';
  }, [isSearchResults, searchQuery]);
  
  // Handle thread click
  const handleThreadClick = useCallback((threadId) => {
    // If thread has unread messages, mark as read
    const thread = threads.find(t => t.id === threadId);
    if (thread?.hasUnread) {
      markAsReadMutation.mutate(threadId);
    }
    
    // Navigate to thread detail page
    navigate(`/messages/${threadId}`);
  }, [threads, markAsReadMutation, navigate]);
  
  // Handle filter change
  const handleFilterChange = useCallback((newFilter) => {
    // Clear search when changing filters
    if (searchActive) {
      setSearchQuery('');
      setSearchActive(false);
    }
    

  }, [searchActive]);
  
  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.length >= 2) {
      setSearchActive(true);
      announceToScreenReader(`Searching for ${searchQuery}`);
      // The query param is already set via state, so this will trigger a refetch
      refetch();
    }
  }, [searchQuery, refetch]);
  
  // Handle search clear
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchActive(false);
    announceToScreenReader('Search cleared');
    // Refetch without search query
    refetch();
  }, [refetch]);
  
  // Handle create new thread
  const handleCreateThread = useCallback(() => {
    navigate('/messages/new');
  }, [navigate]);
  
  // Render thread item
  const renderThreadItem = useCallback((thread) => {
    const lastMessageTime = new Date(thread.lastActivity).toLocaleString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: true
    });
    
    return (
      <div 
        key={thread.id}
        className={`thread-item ${thread.hasUnread ? 'unread' : ''}`}
        {...createAccessibleClickProps(() => handleThreadClick(thread.id))}
        data-testid={`thread-item-${thread.id}`}
      >
        <div className="thread-avatar">
          {thread.members && thread.members[0] && thread.members[0].avatar ? (
            <img 
              src={thread.members[0].avatar} 
              alt={`${thread.members[0].name}'s avatar`} 
            />
          ) : (
            <img 
              src="/default-avatar.svg"
              alt="Default user avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        
        <div className="thread-content">
          <div className="thread-header">
            <h3 className="thread-name">
              {thread.name}
              {/* Chat status indicator */}
              {thread.status === 'active' && (
                <span className="chat-status-indicator active" aria-label="Active" title="Active" style={{ marginLeft: 8 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, background: '#4caf50', borderRadius: '50%' }}></span>
                </span>
              )}
              {thread.status === 'read-only' && (
                <span className="chat-status-indicator read-only" aria-label="Read-only" title="Read-only" style={{ marginLeft: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{ verticalAlign: 'middle' }}><path d="M6 1a2 2 0 0 1 2 2v2h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1V3a2 2 0 0 1 2-2zm1 4V3a1 1 0 1 0-2 0v2h2z" fill="#888"/></svg>
                </span>
              )}
              {thread.status === 'archived' && (
                <span className="chat-status-indicator archived" aria-label="Archived" title="Archived" style={{ marginLeft: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{ verticalAlign: 'middle' }}><path d="M2 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1H2V3zm0 2h8v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" fill="#bbb"/></svg>
                </span>
              )}
            </h3>
            <span className="thread-time">{lastMessageTime}</span>
          </div>
          
          <div className="thread-message">
            {thread.lastMessage ? (
              <>
                <span className="sender-name">
                  {thread.lastMessage.sender?.name || 'Unknown'}:
                </span>
                <span className="message-preview">
                  {thread.lastMessage.content}
                </span>
              </>
            ) : (
              <span className="no-messages">No messages yet</span>
            )}
          </div>
          
          <div className="thread-footer">
            <span className="member-count">
              {thread.memberCount} {thread.memberCount === 1 ? 'member' : 'members'}
            </span>
            
            {thread.chatMode === 'announcements-only' && (
              <span className="thread-mode">Announcements Only</span>
            )}
            
            {thread.hasUnread && (
              <span className="unread-badge" aria-label={`${thread.unreadCount} unread messages`}>
                {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }, [handleThreadClick]);
  
  // Render appropriate empty state
  const renderEmptyState = useCallback(() => {
    // If error occurred
    if (isError) {
      return (
        <div className="error-state">
          <div className="empty-state-icon error">
            <FiAlertCircle size={32} />
          </div>
          <h2>Something went wrong</h2>
          <p>{error?.message || 'An error occurred while loading your messages.'}</p>
          <button onClick={() => refetch()} className="retry-button">
            <FiRefreshCw /> Try Again
          </button>
        </div>
      );
    }
    
    // If searching with no results
    if (searchQuery && isEmpty) {
      return <EmptySearchResults query={searchQuery} onClear={handleClearSearch} />;
    }
    

    
    // Default empty state
    return <EmptyThreadList onCreateNew={handleCreateThread} />;
  }, [isError, error, refetch, searchQuery, isEmpty, handleCreateThread, handleClearSearch]);
  
  return (
    <div className="message-index-page">
      <header className="page-header">
        <h1>
          {getDisplayTitle()}
          {!isSearchResults && totalUnread > 0 && <span className="total-unread">({totalUnread})</span>}
        </h1>
        
        <div className="header-actions">
          <button 
            className="create-button"
            onClick={handleCreateThread}
            aria-label="Create new message"
          >
            <FiPlus />
            {!isMobile && <span>New Message</span>}
          </button>
        </div>
      </header>
      
      <div className="search-bar-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`search-input ${searchActive ? 'active-search' : ''}`}
              aria-label="Search messages"
              aria-busy={isFetching}
              disabled={isLoading || isFetching}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-button"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || isFetching || searchQuery.length < 2}
          >
            Search
          </button>
        </form>
      </div>
      <div className="filter-search-container">
      </div>
      
      <div className="thread-list-container">
        <ChatCategoryTabs selectedCategory={selectedCategory} onChange={setSelectedCategory} counts={tabCounts} />

        {isLoading || (isFetching && threads.length === 0) ? (
          <div className="loading-state" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Loading your messages...</p>
          </div>
        ) : isEmpty ? (
          renderEmptyState()
        ) : (
          <>
            <div className="thread-status-info">
              {isSearchResults ? (
                <div className="search-status">
                  Found {totalThreads} result{totalThreads !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              ) : (
                <div className="thread-count-status">
                  Showing {filteredThreads.length} of {totalThreads} thread{totalThreads !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            <div className="thread-list" role="list" aria-label="Message threads">
              {filteredThreads.map(renderThreadItem)}
            </div>
          </>
        )}
        
        {/* Pagination */}
        {!isEmpty && totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isFetching}
              className="pagination-button"
              aria-label="Previous page"
            >
              Previous
            </button>
            
            {totalPages <= 5 ? (
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                    disabled={isFetching}
                    aria-label={`Page ${i + 1}`}
                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            ) : (
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
            )}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isFetching}
              className="pagination-button"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageIndexPage;
