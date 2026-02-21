import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import TestComponent from './TestComponent';
import ComponentMenu from './ComponentMenu';
import RemoveConfirmDialog from './RemoveConfirmDialog';
import ConfigureDialog from './ConfigureDialog';
import TestComponentConfig from './TestComponentConfig';
import useBoardStore from '../stores/useBoardStore';
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
  const { removeComponent } = useBoardStore();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

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
      // Future component types will be added here
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
      // Future component types will have their own config panels
      default:
        return <div>No configuration available</div>;
    }
  };

  const handleTileMouseDown = (e) => {
    // If menu or dialog is open, prevent drag
    if (showRemoveDialog || showConfigDialog) {
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
