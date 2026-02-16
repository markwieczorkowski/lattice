import React, { useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import useBoardStore from '../stores/useBoardStore';
import ComponentTile from './ComponentTile';
import { getComponentType, generateComponentId } from '../utils/componentRegistry';
import './Board.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Board Component
 * 
 * Represents the bounded 2D workspace that is larger than the viewport.
 * Handles panning via mouse drag on empty space.
 * Integrates react-grid-layout for component management.
 * Handles component placement mode with shadow preview.
 */
const Board = ({ placementMode, onPlacementComplete }) => {
  const { board, viewport, setViewportPan, components, addComponent, updateAllLayouts } = useBoardStore();
  const boardRef = useRef(null);
  const rglContainerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [shadowPosition, setShadowPosition] = useState(null);

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
   * Convert mouse position to grid coordinates
   */
  const mouseToGridPosition = (clientX, clientY) => {
    if (!boardRef.current) return null;

    const boardRect = boardRef.current.getBoundingClientRect();
    const relativeX = clientX - boardRect.left;
    const relativeY = clientY - boardRect.top;

    // Convert to grid coordinates (snap to grid)
    const gridX = Math.floor(relativeX / board.gridSize);
    const gridY = Math.floor(relativeY / board.gridSize);

    return { x: gridX, y: gridY };
  };

  /**
   * Check if placement would collide with existing components
   */
  const wouldCollide = (x, y, w, h) => {
    const componentList = Object.values(components);
    for (const comp of componentList) {
      const { x: cx, y: cy, w: cw, h: ch } = comp.layout;
      // Check if rectangles overlap
      if (!(x + w <= cx || x >= cx + cw || y + h <= cy || y >= cy + ch)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Handle mouse down - start panning or handle placement
   * Only pan when clicking on empty board space (not in placement mode)
   */
  const handleMouseDown = (e) => {
    // If in placement mode, handle component placement
    if (placementMode) {
      return; // Click will be handled by handleClick
    }

    // Only pan if clicking directly on the board element or grid (not RGL components)
    const isEmptySpace = 
      e.target === boardRef.current || 
      e.target.classList.contains('board-grid') ||
      e.target.classList.contains('react-grid-layout');

    if (isEmptySpace) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart({ x: viewport.panX, y: viewport.panY });
      e.preventDefault();
    }
  };

  /**
   * Handle mouse move - update pan position or shadow preview
   */
  const handleMouseMove = (e) => {
    // Handle placement mode shadow preview
    if (placementMode) {
      const gridPos = mouseToGridPosition(e.clientX, e.clientY);
      if (gridPos) {
        const componentType = getComponentType(placementMode);
        if (componentType) {
          const willCollide = wouldCollide(
            gridPos.x,
            gridPos.y,
            componentType.defaultWidth,
            componentType.defaultHeight
          );
          setShadowPosition({
            x: gridPos.x,
            y: gridPos.y,
            w: componentType.defaultWidth,
            h: componentType.defaultHeight,
            canPlace: !willCollide,
          });
        }
      }
      return;
    }

    // Handle panning
    if (!isPanning) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newPanX = panStart.x + deltaX;
    const newPanY = panStart.y + deltaY;

    const clamped = clampPan(newPanX, newPanY);
    setViewportPan(clamped.x, clamped.y);
  };

  /**
   * Handle click - place component in placement mode
   */
  const handleClick = (e) => {
    if (!placementMode) return;

    const gridPos = mouseToGridPosition(e.clientX, e.clientY);
    if (!gridPos) return;

    const componentType = getComponentType(placementMode);
    if (!componentType) return;

    // Check for collisions
    if (wouldCollide(gridPos.x, gridPos.y, componentType.defaultWidth, componentType.defaultHeight)) {
      return; // Cannot place - collision detected
    }

    // Create new component
    const newComponent = {
      id: generateComponentId(),
      type: placementMode,
      layout: {
        x: gridPos.x,
        y: gridPos.y,
        w: componentType.defaultWidth,
        h: componentType.defaultHeight,
      },
      style: {},
      content: {},
    };

    addComponent(newComponent);
    setShadowPosition(null);
    onPlacementComplete();
  };

  /**
   * Handle mouse up - stop panning
   */
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  /**
   * Handle RGL layout change (drag/resize complete)
   */
  const handleLayoutChange = (layout) => {
    updateAllLayouts(layout);
  };

  /**
   * Convert components to RGL layout format
   */
  const getLayoutFromComponents = () => {
    return Object.values(components).map((comp) => ({
      i: comp.id,
      x: comp.layout.x,
      y: comp.layout.y,
      w: comp.layout.w,
      h: comp.layout.h,
      minW: getComponentType(comp.type)?.minWidth || 2,
      minH: getComponentType(comp.type)?.minHeight || 2,
    }));
  };

  /**
   * Calculate board transform based on viewport state
   */
  const boardTransform = `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`;

  // Calculate columns based on board width and grid size
  const cols = Math.floor(board.width / board.gridSize);

  return (
    <div
      ref={boardRef}
      className={`board ${isPanning ? 'board-panning' : ''} ${placementMode ? 'board-placing' : ''}`}
      style={{
        width: `${board.width}px`,
        height: `${board.height}px`,
        backgroundColor: board.background,
        transform: boardTransform,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        if (placementMode) setShadowPosition(null);
      }}
      onClick={handleClick}
    >
      {/* Grid overlay for testing */}
      <div 
        className="board-grid"
        style={{
          backgroundSize: `${board.gridSize}px ${board.gridSize}px`,
        }}
      />

      {/* Shadow preview for component placement */}
      {placementMode && shadowPosition && (
        <div
          className={`component-shadow ${shadowPosition.canPlace ? 'can-place' : 'cannot-place'}`}
          style={{
            left: `${shadowPosition.x * board.gridSize}px`,
            top: `${shadowPosition.y * board.gridSize}px`,
            width: `${shadowPosition.w * board.gridSize}px`,
            height: `${shadowPosition.h * board.gridSize}px`,
          }}
        />
      )}
      
      {/* React Grid Layout for components */}
      <div ref={rglContainerRef} className="rgl-container">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: getLayoutFromComponents() }}
          breakpoints={{ lg: 0 }}
          cols={{ lg: cols }}
          rowHeight={board.gridSize}
          width={board.width}
          onLayoutChange={handleLayoutChange}
          compactType={null}
          preventCollision={true}
          isDraggable={!placementMode}
          isResizable={!placementMode}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
        >
          {Object.values(components).map((component) => (
            <div key={component.id} data-grid={component.layout}>
              <ComponentTile component={component} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Board;
