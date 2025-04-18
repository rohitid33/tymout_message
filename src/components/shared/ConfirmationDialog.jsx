/**
 * Confirmation Dialog Component
 * 
 * A reusable, accessible dialog component for confirming destructive actions
 * such as removing members, closing threads, or deleting content.
 * 
 * Features:
 * - Keyboard navigation and focus trapping
 * - Screen reader support
 * - Mobile-friendly design
 * - Custom action buttons
 * - Customizable appearance
 */

import React, { useRef, useEffect } from 'react';
import { createFocusTrap, handleEscapeKey, announceToScreenReader } from '../../utils/accessibility';
import { useResponsive } from '../../utils/responsive';
import '../../styles/ConfirmationDialog.css';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmButtonVariant = 'danger',
  showIcon = true,
  isLoading = false,
  autoFocus = true,
  closeOnOverlayClick = true,
  testId = 'confirmation-dialog'
}) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const { isMobile } = useResponsive();
  
  // Handle closing with Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = handleEscapeKey(onClose);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Trap focus within dialog and auto-focus first element
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    
    // Create focus trap for dialog
    const handleFocusTrap = createFocusTrap(dialogRef);
    document.addEventListener('keydown', handleFocusTrap);
    
    // Focus the confirm button (or other element if provided)
    if (autoFocus && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
    
    // Announce dialog to screen readers
    announceToScreenReader(`Dialog opened: ${title}`, 'assertive');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
    };
  }, [isOpen, title, autoFocus]);
  
  // Handle confirm action
  const handleConfirm = () => {
    onConfirm();
    announceToScreenReader('Action confirmed', 'polite');
  };
  
  // Handle cancel action
  const handleCancel = () => {
    onClose();
    announceToScreenReader('Action cancelled', 'polite');
  };
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleCancel();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="confirmation-dialog-overlay"
      onClick={handleOverlayClick}
      data-testid={`${testId}-overlay`}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className={`confirmation-dialog ${isMobile ? 'mobile' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        data-testid={testId}
      >
        <div className="dialog-header">
          {showIcon && (
            <div className="dialog-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
          )}
          <h2 id="dialog-title" className="dialog-title">{title}</h2>
          <button
            className="dialog-close"
            onClick={handleCancel}
            aria-label="Close dialog"
            data-testid={`${testId}-close`}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </div>
        
        <div id="dialog-message" className="dialog-content">
          {message}
        </div>
        
        <div className="dialog-actions">
          <button
            className="dialog-button cancel"
            onClick={handleCancel}
            disabled={isLoading}
            data-testid={`${testId}-cancel`}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            className={`dialog-button confirm ${confirmButtonVariant}`}
            onClick={handleConfirm}
            disabled={isLoading}
            data-testid={`${testId}-confirm`}
          >
            {isLoading ? (
              <span className="loading-spinner" aria-hidden="true" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
