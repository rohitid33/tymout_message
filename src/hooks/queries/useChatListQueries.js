/**
 * Chat List Query Hooks
 * 
 * React Query hooks for chat list data fetching and state management
 * in the Tymout messaging platform.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mockApiService from '../../services/mockApiService';
import chatListService from '../../services/chatListService';
import { useOptimisticMutation } from '../useOptimisticMutations';

/**
 * Hook for fetching chat thread list
 * @param {Object} options Query options
 * @returns {Object} Query result
 */
export const useChatThreadsQuery = (options = {}) => {
  const queryKey = ['chatThreads', options];
  
  return useQuery({
    queryKey,
    queryFn: () => mockApiService.getChatThreads(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook for searching chat threads
 * @param {string} query Search query
 * @param {Object} options Additional options
 * @returns {Object} Query result
 */
export const useChatThreadsSearch = (query, options = {}) => {
  return useQuery({
    queryKey: ['chatThreadsSearch', query, options],
    queryFn: () => mockApiService.getChatThreads({ searchQuery: query, ...options }),
    enabled: !!query && query.length >= 2, // Only search when query is at least 2 chars
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching thread summary
 * @param {string} threadId Thread ID
 * @returns {Object} Query result
 */
export const useThreadSummaryQuery = (threadId) => {
  return useQuery({
    queryKey: ['threadSummary', threadId],
    queryFn: () => chatListService.getThreadSummary(threadId),
    enabled: !!threadId,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook for fetching unread thread count
 * @returns {Object} Query result
 */
export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => mockApiService.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // 1 minute
  });
};

/**
 * Hook for marking a thread as read with optimistic updates
 * @returns {Object} Mutation result
 */
export const useMarkThreadAsReadMutation = () => {
  return useOptimisticMutation({
    mutationFn: (threadId) => chatListService.markThreadAsRead(threadId),
    queryKey: ['chatThreads'],
    getOptimisticData: (oldData, threadId) => {
      if (!oldData) return oldData;
      
      // Update threads to mark the specified thread as read
      return {
        ...oldData,
        data: oldData.data.map(thread => 
          thread.id === threadId 
            ? { ...thread, unreadCount: 0, hasUnread: false } 
            : thread
        )
      };
    },
    entityName: 'thread read status'
  });
};

/**
 * Hook for archiving a thread with optimistic updates
 * @returns {Object} Mutation result
 */
export const useArchiveThreadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (threadId) => chatListService.archiveThread(threadId),
    
    onMutate: async (threadId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chatThreads'] });
      
      // Snapshot the previous value
      const previousThreads = queryClient.getQueryData(['chatThreads']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['chatThreads'], (old) => {
        if (!old) return old;
        
        return {
          ...old,
          data: old.data.map(thread => 
            thread.id === threadId 
              ? { ...thread, isArchived: true } 
              : thread
          )
        };
      });
      
      return { previousThreads };
    },
    
    // If mutation fails, roll back to the previous value
    onError: (err, threadId, context) => {
      if (context?.previousThreads) {
        queryClient.setQueryData(['chatThreads'], context.previousThreads);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

/**
 * Hook for creating a new thread
 * @returns {Object} Mutation result
 */
export const useCreateThreadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (threadData) => chatListService.createThread(threadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    }
  });
};
