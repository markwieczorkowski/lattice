import React, { useEffect } from 'react';
import './ConfigureDialog.css';

/**
 * ConfigureDialog
 * 
 * Base configuration dialog container.
 * Renders component-specific configuration UI.
 * Closes when clicking outside the dialog.
 */
const ConfigureDialog = ({ title, children, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
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
      className="configure-dialog-backdrop" 
      onClick={handleBackdropClick}
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="configure-dialog" onClick={handleDialogClick}>
        <div className="configure-dialog-header">
          <h3>{title}</h3>
          <button 
            className="configure-dialog-close" 
            onClick={onClose} 
            onMouseDown={(e) => e.stopPropagation()}
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="configure-dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConfigureDialog;
