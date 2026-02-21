import React from 'react';
import './BoardSettingsButton.css';

/**
 * BoardSettingsButton
 * 
 * Button in upper-right corner to open board settings dialog.
 * Similar to AddComponentButton but with menu icon.
 */
const BoardSettingsButton = ({ onClick }) => {
  return (
    <button
      className="board-settings-button"
      onClick={onClick}
      title="Board Settings"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
};

export default BoardSettingsButton;
