import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './AddListItemDialog.css';

/**
 * AddListItemDialog
 *
 * Lightweight quick-add dialog for the List component.
 * Rendered via React Portal so it appears above all board layers.
 *
 * - Auto-focuses the input on mount
 * - Enter confirms (if input is non-empty)
 * - Escape cancels
 *
 * Props:
 *   onConfirm {function(string)} - Called with trimmed item text when user confirms
 *   onCancel  {function}         - Called when user cancels
 */
const AddListItemDialog = ({ onConfirm, onCancel }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    const trimmed = text.trim();
    if (trimmed) onConfirm(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); handleConfirm(); }
    if (e.key === 'Escape') { e.stopPropagation(); onCancel(); }
  };

  // Block all pointer events from reaching the board/RGL beneath the dialog
  const absorb = (e) => { e.stopPropagation(); e.preventDefault(); };

  return createPortal(
    <div className="alid-backdrop" onMouseDown={absorb} onClick={absorb}>
      <div className="alid-dialog" onMouseDown={absorb} onClick={absorb}>
        <h3 className="alid-title">Add List Item</h3>

        <input
          ref={inputRef}
          type="text"
          className="alid-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter item text…"
          maxLength={200}
        />

        <div className="alid-actions">
          <button
            className="alid-btn alid-btn-cancel"
            onClick={(e) => { absorb(e); onCancel(); }}
          >
            Cancel
          </button>
          <button
            className="alid-btn alid-btn-ok"
            onClick={(e) => { absorb(e); handleConfirm(); }}
            disabled={!text.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddListItemDialog;
