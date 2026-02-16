import React from 'react';
import TestComponent from './TestComponent';
import './ComponentTile.css';

/**
 * ComponentTile
 * 
 * Wrapper for individual components placed on the board.
 * This is the container that react-grid-layout manages.
 * Renders the appropriate component type based on the component data.
 */
const ComponentTile = ({ component }) => {
  const renderComponent = () => {
    switch (component.type) {
      case 'test':
        return <TestComponent id={component.id} />;
      // Future component types will be added here
      default:
        return <div>Unknown Component Type</div>;
    }
  };

  return (
    <div className="component-tile">
      {renderComponent()}
    </div>
  );
};

export default ComponentTile;
