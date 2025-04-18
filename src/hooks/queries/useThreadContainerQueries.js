/**
 * Thread Container Queries
 * 
 * React Query hooks for chat container components data fetching and mutations.
 * Following our state management standards (Rule #3):
 * - Using React Query for server state
 * - Proper caching and background refetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import messagingService from '../../services/messagingService';
import messageWebSocketService from '../../services/messageWebSocketService';

/**
 * Hook to fetch thread info including name, type, and other metadata
 * @param {string} threadId - Thread ID
 */
export const useThreadInfo = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useThreadInfo');
  }

  return useQuery({
    queryKey: ['threadInfo', threadId],
    queryFn: () => messagingService.getThreadInfo(threadId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!threadId,
  });
};

/**
 * Hook to fetch thread status information including closing time
 * @param {string} threadId - Thread ID
 */
export const useThreadStatusInfo = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useThreadStatusInfo');
  }

  const queryClient = useQueryClient();

  // Subscribe to WebSocket events for updates
  React.useEffect(() => {
    if (!threadId) return;

    // Handle chat extended event
    const unsubscribeChatExtended = messageWebSocketService.on('chatExtended', (data) => {
      if (data.threadId === threadId) {
        queryClient.invalidateQueries({ queryKey: ['threadStatusInfo', threadId] });
      }
    });

    return () => {
      unsubscribeChatExtended();
    };
  }, [threadId, queryClient]);

  return useQuery({
    queryKey: ['threadStatusInfo', threadId],
    queryFn: () => messagingService.getThreadStatusInfo(threadId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!threadId,
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes to keep countdown accurate
  });
};

/**
 * Hook to fetch time extension history for a thread
 * @param {string} threadId - Thread ID
 */
export const useTimeExtensionHistory = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useTimeExtensionHistory');
  }

  return useQuery({
    queryKey: ['timeExtensionHistory', threadId],
    queryFn: () => messagingService.getTimeExtensionHistory(threadId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!threadId,
  });
};

/**
 * Hook to fetch member online status for a thread
 * @param {string} threadId - Thread ID
 */
export const useMemberOnlineStatus = (threadId) => {
  if (!threadId) {
    throw new Error('Thread ID is required for useMemberOnlineStatus');
  }

  const queryClient = useQueryClient();

  // Subscribe to WebSocket events for member status updates
  React.useEffect(() => {
    if (!threadId) return;

    // Request initial status update
    messageWebSocketService.requestMemberStatusUpdates(threadId);

    // Handle member status updates
    const unsubscribeMemberStatus = messageWebSocketService.on('memberStatus', (data) => {
      if (data.threadId === threadId) {
        queryClient.setQueryData(['memberOnlineStatus', threadId], data.members);
      }
    });

    // Handle member joined/left events
    const unsubscribeMemberJoined = messageWebSocketService.on('memberJoined', (data) => {
      if (data.threadId === threadId) {
        queryClient.invalidateQueries({ queryKey: ['threadMembers', threadId] });
        queryClient.invalidateQueries({ queryKey: ['memberOnlineStatus', threadId] });
      }
    });

    const unsubscribeMemberLeft = messageWebSocketService.on('memberLeft', (data) => {
      if (data.threadId === threadId) {
        queryClient.invalidateQueries({ queryKey: ['threadMembers', threadId] });
        queryClient.invalidateQueries({ queryKey: ['memberOnlineStatus', threadId] });
      }
    });

    return () => {
      unsubscribeMemberStatus();
      unsubscribeMemberJoined();
      unsubscribeMemberLeft();
    };
  }, [threadId, queryClient]);

  return useQuery({
    queryKey: ['memberOnlineStatus', threadId],
    queryFn: () => messagingService.getMemberOnlineStatus(threadId),
    staleTime: 1000 * 30, // 30 seconds
    cacheTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!threadId,
    refetchInterval: 1000 * 60, // Refresh every minute
  });
};

/**
 * Hook to toggle chat mode between group-chat and announcements-only
 * Modified to support chat container components with better optimistic updates
 */
export const useToggleChatMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, mode }) => messagingService.setChatMode(threadId, mode),
    onMutate: async ({ threadId, mode }) => {
      // Cancel related queries
      await queryClient.cancelQueries({ queryKey: ['threadInfo', threadId] });

      // Snapshot previous value
      const previousThreadInfo = queryClient.getQueryData(['threadInfo', threadId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['threadInfo', threadId], old => {
        return {
          ...old,
          chatMode: mode
        };
      });

      return { previousThreadInfo };
    },
    onError: (err, { threadId }, context) => {
      // If mutation fails, revert to previous value
      if (context?.previousThreadInfo) {
        queryClient.setQueryData(['threadInfo', threadId], context.previousThreadInfo);
      }
    },
    onSettled: (data, error, { threadId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['threadInfo', threadId] });
    }
  });
};

/**
 * Enhanced hook to extend chat period with improved UX
 */
export const useExtendChatPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, hours }) => messagingService.extendChatPeriod(threadId, hours),
    onMutate: async ({ threadId, hours }) => {
      // Cancel related queries
      await queryClient.cancelQueries({ queryKey: ['threadStatusInfo', threadId] });

      // Snapshot previous status
      const previousStatusInfo = queryClient.getQueryData(['threadStatusInfo', threadId]);

      // Optimistically update closing time
      queryClient.setQueryData(['threadStatusInfo', threadId], old => {
        if (!old || !old.closingTime) return old;

        const newClosingTime = new Date(new Date(old.closingTime).getTime() + hours * 60 * 60 * 1000).toISOString();
        
        return {
          ...old,
          closingTime: newClosingTime,
          timeExtensions: [
            ...(old.timeExtensions || []),
            {
              extendedBy: 'currentUser', // This would come from auth context in a real app
              extendedAt: new Date().toISOString(),
              hoursAdded: hours
            }
          ]
        };
      });

      return { previousStatusInfo };
    },
    onError: (err, { threadId }, context) => {
      // If mutation fails, revert to previous value
      if (context?.previousStatusInfo) {
        queryClient.setQueryData(['threadStatusInfo', threadId], context.previousStatusInfo);
      }
    },
    onSettled: (data, error, { threadId }) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['threadStatusInfo', threadId] });
      queryClient.invalidateQueries({ queryKey: ['timeExtensionHistory', threadId] });
    }
  });
};

/**
 * Hook to handle all container-related data subscription
 * Sets up efficient real-time data handling following best practices
 */
export const useContainerSubscription = (threadId, isActive) => {
  React.useEffect(() => {
    if (!threadId || !isActive) return;

    // Subscribe to thread updates
    messageWebSocketService.subscribeToThread(threadId);

    return () => {
      if (threadId) {
        // Unsubscribe when component unmounts or thread changes
        messageWebSocketService.unsubscribeFromThread(threadId);
      }
    };
  }, [threadId, isActive]);
};

import React from 'react';
