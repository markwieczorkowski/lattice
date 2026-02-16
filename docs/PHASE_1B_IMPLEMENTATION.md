# Phase 1B Implementation - react-grid-layout Integration

## ✅ Completed Features

### 1. Component Type Registry (`src/utils/componentRegistry.js`)

**Purpose:** Central registry for all component types with default configurations

**Implemented:**
- Component type definitions with default dimensions
- Test component: 4×4 grid squares (120×120px)
- Minimum size constraints (2×2)
- Component ID generation utility
- Extensible for future component types

### 2. Test Component (`src/components/TestComponent.jsx`)

**Styling:**
- Dark gray background with 50% opacity (rgba(64, 64, 64, 0.5))
- Thin white border (2px solid)
- Rounded corners (8px border-radius)
- Displays "Test Component" title (h2, white)
- Shows component ID in monospace font

**Features:**
- Grid/board visible through semi-transparent background
- Clean, minimal design
- User-select disabled for text

### 3. Component Tile Wrapper (`src/components/ComponentTile.jsx`)

**Purpose:** Wrapper for components managed by react-grid-layout

**Features:**
- Routes component rendering based on type
- Contains RGL-managed wrapper styles
- Handles resize handle styling
- Extensible for future component types

### 4. Add Component Button (`src/components/AddComponentButton.jsx`)

**Location:** Lower-right corner of viewport (floating action button)

**Features:**
- Green circular "+" button
- Opens component type selection menu on click
- Menu animates up from button
- Shows component name and default size
- Rotates 45° when menu is open
- Currently shows only "Test Component" option

**Interaction:**
1. Click "+" button → menu opens
2. Select "Test Component" → enters placement mode
3. Menu closes automatically

### 5. Component Placement System

**Placement Mode Flow:**
1. User clicks AddComponentButton
2. User selects component type from menu
3. Cursor changes to crosshair
4. Shadow outline follows mouse cursor
5. Shadow shows green if placement is valid, red if collision detected
6. Click to place component
7. ESC key to cancel placement mode

**Shadow Preview:**
- Green: Valid placement location (no collision)
- Red: Invalid placement (would overlap existing component)
- Follows mouse at grid-snapped positions
- Shows exact size of component to be placed

### 6. React Grid Layout Integration

**Configuration:**
- Grid columns: Calculated from board width / grid size (~85 columns)
- Row height: 30px (matches board grid)
- Collision prevention: Enabled (no overlap allowed)
- Compaction: Disabled (null)
- Margins: [0, 0]
- Container padding: [0, 0]

**Features:**
- Components snap to 30px grid
- Drag to move components
- Resize handle in lower-right corner
- Visual placeholder during drag
- Smooth transitions
- Components stay within board bounds

### 7. Interaction Model

**Click Behaviors:**

| Target | In Placement Mode | Normal Mode |
|--------|-------------------|-------------|
| Empty board space | Place component | Pan board |
| Component body | - | Drag component |
| Component resize handle | - | Resize component |
| Add button | Opens menu | Opens menu |

**Drag Behaviors:**
- **Component body:** Move component (RGL managed)
- **Resize handle:** Resize component (RGL managed)
- **Empty space (normal mode):** Pan board

### 8. Collision Detection

**Current Mode:** No Overlap (preventCollision: true)

**Implementation:**
- Manual collision checking during placement preview
- RGL handles collision during drag/resize
- Cannot place component where it would overlap
- Cannot drag/resize into occupied space

**Future Modes (Phase 1D):**
- Allow overlap
- Bump/displace mode

### 9. State Management Updates

**New Store Actions:**
- `addComponent()` - Add new component to store
- `updateComponentLayout()` - Update single component layout
- `updateAllLayouts()` - Batch update from RGL onLayoutChange

**Component Data Structure:**
```javascript
{
  id: string,
  type: string,
  layout: {
    x: number,  // grid column
    y: number,  // grid row
    w: number,  // width in grid units
    h: number   // height in grid units
  },
  style: {},    // Future: custom styles
  content: {}   // Future: component-specific data
}
```

## File Structure

```
src/
├── components/
│   ├── AddComponentButton.jsx       # FAB with component menu
│   ├── AddComponentButton.css
│   ├── TestComponent.jsx            # Test component implementation
│   ├── TestComponent.css
│   ├── ComponentTile.jsx            # RGL wrapper component
│   ├── ComponentTile.css
│   ├── Board.jsx                    # Updated with RGL integration
│   └── Board.css                    # Shadow preview styles
├── utils/
│   └── componentRegistry.js         # Component type definitions
├── stores/
│   └── useBoardStore.js             # Updated with layout actions
└── App.jsx                          # Placement mode orchestration
```

## Testing Instructions

### 1. Add Test Component

1. Click the green "+" button in lower-right
2. Menu appears with "Test Component 4×4" option
3. Click "Test Component"
4. Menu closes, cursor changes to crosshair
5. Shadow outline follows mouse (green)
6. Click on board to place component

**Expected:**
- Component appears at clicked location
- Component snaps to 30px grid
- Placement mode exits automatically
- Can add multiple components

### 2. Test Collision Detection

1. Place a test component
2. Click "+" and select "Test Component" again
3. Move shadow over existing component
4. Shadow turns red
5. Clicking does not place component

**Expected:**
- Cannot place on top of existing components
- Shadow clearly indicates invalid placement
- Click in red zone has no effect

### 3. Drag Component

1. Click and hold on component body (not corner)
2. Drag to new location
3. Blue placeholder shows destination
4. Release to drop

**Expected:**
- Component moves smoothly
- Snaps to grid
- Cannot drag into other components
- Cannot drag outside board bounds

### 4. Resize Component

1. Hover over lower-right corner of component
2. Cursor changes to SE resize cursor
3. Click and drag to resize
4. Release to apply

**Expected:**
- Component resizes in grid increments
- Minimum size: 2×2 grid squares
- Cannot resize into other components
- Resize handle visible with white indicator

### 5. Pan Board with Components

1. Click and drag on empty gray board area (not components)
2. Board and all components move together

**Expected:**
- Components move with board during pan
- Pan still respects boundary constraints
- Components maintain grid positions relative to board

### 6. Cancel Placement

1. Click "+" and select component type
2. Press ESC key

**Expected:**
- Placement mode exits
- Shadow disappears
- Cursor returns to normal
- Indicator message disappears

## Visual Design

### Color Scheme
- **Add button:** Green (#4CAF50)
- **Valid placement shadow:** Green with glow (rgba(76, 175, 80, 0.3))
- **Invalid placement shadow:** Red with glow (rgba(244, 67, 54, 0.3))
- **Component background:** Dark gray 50% opacity (rgba(64, 64, 64, 0.5))
- **Component border:** White 2px
- **Drag placeholder:** Blue semi-transparent (rgba(100, 149, 237, 0.3))

### Animations
- Menu slide-up: 0.2s ease
- Button hover scale: 1.05
- Button rotation (menu open): 45°
- Component drag/resize: 200ms ease
- Placement indicator fade-in: 0.3s

## Configuration

### Change Grid Size
Edit `useBoardStore.js`:
```javascript
board: {
  gridSize: 30  // Change to desired size (e.g., 40, 50)
}
```

### Add New Component Type
Edit `componentRegistry.js`:
```javascript
export const COMPONENT_TYPES = {
  test: { /* existing */ },
  newType: {
    id: 'newType',
    name: 'New Component',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 2,
    minHeight: 2,
  }
};
```

Then create corresponding component in `src/components/` and add case in `ComponentTile.jsx`.

## Performance Notes

- RGL uses CSS transforms for positioning (GPU accelerated)
- WidthProvider ensures responsive behavior
- Components memoized to prevent unnecessary re-renders
- Layout calculations only on drag/resize end events
- Shadow preview updates throttled by React rendering

## Known Behaviors

- Components always snap to grid
- Placement mode disables board panning
- Placement mode disables component drag/resize
- ESC key exits placement mode
- Components cannot be placed outside board
- Resize handle always in lower-right corner (RGL default)

## Next Phase: 1C

Phase 1C will add:
- Component menu (top-right corner of each component)
- Delete component functionality
- Style controls (background color, opacity, text color)
- Component-specific settings

---

**Phase 1B Status:** ✅ **COMPLETE**
