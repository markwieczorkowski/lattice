import React from 'react';
import useBoardStore from '../../../stores/useBoardStore';
import './TestComponentConfig.css';

/**
 * TestComponentConfig
 * 
 * Configuration panel for TestComponent.
 * Includes:
 * - Background color picker
 * - Background opacity slider
 * - H2 title text input
 * - Text color picker
 * 
 * Changes apply immediately to the component.
 */
const TestComponentConfig = ({ componentId }) => {
  const { components, updateComponent } = useBoardStore();
  const component = components[componentId];

  if (!component) return null;

  // Get current values with defaults (but allow empty strings)
  const bgColor = component.style?.backgroundColor || '#404040';
  const bgOpacity = component.style?.backgroundOpacity ?? 0.5;
  const title = component.content?.title !== undefined ? component.content.title : 'Test Component';
  const textColor = component.style?.textColor || '#ffffff';

  const handleBackgroundColorChange = (e) => {
    updateComponent(componentId, {
      style: {
        ...component.style,
        backgroundColor: e.target.value,
      },
    });
  };

  const handleOpacityChange = (e) => {
    updateComponent(componentId, {
      style: {
        ...component.style,
        backgroundOpacity: parseFloat(e.target.value),
      },
    });
  };

  const handleTitleChange = (e) => {
    updateComponent(componentId, {
      content: {
        ...component.content,
        title: e.target.value,
      },
    });
  };

  const handleTextColorChange = (e) => {
    updateComponent(componentId, {
      style: {
        ...component.style,
        textColor: e.target.value,
      },
    });
  };

  const handleMouseDown = (e) => {
    // Prevent drag/pan when interacting with config controls
    e.stopPropagation();
  };

  const handleClick = (e) => {
    // Prevent clicks from propagating
    e.stopPropagation();
  };

  return (
    <div 
      className="test-component-config"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="config-section">
        <label className="config-label">Background Color</label>
        <div className="config-color-input">
          <input
            type="color"
            value={bgColor}
            onChange={handleBackgroundColorChange}
            className="color-picker"
          />
          <span className="color-value">{bgColor}</span>
        </div>
      </div>

      <div className="config-section">
        <label className="config-label">
          Background Opacity
          <span className="config-value">{Math.round(bgOpacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={bgOpacity}
          onChange={handleOpacityChange}
          className="opacity-slider"
        />
      </div>

      <div className="config-section">
        <label className="config-label">Title Text</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-input"
          placeholder="Enter title..."
        />
      </div>

      <div className="config-section">
        <label className="config-label">Text Color</label>
        <div className="config-color-input">
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="color-picker"
          />
          <span className="color-value">{textColor}</span>
        </div>
      </div>
    </div>
  );
};

export default TestComponentConfig;
