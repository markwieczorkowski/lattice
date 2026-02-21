import React, { useEffect } from 'react';
import './RemoveConfirmDialog.css';

/**
 * RemoveConfirmDialog
 * 
 * Confirmation dialog for removing components.
 * Shows "Remove? OK/Cancel" prompt.
 */
const RemoveConfirmDialog = ({ componentId, onConfirm, onCancel }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleDialogClick = (e) => {
    // Prevent clicks inside dialog from propagating to board/components
    e.stopPropagation();
  };

  const handleBackdropMouseDown = (e) => {
    // Prevent mousedown from propagating (stops drag initiation)
    e.stopPropagation();
  };

  return (
    <div 
      className="remove-confirm-backdrop" 
      onClick={handleBackdropClick}
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="remove-confirm-dialog" onClick={handleDialogClick}>
        <div className="remove-confirm-header">
          Remove?
        </div>
        <div className="remove-confirm-actions">
          <button 
            className="remove-confirm-button cancel-button" 
            onClick={onCancel}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Cancel
          </button>
          <button 
            className="remove-confirm-button ok-button" 
            onClick={onConfirm}
            onMouseDown={(e) => e.stopPropagation()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmDialog;
