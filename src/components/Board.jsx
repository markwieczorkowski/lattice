import React, { useRef, useState } from 'react';
import useBoardStore from '../stores/useBoardStore';
import './Board.css';

/**
 * Board Component
 * 
 * Represents the bounded 2D workspace that is larger than the viewport.
 * Handles panning via mouse drag on empty space.
 * Renders with CSS transform based on viewport pan state.
 */
const Board = ({ children }) => {
  const { board, viewport, setViewportPan } = useBoardStore();
  const boardRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  /**
   * Calculate pan boundaries to prevent board from moving too far out of view
   * Allows maximum of one grid square (gridSize) of empty space past board edges
   */
  const getPanBoundaries = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { width: boardWidth, height: boardHeight, gridSize } = board;

    return {
      maxX: gridSize, // Allow one grid square visible on left
      minX: -(boardWidth - viewportWidth + gridSize), // Allow one grid square visible on right
      maxY: gridSize, // Allow one grid square visible on top
      minY: -(boardHeight - viewportHeight + gridSize), // Allow one grid square visible on bottom
    };
  };

  /**
   * Clamp pan value within boundaries
   */
  const clampPan = (x, y) => {
    const boundaries = getPanBoundaries();
    return {
      x: Math.max(boundaries.minX, Math.min(boundaries.maxX, x)),
      y: Math.max(boundaries.minY, Math.min(boundaries.maxY, y)),
    };
  };

  /**
   * Handle mouse down - start panning
   * Only pan when clicking on the board itself (empty space)
   */
  const handleMouseDown = (e) => {
    // Only pan if clicking directly on the board element (not children)
    if (e.target === boardRef.current || e.target.classList.contains('board-grid')) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart({ x: viewport.panX, y: viewport.panY });
      e.preventDefault(); // Prevent text selection during drag
    }
  };

  /**
   * Handle mouse move - update pan position with boundary constraints
   */
  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Calculate new pan position
    const newPanX = panStart.x + deltaX;
    const newPanY = panStart.y + deltaY;

    // Clamp to boundaries
    const clamped = clampPan(newPanX, newPanY);

    // Update viewport pan with clamped values
    setViewportPan(clamped.x, clamped.y);
  };

  /**
   * Handle mouse up - stop panning
   */
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  /**
   * Calculate board transform based on viewport state
   */
  const boardTransform = `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`;

  return (
    <div
      ref={boardRef}
      className={`board ${isPanning ? 'board-panning' : ''}`}
      style={{
        width: `${board.width}px`,
        height: `${board.height}px`,
        backgroundColor: board.background,
        transform: boardTransform,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop panning if mouse leaves board
    >
      {/* Grid overlay for testing (Phase 1A only) */}
      <div 
        className="board-grid"
        style={{
          backgroundSize: `${board.gridSize}px ${board.gridSize}px`,
        }}
      />
      
      {/* Children components will go here (Phase 1B+) */}
      {children}
    </div>
  );
};

export default Board;
