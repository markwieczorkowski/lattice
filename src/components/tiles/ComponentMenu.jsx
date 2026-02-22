import React, { useState, useRef, useEffect } from 'react';
import './ComponentMenu.css';

/**
 * ComponentMenu
 * 
 * Three-line menu button in upper-right corner of components.
 * Opens dropdown menu with component-specific options.
 * All components have "Configure" and "Remove" options.
 */
const ComponentMenu = ({ componentId, onConfigure, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent triggering drag
    e.preventDefault(); // Prevent default behavior
    setIsOpen(!isOpen);
  };

  const handleConfigure = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
    onConfigure();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
    onRemove();
  };

  const handleMenuClick = (e) => {
    // Prevent any clicks in the menu from propagating
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div 
      className="component-menu" 
      ref={menuRef}
      onMouseDown={handleMenuClick}
      onClick={handleMenuClick}
    >
      <button 
        className="component-menu-button"
        onClick={handleToggle}
        onMouseDown={(e) => e.stopPropagation()}
        title="Component Menu"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="component-menu-dropdown" onClick={(e) => e.stopPropagation()}>
          <button className="component-menu-item" onClick={handleConfigure}>
            <span className="menu-item-icon">⚙️</span>
            <span>Configure</span>
          </button>
          <button className="component-menu-item component-menu-item-danger" onClick={handleRemove}>
            <span className="menu-item-icon">🗑️</span>
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentMenu;
