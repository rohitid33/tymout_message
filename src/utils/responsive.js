/**
 * Responsive Design Utilities
 * 
 * Provides tools for implementing mobile-first design across the Tymout platform.
 * These utilities help ensure that all components are properly optimized for
 * smaller screens, following responsive design best practices.
 */

import { useState, useEffect } from 'react';

// Breakpoint definitions (can be customized to match design system)
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices (portrait phones)
  sm: 576,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 992,   // Large devices (desktops)
  xl: 1200,  // Extra large devices (large desktops)
  xxl: 1400  // Extra extra large devices
};

/**
 * Custom hook for responsive design
 * Returns the current viewport size category and dimensions
 * 
 * @returns {Object} Responsive information
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    // Don't run on server-side
    if (typeof window === 'undefined') return;
    
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to update initial size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get the current breakpoint
  const getBreakpoint = () => {
    const { width } = windowSize;
    
    if (width < BREAKPOINTS.sm) return 'xs';
    if (width < BREAKPOINTS.md) return 'sm';
    if (width < BREAKPOINTS.lg) return 'md';
    if (width < BREAKPOINTS.xl) return 'lg';
    if (width < BREAKPOINTS.xxl) return 'xl';
    return 'xxl';
  };
  
  // Determine if the current viewport is mobile
  const isMobile = windowSize.width < BREAKPOINTS.md;
  
  // Determine if the current viewport is tablet
  const isTablet = windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg;
  
  // Determine if the current viewport is desktop
  const isDesktop = windowSize.width >= BREAKPOINTS.lg;
  
  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint: getBreakpoint(),
    isMobile,
    isTablet,
    isDesktop
  };
};

/**
 * Generate responsive sizing helper
 * Return different values based on breakpoint
 * 
 * @param {Object} values Values for each breakpoint
 * @param {string} currentBreakpoint Current breakpoint
 * @returns {*} Value for the current breakpoint
 */
export const responsiveValue = (values, currentBreakpoint) => {
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const breakpointIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // If no value for current breakpoint, find the closest lower breakpoint with a value
  for (let i = breakpointIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  // Fallback to the smallest defined breakpoint
  for (let i = 0; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return null;
};

/**
 * Custom hook for responsive padding
 * Returns padding values appropriate for the current viewport
 * 
 * @param {Object} options Configuration options
 * @returns {Object} Padding values
 */
export const useResponsivePadding = (options = {}) => {
  const { breakpoint } = useResponsive();
  const { base = 16, scale = 1.5 } = options;
  
  // Calculate padding based on breakpoint
  const paddings = {
    xs: base,
    sm: base * scale,
    md: base * scale * scale,
    lg: base * scale * scale * scale,
    xl: base * scale * scale * scale * scale
  };
  
  return {
    padding: responsiveValue(paddings, breakpoint),
    paddingTop: options.top !== undefined ? options.top : responsiveValue(paddings, breakpoint),
    paddingRight: options.right !== undefined ? options.right : responsiveValue(paddings, breakpoint),
    paddingBottom: options.bottom !== undefined ? options.bottom : responsiveValue(paddings, breakpoint),
    paddingLeft: options.left !== undefined ? options.left : responsiveValue(paddings, breakpoint)
  };
};

/**
 * Custom hook for responsive fonts
 * Returns font size values appropriate for the current viewport
 * 
 * @param {Object} options Configuration options
 * @returns {Object} Font size values
 */
export const useResponsiveFontSize = (options = {}) => {
  const { breakpoint } = useResponsive();
  const { base = 16, scale = 1.125 } = options;
  
  // Calculate font sizes based on breakpoint
  const fontSizes = {
    xs: base,
    sm: base * scale,
    md: base * scale * scale,
    lg: base * scale * scale * scale,
    xl: base * scale * scale * scale * scale
  };
  
  return {
    fontSize: responsiveValue(fontSizes, breakpoint)
  };
};

/**
 * Custom hook for responsive grid layout
 * Returns grid configuration appropriate for the current viewport
 * 
 * @param {Object} options Configuration options
 * @returns {Object} Grid configuration
 */
export const useResponsiveGrid = (options = {}) => {
  const { breakpoint } = useResponsive();
  
  // Calculate columns based on breakpoint
  const columns = {
    xs: options.xs || 1,
    sm: options.sm || 2,
    md: options.md || 3,
    lg: options.lg || 4,
    xl: options.xl || 5,
    xxl: options.xxl || 6
  };
  
  return {
    columns: responsiveValue(columns, breakpoint),
    gap: options.gap ? responsiveValue(options.gap, breakpoint) : responsiveValue({
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24
    }, breakpoint)
  };
};
