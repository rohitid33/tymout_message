/**
 * Error Handling Utilities
 * 
 * Provides centralized error handling for network requests and other operations
 * with environment-aware behavior that prevents console errors in test environments.
 */

// Environment detection
const isTestEnvironment = () => {
  return (
    window.location.hostname === 'localhost' || 
    window.location.pathname.includes('/test') ||
    import.meta.env.MODE === 'test'
  );
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handles API errors with environment-specific behavior
 * 
 * In test environments, prevents console errors from being displayed
 * while still allowing components to handle errors appropriately.
 * 
 * @param {Error} error - The error to handle
 * @param {Object} options - Configuration options
 * @param {boolean} options.silent - Whether to suppress all console output
 * @param {Function} options.onError - Optional callback for error handling
 * @returns {Error} The original error for further handling
 */
export const handleApiError = (error, options = {}) => {
  const { silent = false, onError = null } = options;
  
  // Extract relevant error information
  const errorInfo = {
    message: error.message || 'Unknown error occurred',
    status: error.response?.status || 0,
    data: error.response?.data || null,
    url: error.config?.url || 'unknown',
    method: error.config?.method || 'unknown'
  };
  
  // In test environments, don't log errors to console unless forced
  if (!isTestEnvironment() || !silent) {
    // Only log to console in non-test environments or when not silent
    if (error.response?.status >= 500) {
      console.error(`API Error (${errorInfo.status}): ${errorInfo.message}`, errorInfo);
    } else if (error.response?.status >= 400) {
      console.warn(`API Error (${errorInfo.status}): ${errorInfo.message}`, errorInfo);
    } else if (error.code === 'ECONNABORTED') {
      console.warn(`API Timeout: ${errorInfo.message}`, errorInfo);
    } else if (error.message === 'Network Error') {
      console.warn('Network Error: Unable to connect to the server', errorInfo);
    } else {
      console.error('Unexpected API Error:', error);
    }
  }
  
  // Call custom error handler if provided
  if (typeof onError === 'function') {
    onError(errorInfo);
  }
  
  // Format the error as an ApiError for consistent handling
  if (!(error instanceof ApiError)) {
    return new ApiError(
      errorInfo.message,
      errorInfo.status,
      errorInfo.data
    );
  }
  
  return error;
};

/**
 * Wraps async functions with error handling
 * 
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (asyncFn, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      return handleApiError(error, options);
    }
  };
};

/**
 * Creates a customized error handler for specific components
 * 
 * @param {string} componentName - The name of the component for error logging
 * @param {Object} options - Additional options for error handling
 * @returns {Function} Component-specific error handler
 */
export const createComponentErrorHandler = (componentName, options = {}) => {
  return (error) => {
    return handleApiError(error, {
      ...options,
      onError: (errorInfo) => {
        if (!isTestEnvironment() || !options.silent) {
          console.error(`Error in ${componentName}:`, errorInfo);
        }
        if (options.onError) {
          options.onError(errorInfo);
        }
      }
    });
  };
};

/**
 * Axios request interceptor that adds request IDs and timing information
 * Helps with debugging network issues
 */
export const createAxiosRequestInterceptor = (axios) => {
  return axios.interceptors.request.use((config) => {
    // Add request ID and start time for tracking
    config.metadata = {
      requestId: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now()
    };
    return config;
  });
};

/**
 * Axios response interceptor that handles errors and logs performance
 */
export const createAxiosResponseInterceptor = (axios) => {
  return axios.interceptors.response.use(
    // Success handler
    (response) => {
      const { config } = response;
      if (config.metadata) {
        const duration = Date.now() - config.metadata.startTime;
        
        // Only log performance issues in non-test environments
        if (!isTestEnvironment() && duration > 1000) {
          console.warn(`Slow API call (${duration}ms): ${config.method} ${config.url}`);
        }
      }
      return response;
    },
    // Error handler
    (error) => {
      // In test environments, we need to modify the error to prevent console logs
      if (isTestEnvironment()) {
        // Attach a flag to identify test environment errors
        error.isTestEnvironment = true;
        
        // For network errors in test environments, add a more specific message
        if (error.message === 'Network Error') {
          error.message = 'Test Environment Network Simulation: Network Error';
        }
      }
      
      // Let it propagate to be caught by the component
      return Promise.reject(error);
    }
  );
};
