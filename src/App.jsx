import React, { useEffect, useState } from 'react';
import Viewport from './components/Viewport';
import Board from './components/Board';
import BoardControls from './components/BoardControls';
import AddComponentButton from './components/AddComponentButton';
import useBoardStore from './stores/useBoardStore';
import './App.css';

/**
 * Main Application Component
 * 
 * Phase 1A: Core Board Infrastructure
 * Phase 1B: Component placement with react-grid-layout
 */
function App() {
  const { loadFromLocalStorage } = useBoardStore();
  const [placementMode, setPlacementMode] = useState(null);

  // Load saved state on mount (if available)
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  /**
   * Handle component type selection from AddComponentButton
   */
  const handleSelectComponentType = (typeId) => {
    setPlacementMode(typeId);
  };

  /**
   * Handle completion of component placement
   */
  const handlePlacementComplete = () => {
    setPlacementMode(null);
  };

  /**
   * Cancel placement mode on Escape key
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && placementMode) {
        setPlacementMode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placementMode]);

  return (
    <div className="app">
      <Viewport>
        <Board 
          placementMode={placementMode}
          onPlacementComplete={handlePlacementComplete}
        />
        <BoardControls />
        <AddComponentButton onSelectType={handleSelectComponentType} />
        
        {/* Placement mode indicator */}
        {placementMode && (
          <div className="placement-mode-indicator">
            Placing component... (ESC to cancel)
          </div>
        )}
      </Viewport>
    </div>
  );
}

export default App;
