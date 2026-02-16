import React from 'react';
import './Viewport.css';

/**
 * Viewport Component
 * 
 * Acts as the fixed container that matches the browser window.
 * The board is translated inside this viewport for panning.
 * 
 * This component provides the "window" through which the user
 * views the larger board workspace.
 */
const Viewport = ({ children }) => {
  return (
    <div className="viewport">
      {children}
    </div>
  );
};

export default Viewport;
