import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import TestComponent from './types/TestComponent';
import ClockComponent from './types/ClockComponent';
import ListComponent from './types/ListComponent';
import ComponentMenu from './ComponentMenu';
import RemoveConfirmDialog from '../dialogs/RemoveConfirmDialog';
import ConfigureDialog from '../dialogs/ConfigureDialog';
import TestComponentConfig from './types/TestComponentConfig';
import ClockComponentConfig from './types/ClockComponentConfig';
import ListComponentConfig from './types/ListComponentConfig';
import useBoardStore from '../../stores/useBoardStore';
import './ComponentTile.css';

/**
 * ComponentTile
 * 
 * Wrapper for individual components placed on the board.
 * This is the container that react-grid-layout manages.
 * Renders the appropriate component type based on the component data.
 * Includes menu, configuration dialog, and remove confirmation.
 */
const ComponentTile = ({ component }) => {
  const { removeComponent, components, updateComponent } = useBoardStore();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [isAddingListItem, setIsAddingListItem] = useState(false);

  const handleConfigure = () => {
    setShowConfigDialog(true);
  };

  const handleRemove = () => {
    setShowRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    removeComponent(component.id);
    setShowRemoveDialog(false);
  };

  const handleCancelRemove = () => {
    setShowRemoveDialog(false);
  };

  const handleCloseConfig = () => {
    setShowConfigDialog(false);
  };

  // ── List inline quick-add ──────────────────────────────────────

  const handleInlineAddItem = (text) => {
    const current = components[component.id];
    const items = current?.content?.items || [];
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text,
    };
    updateComponent(component.id, {
      content: { ...current?.content, items: [...items, newItem] },
    });
    setIsAddingListItem(false);
  };

  const handleCancelInlineAdd = () => {
    setIsAddingListItem(false);
  };

  const handleSaveEdit = (itemId, text) => {
    const current = components[component.id];
    const items = current?.content?.items || [];
    // If text was cleared, treat as a cancel (don't save blank items)
    if (!text) return;
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, text } : item
    );
    updateComponent(component.id, {
      content: { ...current?.content, items: newItems },
    });
  };

  const handleDeleteItem = (itemId) => {
    const current = components[component.id];
    const items = current?.content?.items || [];
    updateComponent(component.id, {
      content: { ...current?.content, items: items.filter((item) => item.id !== itemId) },
    });
  };

  const handleMoveItem = (itemId, direction) => {
    const current = components[component.id];
    const items = current?.content?.items || [];
    const idx = items.findIndex((item) => item.id === itemId);
    if (idx === -1) return;
    if (direction === 'up'   && idx === 0)               return;
    if (direction === 'down' && idx === items.length - 1) return;
    const newItems  = [...items];
    const swapIdx   = direction === 'up' ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    updateComponent(component.id, {
      content: { ...current?.content, items: newItems },
    });
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'test':
        return (
          <TestComponent 
            id={component.id}
            style={component.style}
            content={component.content}
          />
        );
      case 'clock':
        return (
          <ClockComponent
            id={component.id}
            style={component.style}
            content={component.content}
          />
        );
      case 'list':
        return (
          <ListComponent
            id={component.id}
            style={component.style}
            content={component.content}
            isAddingItem={isAddingListItem}
            onAddItem={handleInlineAddItem}
            onCancelAdd={handleCancelInlineAdd}
            onSaveEdit={handleSaveEdit}
            onDeleteItem={handleDeleteItem}
            onMoveItem={handleMoveItem}
            gridW={component.layout?.w ?? 0}
          />
        );
      default:
        return <div>Unknown Component Type</div>;
    }
  };

  const renderConfigDialog = () => {
    switch (component.type) {
      case 'test':
        return (
          <TestComponentConfig componentId={component.id} />
        );
      case 'clock':
        return (
          <ClockComponentConfig componentId={component.id} />
        );
      case 'list':
        return (
          <ListComponentConfig componentId={component.id} />
        );
      default:
        return <div>No configuration available</div>;
    }
  };

  const handleTileMouseDown = (e) => {
    // If any dialog is open, prevent drag
    if (showRemoveDialog || showConfigDialog || isAddingListItem) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <>
      <div 
        className="component-tile"
        onMouseDown={handleTileMouseDown}
      >
        <ComponentMenu
          componentId={component.id}
          onConfigure={handleConfigure}
          onRemove={handleRemove}
        />

        {/* Quick-add button — only rendered for list components */}
        {component.type === 'list' && (
          <button
            className="tile-quick-add-btn"
            title="Add list item"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsAddingListItem(true); }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            +
          </button>
        )}

        {renderComponent()}
      </div>

      {/* Dialogs rendered at document root using portals (not constrained by component size) */}
      {showRemoveDialog && createPortal(
        <RemoveConfirmDialog
          componentId={component.id}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />,
        document.body
      )}

      {showConfigDialog && createPortal(
        <ConfigureDialog
          title="Configure Component"
          onClose={handleCloseConfig}
        >
          {renderConfigDialog()}
        </ConfigureDialog>,
        document.body
      )}

    </>
  );
};

export default ComponentTile;
