import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useBoardStore from '../../stores/useBoardStore';
import './LoadSaveDialog.css';

/**
 * LoadSaveDialog - Dialog for loading and saving boards
 */
function LoadSaveDialog({ onClose }) {
  const {
    board,
    getAvailableBoards,
    loadBoard,
    saveCurrentBoard,
  } = useBoardStore();

  const [availableBoards, setAvailableBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(board.id);
  const [boardName, setBoardName] = useState(board.name);

  useEffect(() => {
    // Load available boards when dialog opens
    const boards = getAvailableBoards();
    setAvailableBoards(boards);
  }, [getAvailableBoards]);

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoad = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (selectedBoardId) {
      const success = loadBoard(selectedBoardId);
      if (success) {
        onClose();
      } else {
        alert('Failed to load board. Board data may be corrupted.');
      }
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (boardName.trim()) {
      saveCurrentBoard(boardName.trim());
      // Refresh available boards list
      const boards = getAvailableBoards();
      setAvailableBoards(boards);
      onClose();
    } else {
      alert('Please enter a board name.');
    }
  };

  const handleBoardSelect = (e) => {
    e.stopPropagation();
    const selectedId = e.target.value;
    setSelectedBoardId(selectedId);
    
    // Update board name input to match selected board
    const selectedBoard = availableBoards.find(b => b.id === selectedId);
    if (selectedBoard) {
      setBoardName(selectedBoard.name);
    }
  };

  const handleNameChange = (e) => {
    e.stopPropagation();
    setBoardName(e.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const dialogContent = (
    <div
      className="load-save-dialog-backdrop"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="load-save-dialog"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="load-save-dialog-header">
          <h2>Load / Save Board</h2>
          <button
            className="load-save-dialog-close"
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>

        <div className="load-save-dialog-content">
          {/* Current Board Display */}
          <div className="load-save-section">
            <label className="load-save-label">Current Board:</label>
            <div className="current-board-name">{board.name}</div>
          </div>

          {/* Board Selection */}
          <div className="load-save-section">
            <label className="load-save-label" htmlFor="board-select">
              Select Board:
            </label>
            <select
              id="board-select"
              className="load-save-select"
              value={selectedBoardId}
              onChange={handleBoardSelect}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {availableBoards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} - {formatDate(b.lastModified)}
                </option>
              ))}
            </select>
          </div>

          {/* Board Name Input (for saving) */}
          <div className="load-save-section">
            <label className="load-save-label" htmlFor="board-name-input">
              Board Name:
            </label>
            <input
              id="board-name-input"
              type="text"
              className="load-save-input"
              value={boardName}
              onChange={handleNameChange}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Enter board name"
            />
            <div className="load-save-hint">
              Save will update the current board with this name
            </div>
          </div>

          {/* Action Buttons */}
          <div className="load-save-actions">
            <button
              className="load-save-btn load-save-btn-load"
              onClick={handleLoad}
              onMouseDown={(e) => e.stopPropagation()}
              disabled={!selectedBoardId}
            >
              Load
            </button>
            <button
              className="load-save-btn load-save-btn-save"
              onClick={handleSave}
              onMouseDown={(e) => e.stopPropagation()}
              disabled={!boardName.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}

export default LoadSaveDialog;
