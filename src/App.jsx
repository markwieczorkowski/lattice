import React, { useEffect, useState } from 'react';
import Viewport from './components/board/Viewport';
import Board from './components/board/Board';
import BoardControls from './components/board/BoardControls';
import AddComponentButton from './components/ui/AddComponentButton';
import LoadSaveButton from './components/ui/LoadSaveButton';
import BoardSettingsButton from './components/ui/BoardSettingsButton';
import BoardSettingsDialog from './components/dialogs/BoardSettingsDialog';
import LoadSaveDialog from './components/dialogs/LoadSaveDialog';
import useBoardStore from './stores/useBoardStore';
import './App.css';

/**
 * Main Application Component
 * 
 * Phase 1A: Core Board Infrastructure
 * Phase 1B: Component placement with react-grid-layout
 * Phase 1C: Component configuration framework
 * Phase 1D: Board settings panel
 * Phase 1E: Persistence
 */
function App() {
  const { migrateOldFormat, loadLastBoard, board } = useBoardStore();
  const [placementMode, setPlacementMode] = useState(null);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [showLoadSave, setShowLoadSave] = useState(false);

  // Load saved state on mount (Phase 1E persistence)
  useEffect(() => {
    // Migrate old single-board format if it exists
    migrateOldFormat();
    // Load the last opened board
    loadLastBoard();
  }, [migrateOldFormat, loadLastBoard]);

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
        <LoadSaveButton onClick={() => setShowLoadSave(true)} />
        <BoardSettingsButton onClick={() => setShowBoardSettings(true)} />
        
        {/* Placement mode indicator */}
        {placementMode && (
          <div className="placement-mode-indicator">
            Placing component... (ESC to cancel)
          </div>
        )}
        
        {/* Load/Save dialog */}
        {showLoadSave && (
          <LoadSaveDialog onClose={() => setShowLoadSave(false)} />
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
