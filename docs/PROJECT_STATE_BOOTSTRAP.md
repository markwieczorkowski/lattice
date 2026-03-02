# Spatial Board UI - Project State Bootstrap

**Last Updated:** February 28, 2026  
**Phase Status:** Phase 1 Complete (A-E)  
**Purpose:** Onboard AI assistants to current project state

---

## 1. Project Overview

A spatial, board-based UI framework built with **React**, **react-grid-layout (RGL)**, and **Zustand**. Users can create pannable 2D workspaces with draggable/resizable components, multiple board management, and persistent state.

**Key Document:** `/docs/spatial_board_ui_phase_1_system_architecture_llm_build_guide.md` - Full architecture specification

---

## 2. Technology Stack

**Core:**
- React 18.3.1 (functional components, hooks)
- Vite 6.0.3 (build tool, dev server)
- Zustand 5.0.2 (state management)
- react-grid-layout 1.4.4 (grid layout, drag/resize)

**Development:**
- npm (package management)
- Git (version control)
- localStorage (Phase 1 persistence)

**Build Commands:**
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview build
```

---

## 3. Project Structure

```
/home/mark/Code/visworkboard/
├── docs/                    # All documentation
├── public/
│   └── images/              # Uploaded background images
├── src/
│   ├── components/          # All React components
│   │   ├── board/          # Board workspace (Board, Viewport, BoardControls)
│   │   ├── tiles/          # Component tiles and menu
│   │   │   └── types/      # Component type implementations (TestComponent)
│   │   ├── dialogs/        # All dialog components (4 dialogs)
│   │   └── ui/             # UI buttons (Add, LoadSave, BoardSettings)
│   ├── stores/
│   │   └── useBoardStore.js   # Zustand state management
│   ├── utils/
│   │   ├── componentRegistry.js   # Component type definitions
│   │   └── backgroundUtils.js     # Background utilities
│   ├── App.jsx             # Root component
│   ├── main.jsx            # React entry point
│   └── index.css/App.css   # Global styles
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

---

## 4. Phase 1 Implementation Status

### ✅ Phase 1A - Core Board Infrastructure
- Pannable 2D workspace (board larger than viewport)
- Transform-based panning with boundaries (1 grid square overflow limit)
- Visual grid overlay (30px squares, togglable)
- Dark viewport background (#2a2a2a)
- Zoom transformation scaffolding (not active yet)

### ✅ Phase 1B - react-grid-layout Integration
- Click-to-place component workflow with shadow preview
- Grid-snapped drag and resize (30px grid)
- Collision detection (No Overlap, Overlap, Push Down modes)
- Board boundary enforcement (all edges)
- TestComponent (4×4 default, configurable, 2×2 minimum)

### ✅ Phase 1C - Component Framework
- Component menu button (⋮) with Configure/Remove options
- Component-specific configuration dialogs (live preview)
- TestComponent config: background color/opacity, title text, text color
- React Portal-based dialogs (viewport-centered)
- Event propagation isolation (no conflicts with RGL/board panning)
- Dark theme UI (75% opacity, frosted glass effect)

### ✅ Phase 1D - Board Settings Panel
- Board settings button and comprehensive dialog
- Settings: Show test controls, show grid, overlap mode, board size, background
- Background types: Solid color, gradient (2 colors + direction), image upload
- Small board handling (centering, pan locking)
- Minimum board size (50% viewport, grid-aligned)
- Pan reset on board resize

### ✅ Phase 1E - Persistence & Multi-Board
- Multi-board support (create, save, load, delete)
- Default unsaved board state (not in saved list)
- Auto-load last opened board on startup
- LoadSave button and dialog with visual grouping
- Board resize validation (prevents losing components)
- Database-ready localStorage structure
- Legacy format migration

---

## 5. Component Organization

**Strategy:** Hybrid feature + type structure

**Folders:**
- **`/board`** - Board infrastructure (Board, Viewport, BoardControls)
- **`/tiles`** - Component wrappers and menu system
  - **`/types`** - Component type implementations (TestComponent + config)
- **`/dialogs`** - All modal dialogs (4 dialogs: Configure, Remove, LoadSave, BoardSettings, ResizeWarning)
- **`/ui`** - UI buttons (AddComponent, LoadSave, BoardSettings)

**Documentation:** `/docs/COMPONENT_ORGANIZATION.md`

---

## 6. State Management (Zustand)

**Store:** `/src/stores/useBoardStore.js`

### Core State
```javascript
{
  board: {
    id: 'default-unsaved' | 'board-{timestamp}-{random}',
    name: string,
    width: number,      // Pixels, divisible by gridSize
    height: number,     // Pixels, divisible by gridSize
    gridSize: 30,       // Pixels per grid square
    showTestControls: boolean,
    showGrid: boolean,
    background: { type, solidColor, gradientColors, gradientDirection, imageUrl, imageName },
    overlapMode: 'no-overlap' | 'overlap' | 'bump'
  },
  viewport: {
    panX: number,
    panY: number,
    zoom: 1           // Scaffolding only
  },
  components: {
    [id]: {
      id: string,
      type: string,
      layout: { x, y, w, h },  // Grid coordinates
      style: { backgroundColor, opacity, color },
      content: { title }
    }
  },
  uploadedImages: {
    [filename]: dataUrl  // Base64 encoded
  }
}
```

### Key Methods
- `updateBoard(updates)` - Update board config
- `setViewportPan(x, y)` - Update pan position
- `addComponent(component)` - Add component
- `updateComponent(id, updates)` - Update component (deep merge style/content)
- `removeComponent(id)` - Delete component
- `updateAllLayouts(layouts)` - Batch layout updates from RGL
- `createNewBoard(name)` - Save current state as new board
- `saveCurrentBoard()` - Overwrite existing board
- `loadBoard(id)` - Load specific board
- `deleteBoard(id)` - Delete board, reset if active
- `getComponentsOutsideBounds(w, h)` - Validate resize
- `clearAllStorage()` - Reset to first-use (testing)

---

## 7. Component Registry

**File:** `/src/utils/componentRegistry.js`

Centralizes component type definitions:
```javascript
{
  test: {
    id: 'test',
    name: 'Test Component',
    defaultWidth: 4,    // Grid units
    defaultHeight: 4,
    minWidth: 2,
    minHeight: 2,
    component: TestComponent  // React component
  }
}
```

**Adding New Types:** Register in componentRegistry.js, create component + config in `/tiles/types/`

---

## 8. Key Features & Behaviors

### Board & Viewport
- **Board Size:** 2550×2040px default (85×68 grid squares)
- **Grid:** 30px squares, semi-transparent, togglable
- **Pan Boundaries:** Max 1 grid square (30px) overflow past edges
- **Small Boards:** Auto-center and lock panning if < viewport size
- **Background:** Solid/gradient/image support

### Components
- **Placement:** Click + icon → select type → click board to place
- **Shadow Preview:** White = valid, red = collision/boundary
- **Drag:** Click component body to move
- **Resize:** Click/drag lower-right handle
- **Configure:** Menu (⋮) → Configure → live preview
- **Remove:** Menu → Remove → confirmation required

### Overlap Modes
1. **No Overlap** - Components cannot overlap (collision detection)
2. **Overlap** - Components can freely overlap (stack)
3. **Push Down** - Components push others downward (RGL bump)

### Multi-Board System
- **Default State:** Unsaved board (`default-unsaved`), not in saved list
- **ADD:** Save current state with new name (creates duplicate)
- **SAVE:** Update existing board, or prompt name if default
- **LOAD:** Switch to selected board
- **DELETE:** Remove board, reset to default if deleting active
- **Auto-load:** Last opened board loads on app start

### Persistence (localStorage)
```javascript
'spatial-boards-meta': { lastOpenedBoardId, boards: [{id, name, lastModified}] }
'spatial-board-{id}': { board, viewport, components, uploadedImages, lastModified }
```

---

## 9. UI Layout

**Fixed Viewport Controls:**
- **Top-Left:** BoardControls (togglable) - info, Reset View, Clear Storage
- **Top-Right:** LoadSave button (💾), BoardSettings button (≡)
- **Bottom-Right:** AddComponent button (+)

**Board Surface:**
- Grid overlay (optional)
- Components with menu buttons (⋮)

---

## 10. Coding Practices for LLM Agents

### Core Principles (from architecture doc)
1. **Favor clarity over cleverness**
2. **Isolate board logic from component logic**
3. **Avoid deep nesting**
4. **Prefer pure functions**
5. **Keep files < 1500 lines** (separate if growing too large)

### Component Guidelines
- **Functional components only** (no class components)
- **Co-locate CSS** with component files
- **Event propagation:** Use `e.stopPropagation()` and `e.preventDefault()` in dialogs/menus
- **Portal dialogs:** Render to `document.body` for proper positioning
- **State updates:** Use Zustand actions, not local mutations
- **Deep merge:** Use spread for nested objects (style, content)

### File Organization
- **One component per file** (component + CSS)
- **Imports:** Relative paths, adjust `../` based on depth
- **Naming:** PascalCase for components, camelCase for utilities
- **Documentation:** Update `/docs/` when adding features

### RGL Integration
- **Grid alignment:** Board dimensions MUST be divisible by gridSize (30px)
- **data-grid props:** Include minW, minH for each component
- **Layout sync:** Use `onLayoutChange` to update store
- **Collision modes:** Configure via `allowOverlap`, `preventCollision`, `compactType`

### Event Handling
- **Dialogs/Menus:** Stop propagation to prevent RGL/panning conflicts
- **pointer-events: auto** on interactive elements inside transformed containers
- **onMouseDown:** Prevent component drag when dialogs open

### Persistence Design
- **localStorage structure mirrors database** for easy migration
- **Board IDs:** `board-{timestamp}-{random}` for uniqueness
- **Default board:** Special `default-unsaved` ID, never saved
- **Validation:** Check component bounds before resizing board

---

## 11. Common Patterns

### Adding a New Component Type
1. Create `/src/components/tiles/types/{Name}Component.jsx/css`
2. Create `/src/components/tiles/types/{Name}ComponentConfig.jsx/css`
3. Register in `/src/utils/componentRegistry.js`
4. Update `ComponentTile.jsx` to handle config rendering

### Creating a Dialog
1. Create in `/src/components/dialogs/{Name}.jsx/css`
2. Use `createPortal(content, document.body)`
3. Add event propagation isolation
4. Dark theme: `rgba(64, 64, 64, 0.95)`, `backdrop-filter: blur(12px)`

### Adding Board Settings
1. Add state to `/src/stores/useBoardStore.js` board config
2. Add UI controls in `BoardSettingsDialog.jsx`
3. Apply logic in `handleApply()`
4. Document in `/docs/`

---

## 12. Known Issues & Limitations

### By Design (Phase 1)
- Single user (localStorage, no authentication)
- "Push Down" only pushes vertically (RGL limitation)
- No undo/redo (beyond browser refresh or loading saved board)
- Images stored as base64 (memory overhead)
- No board templates or export/import yet

### Fixed Issues
- ✅ Grid alignment drift (board dimensions now exactly divisible)
- ✅ Event propagation (systematic isolation added)
- ✅ Dialog positioning (React Portals solve this)
- ✅ Bottom boundary enforcement (maxRows added)
- ✅ Minimum component size (data-grid minW/minH)

---

## 13. Testing & Debug Tools

### BoardControls (Upper-Left, Togglable)
- Shows current board name, size, pan position
- **Reset View:** Reset pan to (0,0)
- **Clear Storage:** Delete all saved boards, reset to first-use state

### Browser DevTools
- **localStorage:** Check `spatial-boards-meta` and `spatial-board-{id}` keys
- **Console:** Logs for migration, errors
- **React DevTools:** Inspect component state

---

## 14. Future Roadmap (Not Yet Implemented)

### Phase 2 - Advanced Features
- Additional component types (Note, Image, Chart)
- Board templates and presets
- Export/import (JSON)
- Keyboard shortcuts
- Board search/filter

### Phase 3 - Multi-User
- User authentication
- Database persistence (PostgreSQL)
- Real-time collaboration (WebSockets)
- Board sharing and permissions
- Conflict resolution

### Phase 4+ - Advanced
- Embedded drawing (Konva)
- API data widgets
- Real-time data components
- Rich text editor
- Version history

---

## 15. Key Implementation Details

### Pan Boundaries
```javascript
// Allow 1 grid square (30px) overflow
maxPanX = viewport.width - board.width + 30
maxPanY = viewport.height - board.height + 30
minPanX = -30
minPanY = -30
```

### Grid Alignment Critical
```javascript
// Board dimensions MUST be divisible by gridSize
board.width = cols * gridSize   // e.g., 85 * 30 = 2550
board.height = rows * gridSize  // e.g., 68 * 30 = 2040
```

### RGL Collision Modes
```javascript
'no-overlap': { allowOverlap: false, preventCollision: true, compactType: null }
'overlap':    { allowOverlap: true,  preventCollision: false, compactType: null }
'bump':       { allowOverlap: false, preventCollision: false, compactType: null }
```

### Component State Structure
```javascript
{
  id: 'comp-{timestamp}-{random}',
  type: 'test',
  layout: { x: 10, y: 5, w: 4, h: 4 },  // Grid units
  style: { backgroundColor: '#808080', opacity: 0.5, color: '#ffffff' },
  content: { title: 'Test Component' }
}
```

### Multi-Board Logic
- **Default board:** `id: 'default-unsaved'` - never saved, not in list
- **SAVE on default:** Prompts for name (same as ADD)
- **SAVE on named:** Overwrites silently
- **DELETE active board:** Resets to default-unsaved
- **Board selector:** Pre-selects current board if saved

### Resize Validation
```javascript
// Before applying resize, check:
componentsOutside = getComponentsOutsideBounds(newWidth, newHeight)
if (componentsOutside.length > 0) {
  // Show warning dialog, abort resize
}
```

---

## 16. Important Files Reference

### Core Components
- **App.jsx** - Root, manages dialogs and placement mode
- **Board.jsx** - Main canvas, RGL integration, panning, placement
- **ComponentTile.jsx** - Wrapper for board components, manages menus
- **TestComponent.jsx** - Basic component type (only type implemented)

### State & Logic
- **useBoardStore.js** - Complete state management, persistence methods
- **componentRegistry.js** - Component type definitions
- **backgroundUtils.js** - Background format migration utilities

### Key Dialogs
- **LoadSaveDialog.jsx** - Multi-board management (ADD, SAVE, LOAD, DELETE)
- **BoardSettingsDialog.jsx** - Board configuration panel
- **BoardResizeWarningDialog.jsx** - Warns when resize would lose components

---

## 17. CSS & Styling

### Color Scheme
- **Viewport:** `#2a2a2a` (very dark gray)
- **Board:** `#808080` default (configurable)
- **Grid:** `rgba(255, 255, 255, 0.1)` (10% white)
- **UI Buttons:** `rgba(64, 64, 64, 0.75)` + frosted glass
- **Dialogs:** `rgba(64, 64, 64, 0.95)` + backdrop blur

### Component Styling
- **Default:** Dark gray 50% opacity, white border, rounded corners
- **Configurable:** Background color, opacity, text color, title

### Button Styles
- **Upper-right buttons:** 50px circle, matching dark theme (LoadSave, BoardSettings)
- **Lower-right button:** Larger green circle (AddComponent)
- **Test controls:** White panel, green/red buttons

---

## 18. Development Guidelines for AI Assistants

### When Making Changes
1. **Read before editing** - Always read file first
2. **Update imports** - Check all import paths when moving files
3. **Run linter** - Check for errors after substantial edits
4. **Update docs** - Document significant changes in `/docs/`
5. **Test boundary cases** - Default board, empty components, edge positions

### Common Tasks

**Add New Component Type:**
1. Create `{Name}Component.jsx/css` in `/tiles/types/`
2. Create `{Name}ComponentConfig.jsx/css` in `/tiles/types/`
3. Register in `componentRegistry.js`
4. Update `ComponentTile.jsx` render logic

**Add New Dialog:**
1. Create in `/dialogs/` folder
2. Use React Portal: `createPortal(content, document.body)`
3. Add event propagation isolation
4. Match dark theme styling

**Add Board Setting:**
1. Add to `board` state in `useBoardStore.js`
2. Add UI control in `BoardSettingsDialog.jsx`
3. Apply in `handleApply()`

### Event Handling Pattern
```javascript
// Always include on interactive elements in dialogs/menus:
onClick={(e) => {
  e.stopPropagation();
  e.preventDefault();
  // ... your logic
}}
onMouseDown={(e) => e.stopPropagation()}
```

### Store Update Pattern
```javascript
// Deep merge for nested objects (style, content)
updateComponent: (id, updates) => set((state) => ({
  components: {
    ...state.components,
    [id]: {
      ...state.components[id],
      ...updates,
      style: updates.style ? { ...state.components[id].style, ...updates.style } : state.components[id].style
    }
  }
}))
```

---

## 19. Current Capabilities

### What Users Can Do Now
✅ Create pannable workspace with visual grid
✅ Place, drag, resize test components
✅ Configure component appearance (colors, opacity, text)
✅ Remove components with confirmation
✅ Adjust board size (with validation)
✅ Change board background (solid/gradient/image)
✅ Toggle grid and test controls visibility
✅ Select collision behavior (overlap modes)
✅ Create multiple boards with unique names
✅ Save, load, switch between boards
✅ Delete boards (with protection for active board)
✅ Auto-load last board on startup
✅ Upload and use custom background images

### What's Not Implemented Yet
❌ Additional component types (Note, Image, Chart, etc.)
❌ Zoom functionality (scaffolding exists)
❌ Keyboard shortcuts (except ESC for placement)
❌ Board templates or presets
❌ Export/import boards
❌ User authentication
❌ Database persistence
❌ Real-time collaboration
❌ Version history/undo

---

## 20. Quick Start for AI Assistants

### To Continue Development
1. **Read this document** for current state
2. **Check architecture doc** for design principles: `/docs/spatial_board_ui_phase_1_system_architecture_llm_build_guide.md`
3. **Review component organization:** `/docs/COMPONENT_ORGANIZATION.md`
4. **Check specific phase docs** in `/docs/PHASE_1*.md` for implementation details
5. **Start dev server:** User runs `npm run dev`
6. **Make changes** following guidelines above

### Common Next Steps
- Implement new component types (Note, Image, etc.)
- Add keyboard shortcuts
- Improve mobile responsiveness
- Add board templates
- Implement export/import

### If Something's Unclear
- Check `/docs/` for detailed documentation
- Review specific implementation files
- Ask user for clarification on design intent

---

## 21. File Counts & Stats

**Components:** 14 React components (28 files with CSS)
**Utilities:** 2 utility modules
**Stores:** 1 Zustand store (488 lines)
**Documentation:** 19+ markdown files
**Total Source:** ~4,000 lines (excluding docs)

---

## 22. Important Notes

### Grid Alignment
Board width/height MUST be exactly divisible by gridSize (30px). This prevents horizontal/vertical drift between visual grid and RGL's internal grid.

### Default Board State
- ID `default-unsaved` is special - never appears in saved boards list
- Clicking SAVE on default prompts for name
- Resetting or deleting all boards returns to default-unsaved

### Event Propagation
Critical for preventing conflicts between:
- Board panning (click-drag empty space)
- Component dragging (RGL)
- Component resizing (RGL)
- Dialog/menu interactions

Solution: Systematic `e.stopPropagation()` in all dialogs/menus

### React Portals
All dialogs render via Portal to `document.body` to avoid:
- Size constraints from parent components
- Positioning issues (components on edges)
- Transform inheritance from board

### Resize Validation
When user attempts to shrink board, system checks all components. If any would be outside new bounds, resize is blocked and warning dialog shows affected components.

---

## 23. localStorage Structure (Database-Ready)

Current localStorage design maps directly to future database tables:

**Future Migration:**
```sql
-- Metadata table (one per user in multi-user)
boards_meta: { user_id, last_opened_board_id }

-- Boards table
boards: { id, user_id, name, width, height, ..., last_modified }

-- Components table
components: { id, board_id, type, layout_x, layout_y, layout_w, layout_h, style, content }

-- Images table
uploaded_images: { id, board_id, name, data_url }
```

Changing from localStorage to database requires only updating method implementations in `useBoardStore.js`, not changing the API.

---

## 24. Testing & Verification

### Manual Testing Coverage
✅ Board panning and boundaries
✅ Component placement, drag, resize
✅ Component configuration (all inputs)
✅ Component removal
✅ Board settings (all options)
✅ Multi-board operations (add, save, load, delete)
✅ Auto-load on startup
✅ Board resize validation
✅ Collision modes
✅ Image upload
✅ Grid toggling

### To Verify Current Build
1. Start dev server: `npm run dev`
2. Test component placement and configuration
3. Test board settings (size, background, modes)
4. Test multi-board: ADD, SAVE, LOAD, DELETE
5. Refresh page - verify auto-load
6. Test resize validation (place components near edge, try to shrink board)

---

## 25. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-grid-layout": "^1.4.4",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.3"
  }
}
```

All are well-documented, well-supported, production-ready packages.

---

## 26. Git Status

- Repository initialized at `/home/mark/Code/visworkboard`
- .gitignore configured (node_modules, dist, .env, etc.)
- Ready for commits (no commits made yet in bootstrap session)

---

## 27. Next Steps (User Direction)

After Phase 1 completion, typical next developments:

### High Priority
- Additional component types (Note, Image, Text)
- Keyboard shortcuts (Ctrl+S save, Del to remove, etc.)
- Board templates/presets
- Export/import functionality

### Medium Priority
- Mobile/touch optimization
- Accessibility improvements (ARIA, keyboard nav)
- Performance optimization (many components)
- Component search/filter

### Future Phases
- Backend API development
- User authentication system
- Database migration (PostgreSQL)
- Real-time collaboration
- Advanced components (charts, drawing, embeds)

---

**Status:** Phase 1 Complete - Production Ready for Single-User Use  
**Architecture:** Clean, maintainable, documented, extensible  
**Ready For:** Phase 2 development or feature additions

---

# Quick Reference Checklist

Before starting work, verify:
- [ ] Read this bootstrap document
- [ ] Review architecture doc for design principles
- [ ] Check component organization doc
- [ ] Understand current phase implementation
- [ ] User has run `npm install` (if fresh clone)
- [ ] Dev server can start successfully

When implementing:
- [ ] Read files before editing
- [ ] Follow component organization structure
- [ ] Apply event propagation patterns
- [ ] Use deep merge for nested state
- [ ] Update imports when moving files
- [ ] Check linter after edits
- [ ] Update documentation
- [ ] Test in dev server

---

**This document provides everything needed to continue development from current state.**
