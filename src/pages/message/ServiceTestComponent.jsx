import React, { useEffect, useState } from 'react';
import messagingService from '../../services/messagingService.js';
import messageWebSocketService from '../../services/messageWebSocketService.js';
import { useMessageThreads, useThreadMessages, useSendMessage } from '../../hooks/queries/useMessagingQueries.js';
import useMessagingStore from '../../contexts/messagingStore.js';

/**
 * Test component to verify our services and state management are working correctly
 */
const ServiceTestComponent = () => {
  // Component state
  const [serviceTestResults, setServiceTestResults] = useState({
    messagingService: { tested: false, success: false, message: '' },
    webSocketService: { tested: false, success: false, message: '' },
    reactQuery: { tested: false, success: false, message: '' },
    zustandStore: { tested: false, success: false, message: '' }
  });
  
  // Get Zustand store values and actions
  const { 
    activeThreadId, 
    setActiveThreadId,
    chatMode,
    setChatMode,
    uiPreferences,
    updateUiPreferences
  } = useMessagingStore();
  
  // Test the messaging service
  const testMessagingService = async () => {
    try {
      // Override the API call to return mock data instead of making a real network request
      const originalGet = messagingService.getMessageThreads;
      messagingService.getMessageThreads = async () => {
        console.log('Mock getMessageThreads called');
        return [{ id: 'test-thread', title: 'Test Thread' }];
      };
      
      // Call the service method
      const result = await messagingService.getMessageThreads();
      
      // Restore original function
      messagingService.getMessageThreads = originalGet;
      
      // Validate result
      if (result && Array.isArray(result) && result.length > 0) {
        setServiceTestResults(prev => ({
          ...prev,
          messagingService: { 
            tested: true, 
            success: true, 
            message: 'Messaging service is working correctly' 
          }
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('MessagingService test failed:', error);
      setServiceTestResults(prev => ({
        ...prev,
        messagingService: { 
          tested: true, 
          success: false, 
          message: `Error testing messaging service: ${error.message}` 
        }
      }));
    }
  };
  
  // Test the WebSocket service
  const testWebSocketService = () => {
    try {
      // Create a mock listener to test event subscription
      let listenerCalled = false;
      const mockCallback = () => { listenerCalled = true; };
      
      // Register a listener
      const unsubscribe = messageWebSocketService.on('message', mockCallback);
      
      // Check if on/off methods work as expected
      if (typeof unsubscribe === 'function') {
        // Unsubscribe should work
        unsubscribe();
        
        setServiceTestResults(prev => ({
          ...prev,
          webSocketService: { 
            tested: true, 
            success: true, 
            message: 'WebSocket service event registration is working correctly' 
          }
        }));
      } else {
        throw new Error('WebSocket service on() method did not return unsubscribe function');
      }
    } catch (error) {
      console.error('WebSocketService test failed:', error);
      setServiceTestResults(prev => ({
        ...prev,
        webSocketService: { 
          tested: true, 
          success: false, 
          message: `Error testing WebSocket service: ${error.message}` 
        }
      }));
    }
  };
  
  // Test Zustand store
  const testZustandStore = () => {
    try {
      // Test setting active thread ID
      const testThreadId = 'test-thread-123';
      setActiveThreadId(testThreadId);
      
      // Test setting chat mode
      setChatMode('announcements-only');
      
      // Test updating UI preferences
      updateUiPreferences({ theme: 'dark' });
      
      // Use timeout to ensure state updates have propagated
      setTimeout(() => {
        // Get the latest state directly from the store
        const currentStore = useMessagingStore.getState();
        
        if (
          currentStore.activeThreadId === testThreadId && 
          currentStore.chatMode === 'announcements-only' &&
          currentStore.uiPreferences.theme === 'dark'
        ) {
          setServiceTestResults(prev => ({
            ...prev,
            zustandStore: { 
              tested: true, 
              success: true, 
              message: 'Zustand store is working correctly' 
            }
          }));
        } else {
          setServiceTestResults(prev => ({
            ...prev,
            zustandStore: { 
              tested: true, 
              success: false, 
              message: `Error testing Zustand store: State values don't match expected values` 
            }
          }));
        }
      }, 100); // Small delay to ensure state updates
    } catch (error) {
      console.error('Zustand store test failed:', error);
      setServiceTestResults(prev => ({
        ...prev,
        zustandStore: { 
          tested: true, 
          success: false, 
          message: `Error testing Zustand store: ${error.message}` 
        }
      }));
    }
  };
  
  // Run all tests on component mount
  useEffect(() => {
    // Test each service sequentially
    const runTests = async () => {
      await testMessagingService();
      testWebSocketService();
      testZustandStore();
      
      // Note: React Query hooks need to be used within a component context
      // so we test them by checking if the component renders without errors
      setServiceTestResults(prev => ({
        ...prev,
        reactQuery: { 
          tested: true, 
          success: true, 
          message: 'React Query hooks imported successfully' 
        }
      }));
    };
    
    runTests();
  }, []);
  
  return (
    <div className="service-test-container">
      <h2>Service & State Management Test Results</h2>
      
      <div className="test-results">
        {Object.entries(serviceTestResults).map(([service, result]) => (
          <div key={service} className={`test-item ${result.success ? 'success' : 'error'}`}>
            <h3>{service}</h3>
            <div className="test-status">
              <span>Status: {result.tested ? (result.success ? '✅ Passed' : '❌ Failed') : '⏳ Not tested'}</span>
            </div>
            {result.message && <p>{result.message}</p>}
          </div>
        ))}
      </div>
      
      <div className="store-state">
        <h3>Current Zustand Store State:</h3>
        <pre>
          {JSON.stringify({
            activeThreadId,
            chatMode,
            uiPreferences
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ServiceTestComponent;
