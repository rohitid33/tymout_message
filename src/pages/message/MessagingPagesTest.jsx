/**
 * Messaging Pages Test Component
 * 
 * Enhanced test harness for the message index and detail pages with
 * controls to toggle between different data states and direct navigation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import MessageIndexPage from './MessageIndexPage';
import MessageDetailPage from './MessageDetailPage';

import { getMockThreadList, getMockThreadSummary, getMockUnreadCount, mockEmptyThreadList } from '../../@data/mockChatThreads';
import { FiArrowLeft, FiSettings, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiUsers } from 'react-icons/fi';

// Create a custom QueryClient that will use our mock data
const createTestQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: Infinity, // Prevent auto-refetching during testing
      },
    },
  });

  // Pre-populate query cache with mock data for all thread states
  queryClient.setQueryData(['chatThreads', { page: 1, limit: 20, sortBy: 'lastActivity', sortOrder: 'desc', filter: 'active' }], getMockThreadList());
  queryClient.setQueryData(['chatThreads', { page: 1, limit: 20, sortBy: 'lastActivity', sortOrder: 'desc', filter: 'archived' }], getMockThreadList('archived'));
  queryClient.setQueryData(['chatThreads', { page: 1, limit: 20, sortBy: 'lastActivity', sortOrder: 'desc', filter: 'all' }], getMockThreadList('all'));
  
  // Set up thread summaries for all test threads
  ['thread-1', 'thread-2', 'thread-3', 'thread-4', 'thread-5'].forEach(threadId => {
    queryClient.setQueryData(['threadSummary', threadId], getMockThreadSummary(threadId));
  });
  
  queryClient.setQueryData(['unreadCount'], getMockUnreadCount());

  return queryClient;
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${type}`} style={toastStyle(type)}>
      {type === 'success' && <FiCheckCircle />}
      {type === 'error' && <FiAlertTriangle />}
      <span>{message}</span>
      <button onClick={onClose} style={toastCloseStyle}>×</button>
    </div>
  );
};

// Main test component that wraps the router
const MessagingPagesTest = () => {
  const [queryClient] = useState(() => createTestQueryClient());
  return (
    <div className="messaging-pages-test" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/messages" />} />
            <Route path="/messages" element={<MessageIndexPage />} />
            <Route path="/messages/:threadId" element={<MessageDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

// Main content component that has access to routing hooks


// Simple redirect component
const Navigate = ({ to }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
};

// 404 component
const NotFound = () => (
  <div style={notFoundStyle}>
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for doesn't exist.</p>
    <Link to="/messages" style={linkStyle}>Go to Messages</Link>
  </div>
);











const controlGroupStyle = {
  marginBottom: '16px',
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #CBD5E0',
  marginTop: '4px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '8px',
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  color: 'white',
};

const threadButtonsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px',
};

const threadButtonStyle = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #E2E8F0',
  cursor: 'pointer',
  fontSize: '14px',
};

const documentationStyle = {
  marginTop: '16px',
  padding: '12px',
  backgroundColor: '#EDF2F7',
  borderRadius: '4px',
};

const listStyle = {
  paddingLeft: '20px',
  marginTop: '8px',
};

const notFoundStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '2rem',
  textAlign: 'center',
};

const linkStyle = {
  color: '#3182CE',
  textDecoration: 'none',
  marginTop: '16px',
  padding: '8px 16px',
  backgroundColor: '#EBF8FF',
  borderRadius: '4px',
};

const toastStyle = (type) => ({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  padding: '12px 16px',
  borderRadius: '4px',
  backgroundColor: type === 'success' ? '#C6F6D5' : '#FED7D7',
  color: type === 'success' ? '#2F855A' : '#C53030',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: 1000,
});

const toastCloseStyle = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  marginLeft: '8px',
  cursor: 'pointer',
  color: 'inherit',
};

export default MessagingPagesTest;
