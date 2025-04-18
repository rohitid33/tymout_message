/**
 * Optimistic Mutation Hooks
 * 
 * Provides a consistent approach to implement optimistic updates
 * across the Tymout messaging platform, following the project's
 * React Query and Zustand architecture.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { handleApiError } from '../utils/errorHandling';

/**
 * Base hook for creating optimistic mutations
 * 
 * @param {Object} options Configuration options
 * @param {Function} options.mutationFn The mutation function to execute
 * @param {string} options.queryKey The query key to invalidate after mutation
 * @param {Function} options.getOptimisticData Function that returns optimistically updated data
 * @param {Function} options.rollbackFn Optional function to handle rollback on failure
 * @param {string} options.entityName Name of the entity being modified for error messages
 * @returns {Object} Mutation object with execute method
 */
export const useOptimisticMutation = ({
  mutationFn,
  queryKey, 
  getOptimisticData,
  rollbackFn,
  entityName = 'data'
}) => {
  const queryClient = useQueryClient();
  
  // Handle the underlying mutation with React Query
  const mutation = useMutation({
    mutationFn,
    
    // Before mutation starts, apply optimistic update
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value for potential rollback
      const previousData = queryClient.getQueryData(queryKey);
      
      try {
        // Update with optimistic data
        if (getOptimisticData) {
          queryClient.setQueryData(queryKey, (oldData) => 
            getOptimisticData(oldData, variables)
          );
        }
        
        // Return context for rollback
        return { previousData, variables };
      } catch (error) {
        console.error('Error applying optimistic update:', error);
        return { previousData, variables, error };
      }
    },
    
    // On error, roll back to the previous value
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      // Call custom rollback function if provided
      if (rollbackFn) {
        rollbackFn(error, variables, context);
      }
      
      // Handle the error through our central error handler
      handleApiError(error, {
        silent: false,
        onError: (errorInfo) => {
          console.error(`Error updating ${entityName}:`, errorInfo);
        }
      });
    },
    
    // After success or error, invalidate the query to refetch fresh data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Wrapper function with improved error handling
  const execute = useCallback(
    async (variables) => {
      try {
        return await mutation.mutateAsync(variables);
      } catch (error) {
        // Error already handled in onError, but we need to propagate it
        throw error;
      }
    },
    [mutation]
  );

  return {
    ...mutation,
    execute
  };
};

/**
 * Hook for optimistically updating member data
 */
export const useOptimisticMemberMutation = (threadId) => {
  return useOptimisticMutation({
    queryKey: ['members', threadId],
    entityName: 'member',
    // Additional implementation details specific to member mutations
  });
};

/**
 * Hook for optimistically updating chat mode
 */
export const useOptimisticChatModeMutation = (threadId) => {
  return useOptimisticMutation({
    queryKey: ['thread', threadId],
    entityName: 'chat mode',
    getOptimisticData: (oldData, { mode }) => {
      return {
        ...oldData,
        chatMode: mode
      };
    }
  });
};

/**
 * Hook for optimistically extending chat period
 */
export const useOptimisticExtendChatPeriod = (threadId) => {
  return useOptimisticMutation({
    queryKey: ['threadStatusInfo', threadId],
    entityName: 'chat period',
    getOptimisticData: (oldData, { hours }) => {
      if (!oldData || !oldData.closingTime) return oldData;
      
      const newClosingTime = new Date(
        new Date(oldData.closingTime).getTime() + hours * 60 * 60 * 1000
      ).toISOString();
      
      return { 
        ...oldData, 
        closingTime: newClosingTime 
      };
    }
  });
};

/**
 * Hook for optimistically sending messages
 */
export const useOptimisticSendMessage = (threadId) => {
  return useOptimisticMutation({
    queryKey: ['messages', threadId],
    entityName: 'message',
    getOptimisticData: (oldData, { message }) => {
      if (!oldData || !oldData.pages) return oldData;
      
      // Create optimistic message with temporary ID
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: message.content,
        sender: {
          id: message.senderId,
          name: 'Current User' // Will be replaced with actual data on refetch
        },
        timestamp: new Date().toISOString(),
        status: 'sending',
        attachments: message.attachments || [],
        isOptimistic: true
      };
      
      // Add to first page of results (most recent messages)
      const newPages = [...oldData.pages];
      newPages[0] = {
        ...newPages[0],
        data: [optimisticMessage, ...newPages[0].data]
      };
      
      return {
        ...oldData,
        pages: newPages
      };
    }
  });
};

/**
 * Factory function to create custom optimistic mutation hooks
 * 
 * @param {Object} config Base configuration for the mutation
 * @returns {Function} Custom hook function
 */
export const createOptimisticMutationHook = (config) => {
  return (customOptions = {}) => useOptimisticMutation({
    ...config,
    ...customOptions
  });
};
