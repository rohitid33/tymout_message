/**
 * Message Input Component
 * 
 * Handles user input for sending messages, with different behavior
 * based on chat mode (group-chat or announcements-only).
 * Supports text entry, attachments, and emoji picker integration.
 * Mobile-first design with responsive controls.
 */

import React, { useState, useEffect, useRef } from 'react';
import useMessagingStore from '../../contexts/messagingStore';
import { useSendMessage, useSendAttachment } from '../../hooks/queries/useMessagingQueries';
import messageWebSocketService from '../../services/messageWebSocketService';

// Import emoji picker library
import EmojiPicker from 'emoji-picker-react';

// Icons for the input controls
import { FiPaperclip, FiSend, FiSmile, FiX } from 'react-icons/fi';

const MessageInput = ({ 
  threadId,
  isReadOnly,
  chatMode,
  isAdmin,
  onSendMessage,
  onSendAttachment,
  maxAttachmentSize = 10, // Default max attachment size in MB
  allowedAttachmentTypes = ['image/*', 'application/pdf'] // Default allowed types
}) => {
  // Get draft message and UI state from Zustand store
  const { 
    draftMessages, 
    setDraftMessage,
    setTypingUsers,
    emojiPickerVisible,
    setEmojiPickerVisible
  } = useMessagingStore();
  
  // Local state for input value and attachments
  const [inputValue, setInputValue] = useState(draftMessages[threadId] || '');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  
  // Refs
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  // Get mutations for sending messages and attachments
  const sendMessageMutation = useSendMessage();
  const sendAttachmentMutation = useSendAttachment();
  
  // Reset input when threadId changes
  useEffect(() => {
    setInputValue(draftMessages[threadId] || '');
    setAttachments([]);
    setAttachmentError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [threadId, draftMessages]);
  
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsEmojiPickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle file attachment selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Reset error state
    setAttachmentError('');
    
    // Validate file types
    const invalidFiles = files.filter(file => {
      const fileType = file.type.split('/')[0];
      return !allowedAttachmentTypes.some(type => {
        const [mainType, subType] = type.split('/');
        return (mainType === '*') || 
               (mainType === fileType && (subType === '*' || subType === file.type.split('/')[1]));
      });
    });
    
    if (invalidFiles.length > 0) {
      setAttachmentError(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxAttachmentSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setAttachmentError(`File(s) exceed the ${maxAttachmentSize}MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Process valid files
    const newAttachments = files.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Clear the file input for future selections
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove an attachment
  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const filtered = prev.filter(attachment => attachment.id !== attachmentId);
      
      // Revoke object URLs to prevent memory leaks
      const removed = prev.find(attachment => attachment.id === attachmentId);
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return filtered;
    });
  };
  
  // Clear all attachments
  const clearAttachments = () => {
    // Revoke all object URLs
    attachments.forEach(attachment => {
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
    });
    
    setAttachments([]);
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    // Insert emoji at cursor position
    const cursorPosition = inputRef.current.selectionStart;
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    
    const newValue = textBeforeCursor + emoji.native + textAfterCursor;
    setInputValue(newValue);
    setDraftMessage(threadId, newValue);
    
    // Close emoji picker
    setIsEmojiPickerOpen(false);
    
    // Focus input and position cursor after inserted emoji
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = cursorPosition + emoji.native.length;
        inputRef.current.selectionEnd = cursorPosition + emoji.native.length;
      }
    }, 0);
  };
  
  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(prev => !prev);
  };
  
  // Handle typing indicator logic
  useEffect(() => {
    let typingTimeout;
    
    if (isTyping) {
      messageWebSocketService.sendTypingIndicator(threadId, true);
      
      // Clear typing indicator after 3 seconds of inactivity
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        messageWebSocketService.sendTypingIndicator(threadId, false);
      }, 3000);
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [isTyping, threadId]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setDraftMessage(threadId, value);
    
    // Set typing indicator
    if (value && !isTyping) {
      setIsTyping(true);
    }
  };
  
  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit if input is empty and no attachments
    if (!inputValue.trim() && attachments.length === 0) {
      return;
    }
    
    // In announcements-only mode, non-admins send to admin privately
    const isAnnouncementsMode = chatMode === 'announcements-only';
    const isGroupMessage = !isAnnouncementsMode || isAdmin;
    
    // Private message confirmation for announcements-only mode
    if (isAnnouncementsMode && !isAdmin) {
      // In a real implementation, this would show a confirmation dialog
      console.log('Message will be sent privately to the admin.');
    }
    
    // Handle attachments if present
    let attachmentIds = [];
    if (attachments.length > 0) {
      if (onSendAttachment) {
        // Handle attachments in demo mode
        attachmentIds = await Promise.all(
          attachments.map(attachment => onSendAttachment(attachment.file))
        );
      } else {
        // Send attachments using the uploadAttachment mutation
        const uploadPromises = attachments.map(attachment => {
          const formData = new FormData();
          formData.append('file', attachment.file);
          formData.append('threadId', threadId);
          formData.append('isGroupMessage', isGroupMessage);
          
          return sendAttachmentMutation.mutateAsync(formData);
        });
        
        try {
          const results = await Promise.all(uploadPromises);
          attachmentIds = results.map(result => result.attachmentId);
        } catch (error) {
          // Handle upload error
          console.error('Error uploading attachments:', error);
          setAttachmentError('Failed to upload one or more attachments');
          return; // Don't proceed with sending the message
        }
      }
    }
    
    // Send the message text if provided
    if (inputValue.trim() || attachmentIds.length > 0) {
      if (onSendMessage) {
        // For demo mode
        onSendMessage(inputValue.trim(), attachmentIds);
      } else {
        // Send via React Query mutation
        sendMessageMutation.mutate({
          threadId,
          content: {
            text: inputValue.trim(),
            attachmentIds,
            isGroupMessage
          }
        });
      }
    }
    
    // Clear input, attachments, and typing indicator
    setInputValue('');
    setDraftMessage(threadId, '');
    clearAttachments();
    setIsTyping(false);
    messageWebSocketService.sendTypingIndicator(threadId, false);
  };
  
  // Determine placeholder text based on mode and state
  const getPlaceholderText = () => {
    if (isReadOnly) {
      return 'This chat is in read-only mode';
    }
    
    if (chatMode === 'announcements-only' && !isAdmin) {
      return 'Message to Admin';
    }
    
    return 'Type a message...';
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="message-input-wrapper">
      {/* Attachment Preview Area */}
      {attachments.length > 0 && (
        <div className="attachment-preview-area">
          {attachments.map(attachment => (
            <div className="attachment-preview" key={attachment.id}>
              {attachment.preview ? (
                <div className="attachment-image-preview">
                  <img src={attachment.preview} alt={attachment.name} />
                  <button 
                    className="remove-attachment-button" 
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    aria-label="Remove attachment"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="attachment-file-preview">
                  <div className="attachment-file-info">
                    <span className="attachment-file-name">{attachment.name}</span>
                    <span className="attachment-file-size">{formatFileSize(attachment.size)}</span>
                  </div>
                  <button 
                    className="remove-attachment-button" 
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    aria-label="Remove attachment"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Error Display */}
      {attachmentError && (
        <div className="attachment-error">{attachmentError}</div>
      )}
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="file-input-hidden" 
        onChange={handleFileChange}
        disabled={isReadOnly}
        multiple
        accept={allowedAttachmentTypes.join(',')}
      />
      
      {/* Message Input Form */}
      <form className="message-input-container" onSubmit={handleSubmit}>
        {/* Attachment Button */}
        <button 
          type="button" 
          className="input-control-button attachment-button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isReadOnly}
          aria-label="Add attachment"
        >
          <FiPaperclip />
        </button>
        
        {/* Emoji Button */}
        <button 
          type="button" 
          className="input-control-button emoji-button" 
          onClick={toggleEmojiPicker}
          disabled={isReadOnly}
          aria-label="Add emoji"
        >
          <FiSmile />
        </button>
        
        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder={getPlaceholderText()}
          value={inputValue}
          onChange={handleInputChange}
          disabled={isReadOnly}
        />
        
        {/* Send Button */}
        <button 
          type="submit" 
          className="send-button"
          disabled={isReadOnly || (!inputValue.trim() && attachments.length === 0)}
          aria-label="Send message"
        >
          <FiSend />
        </button>
      </form>
      
      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <div className="emoji-picker-container" ref={emojiPickerRef}>
          <EmojiPicker 
            onEmojiClick={(emojiData, event) => {
              handleEmojiSelect({ native: emojiData.emoji });
            }}
            width="100%"
            height="350px"
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
