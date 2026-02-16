import React, { useEffect } from 'react';
import Viewport from './components/Viewport';
import Board from './components/Board';
import BoardControls from './components/BoardControls';
import useBoardStore from './stores/useBoardStore';
import './App.css';

/**
 * Main Application Component
 * 
 * Phase 1A: Core Board Infrastructure
 * - Fixed viewport
 * - Pannable board
 * - Basic board configuration
 */
function App() {
  const { loadFromLocalStorage } = useBoardStore();

  // Load saved state on mount (if available)
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="app">
      <Viewport>
        <Board>
          {/* Components will be added in Phase 1B */}
        </Board>
        <BoardControls />
      </Viewport>
    </div>
  );
}

export default App;
