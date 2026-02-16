# Component Hierarchy - Phase 1A

## Visual Structure

```
App
└── Viewport (fixed, 100vw × 100vh)
    ├── Board (2560×2048px, transforms with pan)
    │   ├── .board-grid (visual grid overlay)
    │   └── {children} (components in Phase 1B+)
    └── BoardControls (fixed overlay, top-left)
```

## Component Responsibilities

### App.jsx
- **Role:** Application root
- **Responsibilities:**
  - Load persisted state on mount
  - Compose viewport and board
  - Top-level app structure

### Viewport.jsx
- **Role:** Fixed viewing window
- **Responsibilities:**
  - Match browser window size
  - Clip content outside bounds
  - Provide pan container
  - Prevent text selection

### Board.jsx
- **Role:** Pannable workspace
- **Responsibilities:**
  - Render board at configured dimensions
  - Handle mouse events for panning
  - Apply CSS transforms for pan/zoom
  - Render grid overlay
  - Contain all workspace components

### BoardControls.jsx
- **Role:** UI controls overlay
- **Responsibilities:**
  - Display board information
  - Show real-time pan coordinates
  - Provide reset viewport button
  - (Future: full settings panel)

## State Flow

```
useBoardStore (Zustand)
    ↓
    ├─→ Board (reads: board, viewport; writes: viewport pan)
    ├─→ BoardControls (reads: board, viewport; writes: viewport reset)
    └─→ App (loads from localStorage on mount)
```

## Event Flow - Panning

```
User drags mouse on board
    ↓
Board.handleMouseDown()
    ↓
Board.handleMouseMove() (while dragging)
    ↓
useBoardStore.setViewportPan()
    ↓
Board re-reads viewport state
    ↓
CSS transform updates
    ↓
Board visually moves
```

## Styling Architecture

### Global Styles (index.css)
- Reset margins/padding
- Full viewport coverage
- Disable overflow

### App Styles (App.css)
- Application container
- Font family

### Component Styles (*.css)
- **Viewport.css:** Fixed positioning, overflow hidden
- **Board.css:** Transform behavior, grid overlay, cursors
- **BoardControls.css:** Overlay panel styling

## Data Flow - Persistence

```
App mounts
    ↓
loadFromLocalStorage()
    ↓
Parse saved JSON
    ↓
Restore board/viewport/components state
    ↓
UI reflects saved state
```

## Transform Math

Board position is calculated as:
```
transform: translate(panX, panY) scale(zoom)
```

Where:
- `panX`, `panY` = cumulative drag distance from origin
- `zoom` = scale factor (default 1.0, not yet exposed in UI)
- Origin = top-left corner (0, 0)

## Grid Rendering

Grid is rendered as CSS background:
```css
background-image: 
  linear-gradient(to right, color 1px, transparent 1px),
  linear-gradient(to bottom, color 1px, transparent 1px);
background-size: gridSize×gridSize;
```

This creates a repeating grid pattern without DOM elements.

## Future Extensions (Post Phase 1A)

### Phase 1B - Components
```
Board
├── .board-grid
└── ReactGridLayout
    ├── ComponentTile (id: 1)
    ├── ComponentTile (id: 2)
    └── ComponentTile (id: 3)
```

### Phase 1C - Component Menus
```
ComponentTile
├── Component Content
└── ComponentMenu (top-right)
    ├── Delete
    ├── Background Color
    └── Style Options
```

### Phase 1D - Settings Panel
```
App
└── Viewport
    ├── Board
    ├── BoardControls
    └── SettingsPanel (side panel)
        ├── Board Name
        ├── Board Size
        ├── Background
        └── Overlap Mode
```

---

**Current Phase:** 1A Complete ✅  
**Next Phase:** 1B - react-grid-layout Integration
