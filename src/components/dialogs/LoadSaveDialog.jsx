import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useBoardStore from '../../stores/useBoardStore';
import './LoadSaveDialog.css';

/**
 * LoadSaveDialog - Dialog for loading, saving, adding, and deleting boards
 * 
 * Layout:
 * - Current Board section (ADD, SAVE)
 * - Selected Board section (selector, LOAD, DELETE)
 */
function LoadSaveDialog({ onClose }) {
  const {
    board,
    getAvailableBoards,
    loadBoard,
    saveCurrentBoard,
    createNewBoard,
    deleteBoard,
    isCurrentBoardSaved,
  } = useBoardStore();

  const [availableBoards, setAvailableBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [boardToDelete, setBoardToDelete] = useState(null);

  useEffect(() => {
    // Load available boards when dialog opens
    const boards = getAvailableBoards();
    setAvailableBoards(boards);
    
    // Pre-select current board if it's saved, otherwise first board
    if (boards.length > 0 && !selectedBoardId) {
      if (isCurrentBoardSaved() && boards.find(b => b.id === board.id)) {
        // Current board is saved, select it
        setSelectedBoardId(board.id);
      } else {
        // Current board is not saved, select first available
        setSelectedBoardId(boards[0].id);
      }
    }
  }, [getAvailableBoards, selectedBoardId, isCurrentBoardSaved, board.id]);

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ADD BUTTON: Create new board from current state
  const handleAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setNewBoardName('');
    setShowAddDialog(true);
  };

  // SAVE BUTTON: Save current board (or prompt for name if default)
  const handleSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isCurrentBoardSaved()) {
      // Board is already saved, just overwrite
      const success = saveCurrentBoard();
      if (success) {
        // Refresh board list
        const boards = getAvailableBoards();
        setAvailableBoards(boards);
        onClose();
      }
    } else {
      // Board is default-unsaved, prompt for name
      setNewBoardName('');
      setShowAddDialog(true);
    }
  };

  // LOAD BUTTON: Load selected board
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

  // DELETE BUTTON: Confirm and delete selected board
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (selectedBoardId) {
      const boardName = availableBoards.find(b => b.id === selectedBoardId)?.name;
      setBoardToDelete({ id: selectedBoardId, name: boardName });
      setShowDeleteConfirm(true);
    }
  };

  // Confirm deletion
  const confirmDelete = (e) => {
    e.stopPropagation();
    if (boardToDelete) {
      const success = deleteBoard(boardToDelete.id);
      if (success) {
        // Refresh board list
        const boards = getAvailableBoards();
        setAvailableBoards(boards);
        setSelectedBoardId(boards.length > 0 ? boards[0].id : '');
        setShowDeleteConfirm(false);
        setBoardToDelete(null);
        
        // If deleted board was active, close dialog to show reset
        if (board.id === 'default-unsaved') {
          onClose();
        }
      }
    }
  };

  // Cancel deletion
  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    setBoardToDelete(null);
  };

  // Confirm add/save with new name
  const confirmAddBoard = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (newBoardName.trim()) {
      const success = createNewBoard(newBoardName.trim());
      if (success) {
        // Refresh board list
        const boards = getAvailableBoards();
        setAvailableBoards(boards);
        setShowAddDialog(false);
        setNewBoardName('');
        onClose();
      } else {
        alert('Failed to create board. Please try again.');
      }
    }
  };

  // Cancel add
  const cancelAddBoard = (e) => {
    e.stopPropagation();
    setShowAddDialog(false);
    setNewBoardName('');
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
          <h2>Board Management</h2>
          <button
            className="load-save-dialog-close"
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>

        <div className="load-save-dialog-content">
          {/* CURRENT BOARD SECTION */}
          <div className="load-save-section current-board-section">
            <h3 className="section-title">Current Board</h3>
            
            <div className="current-board-display">
              <span className="current-board-name">{board.name}</span>
              {!isCurrentBoardSaved() && (
                <span className="unsaved-indicator">(unsaved)</span>
              )}
            </div>

            <div className="current-board-actions">
              <button
                className="load-save-btn load-save-btn-add"
                onClick={handleAdd}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Add
              </button>
              <button
                className="load-save-btn load-save-btn-save"
                onClick={handleSave}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Save
              </button>
            </div>
            <div className="section-hint">
              Add: Save current board with new name<br/>
              Save: {isCurrentBoardSaved() ? 'Update saved board' : 'Save as new board'}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="section-divider"></div>

          {/* SAVED BOARDS SECTION */}
          <div className="load-save-section saved-boards-section">
            <h3 className="section-title">Saved Boards</h3>
            
            {availableBoards.length > 0 ? (
              <>
                <select
                  className="load-save-select"
                  value={selectedBoardId}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedBoardId(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {availableBoards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {formatDate(b.lastModified)}
                    </option>
                  ))}
                </select>

                <div className="saved-board-actions">
                  <button
                    className="load-save-btn load-save-btn-load"
                    onClick={handleLoad}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!selectedBoardId}
                  >
                    Load
                  </button>
                  <button
                    className="load-save-btn load-save-btn-delete"
                    onClick={handleDelete}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!selectedBoardId}
                  >
                    Delete
                  </button>
                </div>
                <div className="section-hint">
                  Load: Switch to selected board<br/>
                  Delete: Remove selected board
                </div>
              </>
            ) : (
              <div className="no-boards-message">
                No saved boards yet. Click "Add" or "Save" to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD BOARD NAME DIALOG */}
      {showAddDialog && (
        <div
          className="confirmation-overlay"
          onClick={cancelAddBoard}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="confirmation-dialog"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Enter Board Name</h3>
            <input
              type="text"
              className="board-name-input"
              value={newBoardName}
              onChange={(e) => {
                e.stopPropagation();
                setNewBoardName(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Board name..."
              autoFocus
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  confirmAddBoard(e);
                } else if (e.key === 'Escape') {
                  cancelAddBoard(e);
                }
              }}
            />
            <div className="confirmation-buttons">
              <button
                className="confirm-btn confirm-ok"
                onClick={confirmAddBoard}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={!newBoardName.trim()}
              >
                OK
              </button>
              <button
                className="confirm-btn confirm-cancel"
                onClick={cancelAddBoard}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteConfirm && boardToDelete && (
        <div
          className="confirmation-overlay"
          onClick={cancelDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="confirmation-dialog"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Delete "{boardToDelete.name}"?</h3>
            <div className="confirmation-buttons">
              <button
                className="confirm-btn confirm-ok"
                onClick={confirmDelete}
                onMouseDown={(e) => e.stopPropagation()}
              >
                OK
              </button>
              <button
                className="confirm-btn confirm-cancel"
                onClick={cancelDelete}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(dialogContent, document.body);
}

export default LoadSaveDialog;
