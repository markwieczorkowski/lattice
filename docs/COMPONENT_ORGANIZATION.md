# Component Organization Guide

## Overview

The `/src/components` folder follows a **hybrid feature + type structure** designed to balance logical grouping with component relationships. This organization supports maintainability and scalability as the project grows.

## Folder Structure

```
src/components/
├── board/           # Board workspace and viewport management
├── tiles/           # Component tiles and their type implementations
│   └── types/       # Specific component type implementations
├── dialogs/         # Reusable dialog components
├── settings/        # Board settings UI
└── ui/              # General-purpose UI elements
```

## Detailed Breakdown

### `/board` - Board Workspace Management
**Purpose:** Core board infrastructure and viewport management

**Files:**
- `Board.jsx/css` - Main board canvas with RGL integration, pan logic, placement mode
- `Viewport.jsx/css` - Fixed browser window viewport wrapper
- `BoardControls.jsx/css` - Developer/debug controls (position, size, reset)

**Responsibilities:**
- Board rendering and coordinate system
- Pan boundaries and transform calculations
- RGL (react-grid-layout) configuration and collision modes
- Placement mode and shadow preview
- Grid visualization
- Background rendering (solid, gradient, image)

### `/tiles` - Component Tiles
**Purpose:** Wrapper infrastructure for components placed on the board

**Files:**
- `ComponentTile.jsx/css` - Wrapper for all board components, manages menus and dialogs
- `ComponentMenu.jsx/css` - Three-line menu button and dropdown (Configure/Remove)

**Responsibilities:**
- Component rendering wrapper
- Menu state management
- Dialog state management (configure/remove)
- Event propagation control for RGL interaction
- Portal rendering for dialogs

#### `/tiles/types` - Component Type Implementations
**Purpose:** Specific component types that can be placed on the board

**Files:**
- `TestComponent.jsx/css` - Basic test component (4x4 default)
- `TestComponentConfig.jsx/css` - Configuration panel for TestComponent

**Naming Convention:**
- Component implementation: `{TypeName}Component.jsx/css`
- Component configuration: `{TypeName}ComponentConfig.jsx/css`

**Future Types:**
- `NoteComponent.jsx/css` - Sticky note component
- `NoteComponentConfig.jsx/css` - Note configuration panel
- `ImageComponent.jsx/css` - Image display component
- `ImageComponentConfig.jsx/css` - Image configuration panel
- ...etc

### `/dialogs` - Reusable Dialog Components
**Purpose:** Generic, reusable dialog and modal components

**Files:**
- `ConfigureDialog.jsx/css` - Base configuration dialog wrapper
- `RemoveConfirmDialog.jsx/css` - Confirmation dialog for removal actions

**Characteristics:**
- Rendered via React Portal to `document.body`
- Viewport-centered positioning
- Event propagation isolation
- Dark theme with 75% opacity and backdrop blur
- Reusable across different features

### `/settings` - Board Settings UI
**Purpose:** Board-level configuration interface

**Files:**
- `BoardSettingsButton.jsx/css` - Upper-right menu button to open settings
- `BoardSettingsDialog.jsx/css` - Comprehensive board settings dialog

**Settings Managed:**
- Current board selection (placeholder for multi-board feature)
- Test controls visibility
- Grid visibility
- Overlap mode (no-overlap, overlap, push-down)
- Board dimensions (width x height)
- Board background (solid, gradient, image)
- Image upload and management

### `/ui` - General-Purpose UI Elements
**Purpose:** Standalone UI components not tied to specific features

**Files:**
- `AddComponentButton.jsx/css` - Lower-right "+" button to add components

**Future Additions:**
- Navigation elements
- Toolbar components
- Status indicators
- General-purpose buttons/controls

## Organization Principles

### 1. Feature-Based Grouping
Components that work together toward a common purpose are grouped together:
- Board infrastructure in `/board`
- Component tile system in `/tiles`
- Settings interface in `/settings`

### 2. Type-Based Nesting
Within feature groups, components are further organized by type:
- Specific component implementations in `/tiles/types`
- Each component type has its implementation and config co-located

### 3. Reusability Separation
Reusable, generic components are separated into dedicated folders:
- `/dialogs` - Modal dialogs used across features
- `/ui` - General-purpose UI elements

### 4. Scalability Considerations
The structure supports growth:
- New component types added to `/tiles/types`
- New dialog types added to `/dialogs`
- New board features added to `/board`
- New UI elements added to `/ui`

### 5. Import Path Clarity
Import paths reflect logical relationships:
```javascript
// Root components import from feature folders
import Board from './components/board/Board';
import AddComponentButton from './components/ui/AddComponentButton';

// Feature components import from siblings or common folders
import ComponentTile from '../tiles/ComponentTile';
import RemoveConfirmDialog from '../dialogs/RemoveConfirmDialog';

// Type implementations import from deep paths
import useBoardStore from '../../../stores/useBoardStore';
```

## File Naming Conventions

### Component Files
- **PascalCase:** `ComponentName.jsx`
- **CSS Module:** `ComponentName.css` (same name as component)
- **Configuration:** `{TypeName}ComponentConfig.jsx/css`

### File Collocation
Each component's `.jsx` and `.css` files are co-located in the same folder for easy maintenance.

## Import Guidelines

### Relative Imports
- Prefer relative imports within the `src/` directory
- Use `../` to navigate up the folder hierarchy
- CSS imports are always relative: `import './ComponentName.css'`

### Store Imports
- Always import from the full path: `import useBoardStore from '../../stores/useBoardStore'`
- Adjust `../` depth based on current file location

### Utility Imports
- Always import from the full path: `import { utility } from '../../utils/utilityName'`
- Adjust `../` depth based on current file location

## Adding New Components

### Adding a New Board Component Type
1. Create implementation: `/src/components/tiles/types/{TypeName}Component.jsx/css`
2. Create configuration: `/src/components/tiles/types/{TypeName}ComponentConfig.jsx/css`
3. Register in `/src/utils/componentRegistry.js`
4. Update `ComponentTile.jsx` to handle the new type

### Adding a New Dialog
1. Create dialog: `/src/components/dialogs/{DialogName}.jsx/css`
2. Ensure it uses React Portal for rendering
3. Follow dark theme styling (75% opacity, backdrop blur)
4. Implement event propagation isolation

### Adding a New UI Element
1. Create component: `/src/components/ui/{ComponentName}.jsx/css`
2. Import and use in `App.jsx` or other relevant parent

## Refactoring Guidelines

### When to Split a File
Split when a file exceeds ~1500 lines or has multiple distinct responsibilities:
- Extract complex logic into utility functions (`/src/utils`)
- Split large components into smaller sub-components
- Move reusable pieces to appropriate folders (`/dialogs`, `/ui`)

### When to Create a New Folder
Create a new folder when:
- You have 3+ closely related components
- A new major feature is introduced
- Components share a common purpose but differ from existing folders

## Maintenance Notes

### Co-location Benefits
- Component and styles together make updates easier
- Type implementations grouped with their configs
- Feature folders encapsulate related functionality

### Import Path Updates
When moving files:
1. Update all imports in the moved file (adjust `../` depth)
2. Update all imports in files that import the moved file
3. Test thoroughly to ensure no broken imports

### Avoiding Circular Dependencies
- Keep data flow unidirectional (top-down)
- Shared state in Zustand stores, not component props
- Utility functions in `/utils`, not in components

## Current File Count by Folder

- `/board` - 6 files (3 components)
- `/tiles` - 4 files (2 components)
- `/tiles/types` - 4 files (2 component types)
- `/dialogs` - 4 files (2 dialogs)
- `/settings` - 4 files (2 components)
- `/ui` - 2 files (1 component)

**Total:** 24 files (12 components)

## Future Considerations

### Multi-Board Support (Phase 2+)
When implementing multiple boards:
- Board selector logic may move to `/settings` or a new `/boards` folder
- Board configurations stored in Zustand
- Each board instance manages its own components

### Additional Component Types (Phase 2+)
Anticipated types to be added to `/tiles/types`:
- `NoteComponent` - Sticky notes
- `ImageComponent` - Image display
- `TextComponent` - Rich text blocks
- `ChartComponent` - Data visualization
- `LinkComponent` - Hyperlink cards

### Advanced Features (Phase 3+)
May require new folders:
- `/layers` - Layer management UI
- `/toolbar` - Main application toolbar
- `/inspector` - Component inspector panel
- `/shortcuts` - Keyboard shortcut system

---

**Last Updated:** February 21, 2026  
**Phase:** 1D Complete  
**Next Phase:** 1E (Persistence)
