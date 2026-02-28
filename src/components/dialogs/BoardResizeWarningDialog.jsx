import React from 'react';
import { createPortal } from 'react-dom';
import './BoardResizeWarningDialog.css';

/**
 * BoardResizeWarningDialog - Warning when board resize would push components outside bounds
 */
function BoardResizeWarningDialog({ componentsOutside, onClose }) {
  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOk = (e) => {
    e.stopPropagation();
    onClose();
  };

  const dialogContent = (
    <div
      className="resize-warning-backdrop"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="resize-warning-dialog"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="resize-warning-header">
          <h2>Unable to Resize</h2>
        </div>

        <div className="resize-warning-content">
          <p className="resize-warning-message">
            Components would be outside of board range. Please move or delete the following components before resizing:
          </p>

          <div className="components-list">
            {componentsOutside.map((comp) => (
              <div key={comp.id} className="component-item">
                <div className="component-name">{comp.name}</div>
                <div className="component-details">
                  Position: ({comp.position.x}, {comp.position.y}) | 
                  Size: {comp.size.w}×{comp.size.h}
                  {comp.exceedsRight && comp.exceedsBottom && ' | Exceeds right and bottom edges'}
                  {comp.exceedsRight && !comp.exceedsBottom && ' | Exceeds right edge'}
                  {!comp.exceedsRight && comp.exceedsBottom && ' | Exceeds bottom edge'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resize-warning-actions">
          <button
            className="resize-warning-btn"
            onClick={handleOk}
            onMouseDown={(e) => e.stopPropagation()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}

export default BoardResizeWarningDialog;
