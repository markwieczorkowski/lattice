import React, { useState, useRef } from 'react';
import useBoardStore from '../../stores/useBoardStore';
import './BoardSettingsDialog.css';

/**
 * BoardSettingsDialog
 * 
 * Comprehensive board settings panel with Apply/Cancel.
 * Changes are staged locally and applied on Apply button click.
 * 
 * Settings:
 * - Current Board (placeholder for future multi-board)
 * - Show Test Controls checkbox
 * - Board Size (width x height)
 * - Board Background (solid/gradient/image)
 */
const BoardSettingsDialog = ({ onClose }) => {
  const { board, updateBoard, uploadedImages, addUploadedImage } = useBoardStore();
  const fileInputRef = useRef(null);

  // Local state for staged changes
  const [currentBoard, setCurrentBoard] = useState('default');
  const [showTestControls, setShowTestControls] = useState(board.showTestControls);
  const [showGrid, setShowGrid] = useState(board.showGrid);
  const [overlapMode, setOverlapMode] = useState(board.overlapMode);
  const [width, setWidth] = useState(board.width);
  const [height, setHeight] = useState(board.height);
  const [backgroundType, setBackgroundType] = useState(board.background.type);
  const [solidColor, setSolidColor] = useState(board.background.solidColor);
  const [gradientColor1, setGradientColor1] = useState(board.background.gradientColors[0]);
  const [gradientColor2, setGradientColor2] = useState(board.background.gradientColors[1]);
  const [gradientDirection, setGradientDirection] = useState(board.background.gradientDirection);
  const [imageUrl, setImageUrl] = useState(board.background.imageUrl);

  const handleCancel = () => {
    onClose();
  };

  const handleApply = () => {
    // Calculate minimum dimensions (50% of viewport)
    const minWidth = Math.ceil(window.innerWidth * 0.5 / board.gridSize) * board.gridSize;
    const minHeight = Math.ceil(window.innerHeight * 0.5 / board.gridSize) * board.gridSize;
    
    // Enforce minimum size and round to grid size
    const newWidth = Math.max(minWidth, Math.round((parseInt(width) || 2550) / board.gridSize) * board.gridSize);
    const newHeight = Math.max(minHeight, Math.round((parseInt(height) || 2040) / board.gridSize) * board.gridSize);
    
    // Apply all settings to store
    updateBoard({
      showTestControls,
      showGrid,
      overlapMode,
      width: newWidth,
      height: newHeight,
      background: {
        type: backgroundType,
        solidColor,
        gradientColors: [gradientColor1, gradientColor2],
        gradientDirection,
        imageUrl,
        imageName: board.background.imageName,
      },
    });
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const imageName = file.name;
      
      // Add to store
      addUploadedImage(imageName, dataUrl);
      
      // Set as current background
      setImageUrl(dataUrl);
      setBackgroundType('image');
      
      // Update board config to include image name
      updateBoard({
        background: {
          ...board.background,
          imageName,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectImage = (e) => {
    const selectedName = e.target.value;
    if (selectedName && uploadedImages[selectedName]) {
      setImageUrl(uploadedImages[selectedName]);
    }
  };

  return (
    <div className="board-settings-backdrop" onClick={onClose}>
      <div className="board-settings-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="board-settings-header">
          <h3>Board Settings</h3>
          <button 
            className="board-settings-close" 
            onClick={handleCancel}
            title="Close"
          >
            ×
          </button>
        </div>

        <div className="board-settings-content">
          {/* Current Board Selector */}
          <div className="settings-section">
            <label className="settings-label">Current Board</label>
            <select 
              className="settings-select"
              value={currentBoard}
              onChange={(e) => setCurrentBoard(e.target.value)}
            >
              <option value="default">Default</option>
            </select>
            <div className="settings-hint">Multi-board support coming soon</div>
          </div>

          {/* Show Test Controls */}
          <div className="settings-section">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={showTestControls}
                onChange={(e) => setShowTestControls(e.target.checked)}
                className="settings-checkbox"
              />
              <span>Show Test Controls</span>
            </label>
          </div>

          {/* Show Grid */}
          <div className="settings-section">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="settings-checkbox"
              />
              <span>Show Grid</span>
            </label>
          </div>

          {/* Overlap Mode */}
          <div className="settings-section">
            <label className="settings-label">Overlap Mode</label>
            <select 
              className="settings-select"
              value={overlapMode}
              onChange={(e) => setOverlapMode(e.target.value)}
            >
              <option value="no-overlap">No Overlap</option>
              <option value="overlap">Overlap</option>
              <option value="bump">Push Down</option>
            </select>
            <div className="settings-hint">
              {overlapMode === 'no-overlap' && 'Components cannot overlap each other'}
              {overlapMode === 'overlap' && 'Components can freely overlap'}
              {overlapMode === 'bump' && 'Components push others downward when moved into occupied space'}
            </div>
          </div>

          {/* Board Size */}
          <div className="settings-section">
            <label className="settings-label">Board Size</label>
            <div className="board-size-inputs">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="size-input"
                placeholder="Width"
                min="300"
                step="30"
              />
              <span className="size-separator">×</span>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="size-input"
                placeholder="Height"
                min="300"
                step="30"
              />
              <span className="size-unit">px</span>
            </div>
            <div className="settings-hint">Dimensions should be divisible by grid size (30px)</div>
          </div>

          {/* Board Background */}
          <div className="settings-section">
            <label className="settings-label">Board Background</label>
            <select 
              className="settings-select"
              value={backgroundType}
              onChange={(e) => setBackgroundType(e.target.value)}
            >
              <option value="solid">Solid Color</option>
              <option value="gradient">Gradient Color</option>
              <option value="image">Image</option>
            </select>

            {/* Solid Color Option */}
            {backgroundType === 'solid' && (
              <div className="background-option">
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="settings-color-picker"
                  />
                  <span className="color-value">{solidColor}</span>
                </div>
              </div>
            )}

            {/* Gradient Color Option */}
            {backgroundType === 'gradient' && (
              <div className="background-option">
                <div className="gradient-colors">
                  <div className="color-picker-group">
                    <label className="color-picker-label">Color 1</label>
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="settings-color-picker"
                    />
                    <span className="color-value">{gradientColor1}</span>
                  </div>
                  <div className="color-picker-group">
                    <label className="color-picker-label">Color 2</label>
                    <input
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="settings-color-picker"
                    />
                    <span className="color-value">{gradientColor2}</span>
                  </div>
                </div>
                <div className="gradient-direction">
                  <label className="settings-label">Direction</label>
                  <select 
                    className="settings-select"
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="diagonal">Diagonal</option>
                  </select>
                </div>
              </div>
            )}

            {/* Image Option */}
            {backgroundType === 'image' && (
              <div className="background-option">
                <div className="image-controls">
                  <select 
                    className="settings-select"
                    value={imageUrl || ''}
                    onChange={handleSelectImage}
                  >
                    <option value="">Select an image...</option>
                    {Object.keys(uploadedImages).map((name) => (
                      <option key={name} value={uploadedImages[name]}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                {imageUrl && (
                  <div className="image-preview">
                    <img src={imageUrl} alt="Background preview" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="board-settings-actions">
          <button className="settings-button cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="settings-button apply-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardSettingsDialog;
