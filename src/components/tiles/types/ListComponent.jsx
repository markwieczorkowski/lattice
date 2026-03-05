import React, { useState, useEffect, useRef } from 'react';
import './ListComponent.css';

/**
 * Available bullet characters for the list component.
 * Exported so the config panel can share the same list.
 */
export const BULLET_CHARS = [
  { value: '•', label: 'Bullet'   },
  { value: '◦', label: 'Circle'   },
  { value: '▪', label: 'Square'   },
  { value: '▸', label: 'Triangle' },
  { value: '–', label: 'Dash'     },
  { value: '›', label: 'Chevron'  },
  { value: '★', label: 'Star'     },
  { value: '✓', label: 'Check'    },
  { value: '→', label: 'Arrow'    },
  { value: '◆', label: 'Diamond'  },
];

export const DEFAULT_BULLET_CHAR = '•';

/**
 * Convert a hex color string to rgba().
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * ListComponent
 *
 * Displays a titled, scrollable list of text items on the board.
 * Supports bullet, numbered, and unmarked list styles.
 * Text scales with the component's horizontal dimension via CSS container queries.
 *
 * Inline editing: both adding new items and editing existing ones use a single
 * unified inline <input> rendered in-place. The editingState discriminates
 * between the two modes; all keyboard/blur/commit logic is shared (DRY).
 *
 * Drag prevention: list item rows stop mousedown propagation so RGL drag
 * only activates from empty areas (title, padding). The user explicitly
 * requested this — clicking an item edits it; dragging requires empty space.
 *
 * Props:
 *   id           {string}   - Component identifier
 *   style        {object}   - Visual overrides (backgroundColor, backgroundOpacity, textColor)
 *   content      {object}   - List data (title, titleAlign, listStyle, items)
 *   isAddingItem {boolean}  - When true, activates inline add at bottom of list
 *   onAddItem    {function(text)}         - Called when add is committed
 *   onCancelAdd  {function}              - Called when add is cancelled
 *   onSaveEdit   {function(itemId, text)} - Called when an existing item edit is committed
 */
const ListComponent = ({
  id,
  style = {},
  content = {},
  isAddingItem = false,
  onAddItem,
  onCancelAdd,
  onSaveEdit,
}) => {
  const backgroundColor   = style.backgroundColor   || '#404040';
  const backgroundOpacity = style.backgroundOpacity  ?? 0.5;
  const textColor         = style.textColor          || '#ffffff';

  const title      = content.title      || '';
  const titleAlign = content.titleAlign || 'left';
  const listStyle  = content.listStyle  || 'bullet';
  const bulletChar = content.bulletChar || DEFAULT_BULLET_CHAR;
  const items      = content.items      || [];

  /**
   * editingState describes what is currently being edited:
   *   null                          — nothing active
   *   { type: 'add' }               — inline new-item row at the bottom
   *   { type: 'edit', itemId }      — an existing item is being edited in-place
   */
  const [editingState, setEditingState] = useState(null);
  const [editingText,  setEditingText]  = useState('');

  const scrollRef    = useRef(null);
  const inputRef     = useRef(null);

  // Prevents the blur handler from double-firing a cancel after Enter/Escape
  // already acted (blur always fires after a key commit when the input unmounts).
  const didCommitRef = useRef(false);

  // ── Focus helper ──────────────────────────────────────────────

  const focusInput = (scrollToBottom = false) => {
    requestAnimationFrame(() => {
      if (scrollToBottom && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      if (inputRef.current) {
        inputRef.current.focus();
        // Place cursor at end of existing text
        const len = inputRef.current.value.length;
        inputRef.current.selectionStart = len;
        inputRef.current.selectionEnd   = len;
      }
    });
  };

  // ── Activate add mode when the + button is pressed ────────────

  useEffect(() => {
    if (isAddingItem) {
      setEditingState({ type: 'add' });
      setEditingText('');
      didCommitRef.current = false;
      focusInput(true);
    }
    // When isAddingItem resets to false from outside we don't need to act here —
    // commit/cancel handlers already clear editingState themselves.
  }, [isAddingItem]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Item click → enter edit mode ──────────────────────────────

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    // Already editing this item — don't restart (would reset cursor position)
    if (editingState?.type === 'edit' && editingState.itemId === item.id) return;
    setEditingState({ type: 'edit', itemId: item.id });
    setEditingText(item.text);
    didCommitRef.current = false;
    focusInput(false);
  };

  // ── Shared commit / cancel ─────────────────────────────────────

  const commitCurrent = () => {
    const trimmed = editingText.trim();
    if (editingState?.type === 'add') {
      if (trimmed) onAddItem?.(trimmed);
      else         onCancelAdd?.();
    } else if (editingState?.type === 'edit') {
      // Save even if empty — caller decides (ComponentTile maps empty → cancel)
      onSaveEdit?.(editingState.itemId, trimmed);
    }
    setEditingState(null);
    setEditingText('');
  };

  const cancelCurrent = () => {
    const wasAdding = editingState?.type === 'add';
    setEditingState(null);
    setEditingText('');
    if (wasAdding) onCancelAdd?.();
  };

  // ── Shared keyboard handler (used by both add and edit inputs) ─

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      didCommitRef.current = true;
      commitCurrent();
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      didCommitRef.current = true;
      cancelCurrent();
    }
  };

  // ── Shared blur handler ────────────────────────────────────────

  const handleBlur = () => {
    if (!didCommitRef.current) {
      cancelCurrent();
    }
    // Reset so the next edit session starts clean
    didCommitRef.current = false;
  };

  // ── Shared inline input element ────────────────────────────────
  // Single definition used in both the add row and existing item rows (DRY).

  const renderInlineInput = (placeholder = '') => (
    <input
      ref={inputRef}
      className="list-inline-input"
      value={editingText}
      onChange={(e) => setEditingText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      style={{ color: textColor, caretColor: textColor }}
    />
  );

  // ── Marker renderer ────────────────────────────────────────────

  const renderMarker = (idx) => {
    if (listStyle === 'numbered') {
      return (
        <span className="list-item-marker list-item-marker--numbered">
          {idx + 1}.
        </span>
      );
    }
    if (listStyle === 'bullet') {
      return (
        <span className="list-item-marker list-item-marker--bullet">
          {bulletChar}
        </span>
      );
    }
    return null;
  };

  const showList = items.length > 0 || editingState?.type === 'add';

  return (
    <div
      className="list-component"
      style={{
        backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
        borderColor: `${textColor}33`,
        color: textColor,
      }}
    >
      {title && (
        <h2
          className="list-component-title"
          style={{ color: textColor, textAlign: titleAlign }}
        >
          {title}
        </h2>
      )}

      <div className="list-component-scroll" ref={scrollRef}>
        {showList ? (
          <ul className="list-component-list">
            {items.map((item, idx) => {
              const isEditing = editingState?.type === 'edit' && editingState.itemId === item.id;
              return (
                <li
                  key={item.id}
                  className={`list-component-item${isEditing ? ' list-component-item--adding' : ''}`}
                  style={{ color: textColor }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {renderMarker(idx)}
                  {isEditing
                    ? renderInlineInput()
                    : <span className="list-item-text">{item.text}</span>
                  }
                </li>
              );
            })}

            {/* Inline add row at the bottom */}
            {editingState?.type === 'add' && (
              <li
                className="list-component-item list-component-item--adding"
                style={{ color: textColor }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {renderMarker(items.length)}
                {renderInlineInput('Type and press Enter…')}
              </li>
            )}
          </ul>
        ) : (
          <p className="list-component-empty" style={{ color: `${textColor}55` }}>
            No items yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ListComponent;
