import React from 'react';
import './TestComponent.css';

/**
 * TestComponent
 * 
 * A simple test component for Phase 1B demonstration.
 * Displays component ID and title.
 */
const TestComponent = ({ id }) => {
  return (
    <div className="test-component">
      <h2>Test Component</h2>
      <div className="test-component-id">{id}</div>
    </div>
  );
};

export default TestComponent;
