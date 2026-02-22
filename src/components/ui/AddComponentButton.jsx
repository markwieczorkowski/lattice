import React, { useState } from 'react';
import { getAvailableComponentTypes } from '../../utils/componentRegistry';
import './AddComponentButton.css';

/**
 * AddComponentButton
 * 
 * Floating action button in lower-right corner.
 * Opens a menu to select component type for placement.
 */
const AddComponentButton = ({ onSelectType }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const componentTypes = getAvailableComponentTypes();

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleSelectType = (typeId) => {
    setMenuOpen(false);
    onSelectType(typeId);
  };

  return (
    <div className="add-component-container">
      {/* Component type menu */}
      {menuOpen && (
        <div className="component-type-menu">
          <div className="component-type-menu-header">
            Select Component Type
          </div>
          {componentTypes.map((type) => (
            <button
              key={type.id}
              className="component-type-option"
              onClick={() => handleSelectType(type.id)}
            >
              <span className="component-type-name">{type.name}</span>
              <span className="component-type-size">
                {type.defaultWidth}×{type.defaultHeight}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        className={`add-component-button ${menuOpen ? 'active' : ''}`}
        onClick={handleToggleMenu}
        title="Add Component"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default AddComponentButton;
