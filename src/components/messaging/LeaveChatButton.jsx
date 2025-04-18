import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../../services/chatService';

const LeaveChatButton = ({ chatId, currentUserId, onLeft, disabled = false }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const leaveMutation = useMutation(() => chatService.leaveChat(chatId), {
    onSuccess: () => {
      setShowConfirm(false);
      queryClient.invalidateQueries(['members', chatId]);
      queryClient.invalidateQueries(['threadSummary', chatId]);
      onLeft?.();
    },
    onError: (err) => {
      setError('Failed to leave chat. Please try again.');
      setShowConfirm(false);
    }
  });

  return (
    <>
      <button
        className="leave-chat-button"
        onClick={() => setShowConfirm(true)}
        disabled={disabled || leaveMutation.isLoading}
        title="Leave this chat"
      >
        {leaveMutation.isLoading ? 'Leaving...' : 'Leave Chat'}
      </button>
      {showConfirm && (
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h4>Leave Chat</h4>
            <p>Are you sure you want to leave this chat? You will lose access to its messages.</p>
            <div className="confirmation-buttons">
              <button className="cancel-button" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="confirm-button" onClick={() => leaveMutation.mutate()}>Leave</button>
            </div>
            {error && <div className="error-toast">{error}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveChatButton;
