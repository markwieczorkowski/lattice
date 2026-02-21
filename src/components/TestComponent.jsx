import React from 'react';
import './TestComponent.css';

/**
 * TestComponent
 * 
 * Configurable test component for Phase 1C.
 * Displays customizable title and ID with configurable styling.
 */
const TestComponent = ({ id, style = {}, content = {} }) => {
  // Extract style properties with defaults
  const backgroundColor = style.backgroundColor || '#404040';
  const backgroundOpacity = style.backgroundOpacity ?? 0.5;
  const textColor = style.textColor || '#ffffff';

  // Extract content properties with defaults (allow empty string)
  const title = content.title !== undefined ? content.title : 'Test Component';

  // Convert hex color to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      className="test-component"
      style={{
        backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
        color: textColor,
      }}
    >
      <h2 style={{ color: textColor }}>{title}</h2>
      <div className="test-component-id" style={{ color: textColor }}>
        {id}
      </div>
    </div>
  );
};

export default TestComponent;
