/**
 * Messaging Queries
 * 
 * React Query hooks for messaging data fetching and mutations.
 * Following our state management standards, these queries handle all server state.
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import mockApiService from '../../services/mockApiService';

/**
 * Hook to fetch and manage message threads
 */
export const useMessageThreads = () => {
  return useQuery({
    queryKey: ['messageThreads'],
    queryFn: mockApiService.getChatThreads,
    staleTime: 1000 * 60 * 1, // 1 minute
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch and manage messages for a specific thread with pagination
 * @param {string} threadId - Thread ID
 */
export const useMessagesQuery = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useMessagesQuery');
  }
  
  return useInfiniteQuery({
    queryKey: ['messages', threadId],
    queryFn: ({ pageParam = 1 }) => mockApiService.getThreadMessages(threadId),
    getNextPageParam: (lastPage) => lastPage.meta?.nextPage || undefined,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 15 // 15 seconds (for real-time feel)
  });
};

/**
 * Hook to fetch and manage messages for a specific thread
 * @param {string} threadId - Thread ID
 */
export const useThreadMessages = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useThreadMessages');
  }

  return useQuery({
    queryKey: ['threadMessages', threadId],
    queryFn: () => mockApiService.getThreadMessages(threadId),
    staleTime: 1000 * 30, // 30 seconds
    cacheTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!threadId,
  });
};

/**
 * Hook to send a message to a thread
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, content }) => messagingService.sendMessage(threadId, content),
    // Optimistic update pattern for better UX
    onMutate: async ({ threadId, content }) => {
      // Cancel outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['threadMessages', threadId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['threadMessages', threadId]);

      // Optimistically add the new message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        threadId,
        content,
        senderId: 'currentUser', // This would come from auth context in a real app
        status: 'sending',
        timestamp: new Date().toISOString(),
        isOptimistic: true, // Flag to identify optimistic updates
      };

      queryClient.setQueryData(['threadMessages', threadId], old => {
        return old ? [...old, optimisticMessage] : [optimisticMessage];
      });

      // Update thread list to show the latest message
      queryClient.setQueryData(['messageThreads'], old => {
        if (!old) return old;
        
        return old.map(thread => {
          if (thread.id === threadId) {
            return {
              ...thread,
              lastMessage: {
                content: content.text || content,
                timestamp: new Date().toISOString(),
              },
              unreadCount: 0,
            };
          }
          return thread;
        });
      });

      return { previousMessages };
    },
    onError: (err, { threadId }, context) => {
      // Revert to previous state on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['threadMessages', threadId], context.previousMessages);
      }
    },
    onSettled: (data, error, { threadId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['threadMessages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['messageThreads'] });
    },
  });
};

/**
 * Hook to mark a thread as read
 */
export const useMarkThreadAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId) => messagingService.markThreadAsRead(threadId),
    onSuccess: (data, threadId) => {
      // Update thread in cache to reflect read status
      queryClient.setQueryData(['messageThreads'], old => {
        if (!old) return old;
        
        return old.map(thread => {
          if (thread.id === threadId) {
            return {
              ...thread,
              unreadCount: 0,
            };
          }
          return thread;
        });
      });
    },
  });
};

/**
 * Hook to extend the active period of a chat
 */
export const useExtendChatPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, hours }) => messagingService.extendChatPeriod(threadId, hours),
    onSuccess: (data, { threadId }) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['threadMessages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['messageThreads'] });
    },
  });
};

/**
 * Hook to send file attachments
 */
export const useSendAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, file, metadata }) => {
      // In a real implementation, this would upload to a server
      // For now, we'll simulate it with a promise
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate a successful upload response
          resolve({
            id: `attachment-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            threadId
          });
        }, 500); // Simulate network delay
      });
    },
    onSuccess: (data, { threadId }) => {
      // Invalidate related queries to refresh attachment lists
      queryClient.invalidateQueries({ queryKey: ['threadAttachments', threadId] });
    },
  });
};

/**
 * Hook to toggle the chat mode
 */
export const useSetChatMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, mode }) => messagingService.setChatMode(threadId, mode),
    onSuccess: (data, { threadId }) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['threadMessages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['messageThreads'] });
    },
  });
};

/**
 * Join Request Queries
 */

/**
 * Hook to fetch join requests for a thread (admin view)
 * @param {string} threadId - Thread ID
 */
export const useThreadJoinRequests = (threadId) => {
  return useQuery({
    queryKey: ['joinRequests', threadId],
    queryFn: () => messagingService.getJoinRequests(threadId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!threadId,
  });
};

/**
 * Hook to handle responding to a join request
 */
export const useRespondToJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, threadId, accept, message }) => 
      messagingService.respondToJoinRequest(requestId, threadId, accept, message),
    onSuccess: (data, { threadId }) => {
      // Invalidate join requests and members list queries
      queryClient.invalidateQueries({ queryKey: ['joinRequests', threadId] });
      queryClient.invalidateQueries({ queryKey: ['threadMembers', threadId] });
    },
  });
};

/**
 * Hook to add comment to join request conversation thread
 */
export const useAddJoinRequestComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, threadId, content }) => 
      messagingService.addJoinRequestComment(requestId, threadId, content),
    onSuccess: (data, { threadId }) => {
      // Invalidate join requests to refresh conversation
      queryClient.invalidateQueries({ queryKey: ['joinRequests', threadId] });
    },
  });
};

/**
 * Member List Queries
 */

/**
 * Hook to fetch members for a thread
 * @param {string} threadId - Thread ID
 */
export const useThreadMembers = (threadId) => {
  return useQuery({
    queryKey: ['threadMembers', threadId],
    queryFn: () => mockApiService.getThreadMembers(threadId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!threadId,
  });
};

/**
 * Hook to remove a member from a thread (admin only)
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, userId }) => messagingService.removeMember(threadId, userId),
    onSuccess: (data, { threadId }) => {
      // Invalidate members list query
      queryClient.invalidateQueries({ queryKey: ['threadMembers', threadId] });
    },
  });
};

/**
 * Hook to leave a thread (for current user)
 */
export const useLeaveThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId) => messagingService.leaveThread(threadId),
    onSuccess: (data, threadId) => {
      // Invalidate threads list and members list
      queryClient.invalidateQueries({ queryKey: ['messageThreads'] });
      queryClient.invalidateQueries({ queryKey: ['threadMembers', threadId] });
    },
  });
};
