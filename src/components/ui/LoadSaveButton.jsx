import React from 'react';
import './LoadSaveButton.css';

/**
 * LoadSaveButton - Opens the Load/Save dialog for board persistence
 */
function LoadSaveButton({ onClick }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      className="load-save-button"
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      title="Load/Save Board"
    >
      <svg
        className="load-save-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Save icon - floppy disk */}
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    </button>
  );
}

export default LoadSaveButton;
