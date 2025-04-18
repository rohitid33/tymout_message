/**
 * Authentication Service
 * 
 * Handles authentication, authorization, and token management
 * for the Tymout platform chat functionality.
 */

import axios from 'axios';

// Base API URL from environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tymout.example';

// Token storage keys
const ACCESS_TOKEN_KEY = 'tymout_access_token';
const REFRESH_TOKEN_KEY = 'tymout_refresh_token';

/**
 * Service for authentication operations
 */
const authService = {
  /**
   * Gets the current access token from storage
   * @returns {string|null} The access token or null if not found
   */
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Gets the current refresh token from storage
   * @returns {string|null} The refresh token or null if not found
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Sets the authentication tokens in storage
   * @param {object} tokens - Object containing access and refresh tokens
   */
  setTokens: (tokens) => {
    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    }

    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },

  /**
   * Clears authentication tokens from storage
   */
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Checks if the user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!authService.getAccessToken();
  },

  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise} Promise resolving to new tokens
   */
  refreshAccessToken: async () => {
    const refreshToken = authService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken
      });
      
      authService.setTokens(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      authService.clearTokens();
      throw error;
    }
  },

  /**
   * Sets up axios interceptors for automatic token handling
   */
  setupAxiosInterceptors: () => {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        const token = authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't retried already
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Attempt to refresh token
            await authService.refreshAccessToken();
            
            // Retry original request with new token
            const token = authService.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            authService.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
};

// Setup axios interceptors on import
authService.setupAxiosInterceptors();

export default authService;
