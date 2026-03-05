import React, { useState } from 'react';
import useBoardStore from '../../../stores/useBoardStore';
import { BULLET_CHARS, DEFAULT_BULLET_CHAR } from './ListComponent';
import './ListComponentConfig.css';

/**
 * Generate a unique item ID.
 */
const generateItemId = () =>
  `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

/**
 * ListComponentConfig
 *
 * Configuration panel for the List component.
 * All style and content changes apply immediately as live preview.
 *
 * Settings:
 *   - Background color + opacity
 *   - Text color
 *   - List title text + alignment (left / center / right)
 *   - List style (bullet / numbered / none)
 *   - List items: add, select, edit, move up/down, delete
 */
const ListComponentConfig = ({ componentId }) => {
  const { components, updateComponent } = useBoardStore();
  const component = components[componentId];

  // Index of the currently selected item in the list (UI-only state)
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!component) return null;

  const bgColor   = component.style?.backgroundColor  || '#404040';
  const bgOpacity = component.style?.backgroundOpacity ?? 0.5;
  const textColor = component.style?.textColor         || '#ffffff';

  const title      = component.content?.title      !== undefined ? component.content.title : '';
  const titleAlign = component.content?.titleAlign || 'left';
  const listStyle  = component.content?.listStyle  || 'bullet';
  const bulletChar = component.content?.bulletChar || DEFAULT_BULLET_CHAR;
  const items      = component.content?.items      || [];

  const updateStyle   = (patch) => updateComponent(componentId, { style:   { ...component.style,   ...patch } });
  const updateContent = (patch) => updateComponent(componentId, { content: { ...component.content, ...patch } });
  const updateItems   = (newItems) => updateContent({ items: newItems });

  const stopProp = (e) => e.stopPropagation();

  // ── Item operations ────────────────────────────────────────────

  const handleAddItem = () => {
    const newItem  = { id: generateItemId(), text: '' };
    const newItems = [...items, newItem];
    updateItems(newItems);
    setSelectedIdx(newItems.length - 1);
  };

  const handleDeleteItem = () => {
    if (selectedIdx === null) return;
    const newItems = items.filter((_, i) => i !== selectedIdx);
    updateItems(newItems);
    setSelectedIdx(newItems.length > 0 ? Math.min(selectedIdx, newItems.length - 1) : null);
  };

  const handleMoveUp = () => {
    if (selectedIdx === null || selectedIdx === 0) return;
    const newItems = [...items];
    [newItems[selectedIdx - 1], newItems[selectedIdx]] = [newItems[selectedIdx], newItems[selectedIdx - 1]];
    updateItems(newItems);
    setSelectedIdx(selectedIdx - 1);
  };

  const handleMoveDown = () => {
    if (selectedIdx === null || selectedIdx === items.length - 1) return;
    const newItems = [...items];
    [newItems[selectedIdx], newItems[selectedIdx + 1]] = [newItems[selectedIdx + 1], newItems[selectedIdx]];
    updateItems(newItems);
    setSelectedIdx(selectedIdx + 1);
  };

  const handleEditItem = (text) => {
    if (selectedIdx === null) return;
    const newItems = items.map((item, i) => (i === selectedIdx ? { ...item, text } : item));
    updateItems(newItems);
  };

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  return (
    <div
      className="list-component-config"
      onMouseDown={stopProp}
      onClick={stopProp}
    >
      {/* ── Appearance ──────────────────────────────────────────── */}
      <div className="lc-section">
        <label className="lc-label">Background Color</label>
        <div className="lc-color-row">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="lc-color-picker"
          />
          <span className="lc-color-value">{bgColor}</span>
        </div>
      </div>

      <div className="lc-section">
        <label className="lc-label">
          Background Opacity
          <span className="lc-sublabel">{Math.round(bgOpacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={bgOpacity}
          onChange={(e) => updateStyle({ backgroundOpacity: parseFloat(e.target.value) })}
          className="lc-slider"
        />
      </div>

      <div className="lc-section">
        <label className="lc-label">Text Color</label>
        <div className="lc-color-row">
          <input
            type="color"
            value={textColor}
            onChange={(e) => updateStyle({ textColor: e.target.value })}
            className="lc-color-picker"
          />
          <span className="lc-color-value">{textColor}</span>
        </div>
      </div>

      {/* ── Title ───────────────────────────────────────────────── */}
      <div className="lc-section">
        <label className="lc-label">List Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => updateContent({ title: e.target.value })}
          className="lc-text-input"
          placeholder="Optional heading (leave blank to hide)"
          maxLength={60}
        />
      </div>

      <div className="lc-section">
        <label className="lc-label">Title Alignment</label>
        <div className="lc-toggle-group">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              className={`lc-toggle-btn${titleAlign === align ? ' active' : ''}`}
              onClick={() => updateContent({ titleAlign: align })}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── List style ──────────────────────────────────────────── */}
      <div className="lc-section">
        <label className="lc-label">List Style</label>
        <div className="lc-toggle-group">
          <button
            className={`lc-toggle-btn${listStyle === 'bullet' ? ' active' : ''}`}
            onClick={() => updateContent({ listStyle: 'bullet' })}
          >
            • Bullets
          </button>
          <button
            className={`lc-toggle-btn${listStyle === 'numbered' ? ' active' : ''}`}
            onClick={() => updateContent({ listStyle: 'numbered' })}
          >
            1. Numbers
          </button>
          <button
            className={`lc-toggle-btn${listStyle === 'none' ? ' active' : ''}`}
            onClick={() => updateContent({ listStyle: 'none' })}
          >
            — Plain
          </button>
        </div>
      </div>

      {/* ── Bullet character picker (visible only when listStyle === 'bullet') ── */}
      {listStyle === 'bullet' && (
        <div className="lc-section">
          <label className="lc-label">Bullet Style</label>
          <div className="lc-bullet-grid">
            {BULLET_CHARS.map((bc) => (
              <button
                key={bc.value}
                className={`lc-bullet-btn${bulletChar === bc.value ? ' active' : ''}`}
                onClick={() => updateContent({ bulletChar: bc.value })}
                title={bc.label}
              >
                {bc.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── List items ──────────────────────────────────────────── */}
      <div className="lc-section">
        <label className="lc-label">List Items</label>

        {/* Scrollable item list */}
        <div className="lc-item-list" role="listbox">
          {items.length === 0 && (
            <div className="lc-item-empty">No items — click Add to start</div>
          )}
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`lc-item-row${selectedIdx === idx ? ' selected' : ''}`}
              onClick={() => setSelectedIdx(idx)}
              role="option"
              aria-selected={selectedIdx === idx}
            >
              <span className="lc-item-marker">
                {listStyle === 'numbered' ? `${idx + 1}.` : listStyle === 'bullet' ? bulletChar : '—'}
              </span>
              <span className="lc-item-text">{item.text || <em className="lc-item-placeholder">empty</em>}</span>
            </div>
          ))}
        </div>

        {/* Edit selected item */}
        <div className="lc-item-edit-row">
          <input
            type="text"
            className="lc-text-input lc-item-edit-input"
            value={selectedItem ? selectedItem.text : ''}
            onChange={(e) => handleEditItem(e.target.value)}
            placeholder={selectedIdx !== null ? 'Edit item text…' : 'Select an item to edit'}
            disabled={selectedIdx === null}
          />
        </div>

        {/* Action buttons */}
        <div className="lc-item-actions">
          <div className="lc-item-actions-left">
            <button
              className="lc-action-btn"
              onClick={handleMoveUp}
              disabled={selectedIdx === null || selectedIdx === 0}
              title="Move up"
            >
              ↑ Up
            </button>
            <button
              className="lc-action-btn"
              onClick={handleMoveDown}
              disabled={selectedIdx === null || selectedIdx === items.length - 1}
              title="Move down"
            >
              ↓ Down
            </button>
            <button
              className="lc-action-btn lc-action-delete"
              onClick={handleDeleteItem}
              disabled={selectedIdx === null}
              title="Delete selected item"
            >
              Delete
            </button>
          </div>
          <button
            className="lc-action-btn lc-action-add"
            onClick={handleAddItem}
            title="Add new item"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListComponentConfig;
