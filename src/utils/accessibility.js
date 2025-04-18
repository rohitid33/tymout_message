/**
 * Accessibility Utilities
 *
 * This module provides helpers to improve keyboard navigation and screen reader support
 * across the Tymout messaging platform, following WCAG 2.1 guidelines.
 */

/**
 * Handles Escape key presses for modals, dialogs, and other dismissible elements
 * @param {Function} onClose - Function to run when Escape is pressed
 * @returns {Function} - Event handler for keydown events
 */
export const handleEscapeKey = (onClose) => {
  return (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
};

/**
 * Trap focus within a specified container for modals and dialogs
 * @param {HTMLElement} containerRef - Reference to the container element
 * @returns {Function} - Event handler for keydown events
 */
export const createFocusTrap = (containerRef) => {
  return (event) => {
    if (event.key !== 'Tab' || !containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  };
};

/**
 * Creates an aria-live region for dynamic content updates
 * @param {string} regionType - Type of region ('polite' or 'assertive')
 * @returns {HTMLDivElement} - A div element to be used as an aria-live region
 */
export const createAriaLiveRegion = (regionType = 'polite') => {
  const region = document.createElement('div');
  region.setAttribute('aria-live', regionType);
  region.setAttribute('role', 'status');
  region.style.position = 'absolute';
  region.style.width = '1px';
  region.style.height = '1px';
  region.style.margin = '-1px';
  region.style.padding = '0';
  region.style.overflow = 'hidden';
  region.style.clip = 'rect(0, 0, 0, 0)';
  region.style.whiteSpace = 'nowrap';
  region.style.border = '0';
  return region;
};

/**
 * Announces a message to screen readers via aria-live region
 * @param {string} message - Message to announce
 * @param {string} urgency - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, urgency = 'polite') => {
  // Find existing region or create a new one
  let region = document.querySelector(`[aria-live="${urgency}"]`);
  
  if (!region) {
    region = createAriaLiveRegion(urgency);
    document.body.appendChild(region);
  }
  
  // Clear any existing content
  region.textContent = '';
  
  // Set new content after a short delay (necessary for some screen readers)
  setTimeout(() => {
    region.textContent = message;
  }, 50);
};

/**
 * Key code constants for accessibility-enhanced components
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
};

/**
 * Makes a component keyboard navigable with arrow keys
 * @param {Array} items - Array of items to navigate through
 * @param {number} currentIndex - Current selected index
 * @param {Function} setCurrentIndex - Function to update the current index
 * @param {boolean} vertical - Whether navigation should be vertical (true) or horizontal (false)
 * @returns {Function} - Event handler for keydown events
 */
export const createKeyboardNavigation = (items, currentIndex, setCurrentIndex, vertical = true) => {
  return (event) => {
    const incrementKey = vertical ? KEYS.ARROW_DOWN : KEYS.ARROW_RIGHT;
    const decrementKey = vertical ? KEYS.ARROW_UP : KEYS.ARROW_LEFT;
    
    switch (event.key) {
      case incrementKey:
        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
          event.preventDefault();
        }
        break;
      case decrementKey:
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          event.preventDefault();
        }
        break;
      case KEYS.HOME:
        setCurrentIndex(0);
        event.preventDefault();
        break;
      case KEYS.END:
        setCurrentIndex(items.length - 1);
        event.preventDefault();
        break;
      default:
        break;
    }
  };
};

/**
 * Enhances a clickable element to be fully accessible via keyboard
 * @param {Function} onClick - Click handler function
 * @returns {Object} - Props to spread onto the element
 */
export const createAccessibleClickProps = (onClick) => {
  return {
    onClick,
    onKeyDown: (event) => {
      if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
        onClick(event);
        event.preventDefault();
      }
    },
    role: 'button',
    tabIndex: 0
  };
};
