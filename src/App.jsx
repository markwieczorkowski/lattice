import React, { useEffect, useState } from 'react';
import Viewport from './components/board/Viewport';
import Board from './components/board/Board';
import BoardControls from './components/board/BoardControls';
import AddComponentButton from './components/ui/AddComponentButton';
import BoardSettingsButton from './components/settings/BoardSettingsButton';
import BoardSettingsDialog from './components/settings/BoardSettingsDialog';
import useBoardStore from './stores/useBoardStore';
import './App.css';

/**
 * Main Application Component
 * 
 * Phase 1A: Core Board Infrastructure
 * Phase 1B: Component placement with react-grid-layout
 * Phase 1C: Component configuration framework
 * Phase 1D: Board settings panel
 */
function App() {
  const { loadFromLocalStorage, board } = useBoardStore();
  const [placementMode, setPlacementMode] = useState(null);
  const [showBoardSettings, setShowBoardSettings] = useState(false);

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
        
        {/* Conditionally show test controls */}
        {board.showTestControls && <BoardControls />}
        
        <AddComponentButton onSelectType={handleSelectComponentType} />
        <BoardSettingsButton onClick={() => setShowBoardSettings(true)} />
        
        {/* Placement mode indicator */}
        {placementMode && (
          <div className="placement-mode-indicator">
            Placing component... (ESC to cancel)
          </div>
        )}
        
        {/* Board settings dialog */}
        {showBoardSettings && (
          <BoardSettingsDialog onClose={() => setShowBoardSettings(false)} />
        )}
      </Viewport>
    </div>
  );
}

export default App;
