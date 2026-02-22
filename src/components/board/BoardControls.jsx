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
  const { board, viewport, resetViewport } = useBoardStore();

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
      <button 
        className="reset-button"
        onClick={resetViewport}
        title="Reset viewport to origin"
      >
        Reset View
      </button>
    </div>
  );
};

export default BoardControls;
