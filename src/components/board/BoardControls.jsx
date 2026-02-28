import React from 'react';
import useBoardStore from '../../stores/useBoardStore';
import './BoardControls.css';

/**
 * BoardControls Component
 * 
 * Provides basic board information and controls.
 * Phase 1A: Simple info panel and reset button
 * Phase 1D: Full settings panel
 */
const BoardControls = () => {
  const { board, viewport, resetViewport, clearAllStorage } = useBoardStore();

  const handleClearStorage = () => {
    if (window.confirm('Clear all storage? This will delete all saved boards and reset to first-use state. This cannot be undone.')) {
      clearAllStorage();
    }
  };

  return (
    <div className="board-controls">
      <div className="board-info">
        <h3>{board.name}</h3>
        <div className="board-stats">
          <span>Board: {board.width}×{board.height}px</span>
          <span>Grid: {board.gridSize}px</span>
          <span>Pan: ({Math.round(viewport.panX)}, {Math.round(viewport.panY)})</span>
        </div>
      </div>
      <div className="board-controls-buttons">
        <button 
          className="reset-button"
          onClick={resetViewport}
          title="Reset viewport to origin"
        >
          Reset View
        </button>
        <button 
          className="clear-storage-button"
          onClick={handleClearStorage}
          title="Clear all storage and reset to first-use state"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default BoardControls;
