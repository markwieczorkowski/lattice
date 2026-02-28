# UI Reference Guide

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ VIEWPORT (Fixed Browser Window)                                 │
│                                                                   │
│  ┌──────────────────┐                    ┌───┐ ┌───┐ ┌───┐     │
│  │ BoardControls    │                    │💾 │ │⚙️ │ │   │     │
│  │ (if enabled)     │                    │   │ │   │ │   │     │
│  │ - Pan: 0, 0      │                    └───┘ └───┘ └───┘     │
│  │ - Size: 2550x204 │                     Load  Board           │
│  │ [Reset Pan]      │                     Save  Settings        │
│  └──────────────────┘                                           │
│                                                                   │
│  ╔═════════════════════════════════════════════════════╗        │
│  ║ BOARD (Pannable 2D Canvas)                          ║        │
│  ║                                                      ║        │
│  ║  ┌─────────┐  ┌─────────┐                          ║        │
│  ║  │   [⋮]   │  │   [⋮]   │  ← Component Menu        ║        │
│  ║  │  Test   │  │  Test   │                           ║        │
│  ║  │Component│  │Component│                           ║        │
│  ║  │         │  │         │                           ║        │
│  ║  │  ID: 1  │  │  ID: 2  │                           ║        │
│  ║  └─────────┘  └─────────┘                           ║        │
│  ║                                                      ║        │
│  ║  [Grid lines visible if enabled]                    ║        │
│  ║                                                      ║        │
│  ║                                          ┌─────────┐ ║        │
│  ║                                          │  [⋮]    │ ║        │
│  ║                                          │  Test   │ ║        │
│  ║                                          │Component│ ║        │
│  ║                                          └─────────┘ ║        │
│  ╚═════════════════════════════════════════════════════╝        │
│                                                                   │
│                                             ┌───┐                │
│                                             │ + │ ← Add Component│
│                                             └───┘                │
└─────────────────────────────────────────────────────────────────┘
```

## UI Elements Breakdown

### Fixed Viewport Controls

#### Top-Left Corner
**BoardControls** (Togglable via Board Settings)
- Shows current pan position
- Shows board dimensions
- "Reset Pan" button

#### Top-Right Corner (Right to Left)
1. **Board Settings Button** (⚙️)
   - Three horizontal lines icon
   - Opens board settings dialog
   
2. **Load/Save Button** (💾)
   - Floppy disk icon
   - Opens load/save dialog

#### Bottom-Right Corner
**Add Component Button** (+)
- Plus icon
- Opens component type menu
- Click to select type, then click board to place

### Board Surface

**Grid Overlay** (Optional)
- 30px squares
- Semi-transparent lines
- Togglable in Board Settings

**Components** (Placed on board)
- Each has menu button (⋮) in upper-right
- Draggable by clicking/dragging
- Resizable via lower-right handle
- Configurable via menu → Configure
- Removable via menu → Remove

## Dialog Reference

### 1. Add Component Menu
**Trigger:** Click Add Component button (+)

```
┌──────────────────────┐
│ Select Component     │
├──────────────────────┤
│ → Test Component     │
└──────────────────────┘
```

**Behavior:**
- Hover highlights option
- Click selects type
- Enters placement mode
- ESC cancels

### 2. Component Menu Dropdown
**Trigger:** Click component menu button (⋮)

```
┌──────────────┐
│ Configure    │
│ Remove       │
└──────────────┘
```

**Options:**
- **Configure:** Opens component config dialog
- **Remove:** Opens removal confirmation

### 3. Remove Confirmation Dialog
**Trigger:** Click "Remove" in component menu

```
┌─────────────────────────────────────┐
│  Remove?                         [×]│
├─────────────────────────────────────┤
│                                     │
│       [  OK  ]    [ Cancel ]        │
│                                     │
└─────────────────────────────────────┘
```

**Actions:**
- **OK:** Deletes component permanently
- **Cancel:** Closes dialog, keeps component

### 4. Configure Dialog (TestComponent)
**Trigger:** Click "Configure" in component menu

```
┌─────────────────────────────────────┐
│  Configure Component             [×]│
├─────────────────────────────────────┤
│                                     │
│  Background Color:  [████] #808080  │
│                                     │
│  Background Opacity: ▬▬▬●▬▬▬ 50%   │
│                                     │
│  Title Text:  [Test Component    ]  │
│                                     │
│  Text Color:        [████] #ffffff  │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- **Live preview:** Changes apply immediately to component
- **Color pickers:** Click to select colors
- **Opacity slider:** Drag to adjust transparency
- **Text input:** Type to change title
- **Click outside:** Closes dialog and saves

### 5. Board Settings Dialog
**Trigger:** Click Board Settings button (⚙️)

```
┌─────────────────────────────────────────────────┐
│  Board Settings                              [×]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Current Board:  [Default ▼]                    │
│                                                 │
│  ☑ Show Test Controls                          │
│  ☑ Show Grid                                    │
│                                                 │
│  Overlap Mode:   [No Overlap ▼]                │
│    • No Overlap - Components cannot overlap    │
│                                                 │
│  Board Size:     [2550] × [2040]               │
│                                                 │
│  Board Background:  [Solid Color ▼]            │
│                                                 │
│    Background Color: [████] #808080             │
│                                                 │
│  Board Images:                                  │
│    [No images    ▼]  [Upload Image]            │
│                                                 │
│           [  Apply  ]    [ Cancel ]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Settings:**
- **Current Board:** Select board (placeholder)
- **Show Test Controls:** Toggle debug panel
- **Show Grid:** Toggle grid visibility
- **Overlap Mode:** No Overlap / Overlap / Push Down
- **Board Size:** Width × Height (must be ≥50% viewport)
- **Board Background:** 
  - Solid Color: Single color picker
  - Gradient: Two colors + direction
  - Image: Selector + upload button

**Actions:**
- **Apply:** Saves settings and closes
- **Cancel:** Discards changes and closes

### 6. Load/Save Dialog
**Trigger:** Click Load/Save button (💾)

```
┌─────────────────────────────────────────────────┐
│  Load / Save Board                           [×]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Current Board:                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Default                                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Select Board:                                  │
│  [Default - Feb 21, 2026 8:30 PM ▼]           │
│                                                 │
│  Board Name:                                    │
│  [Default                             ]         │
│  Save will update the current board with this   │
│  name                                           │
│                                                 │
│           [  Load  ]    [  Save  ]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Current Board:** Shows active board name
- **Select Board:** Dropdown of all saved boards
- **Board Name:** Text input for save operation
- **Load:** Loads selected board
- **Save:** Saves current board with entered name

**Workflow:**
- **To Load:** Select board from dropdown → Click Load
- **To Save:** Enter/edit name → Click Save

## Interaction Patterns

### Component Placement
1. Click **Add Component button** (+)
2. Select component type from menu
3. **Shadow preview** follows mouse
4. Click board to place component
   - Red shadow = Invalid position (collision/boundary)
   - White shadow = Valid position
5. Component appears at clicked location

### Component Interaction
**Normal Mode (No Dialogs Open):**
- **Click + Drag body:** Move component
- **Click + Drag lower-right:** Resize component
- **Click menu (⋮):** Open component menu

**With Menu/Dialog Open:**
- **Click menu item:** Execute action
- **Click outside:** Close menu/dialog
- **Board/component:** No interaction (event isolation)

### Board Panning
**Mouse Drag (Empty Board Space):**
- Click and drag on board (not component)
- Board moves with cursor
- Limited to 1 grid square (30px) past edges

**Pan Boundaries:**
- Top: Can pan up to -30px
- Left: Can pan up to -30px
- Right: Can pan up to (viewport_width - board_width + 30px)
- Bottom: Can pan up to (viewport_height - board_height + 30px)

**Small Boards:**
- If board < viewport in dimension, board is centered
- Panning disabled in that dimension

### Keyboard Shortcuts
- **ESC:** Cancel component placement mode
- (More shortcuts planned for Phase 2+)

## Color Scheme

### Primary Colors
- **Viewport Background:** `#2a2a2a` (very dark gray)
- **Board Default Background:** `#808080` (medium gray)
- **Grid Lines:** `rgba(255, 255, 255, 0.1)` (10% white)

### UI Elements
- **Buttons:** `rgba(64, 64, 64, 0.75)` (dark gray, 75% opacity)
- **Dialogs:** `rgba(64, 64, 64, 0.95)` (dark gray, 95% opacity)
- **Dialog Backdrop:** `rgba(0, 0, 0, 0.5)` (50% black) + blur
- **Borders:** `rgba(255, 255, 255, 0.2)` (20% white)
- **Text:** `#ffffff` (white)

### Component Colors (Default)
- **Background:** `#808080` at 50% opacity (configurable)
- **Border:** `#ffffff` thin (1px)
- **Text:** `#ffffff` (configurable)

### Accent Colors
- **Load Button:** `rgba(100, 150, 255, 0.8)` (blue)
- **Save Button:** `rgba(76, 175, 80, 0.8)` (green)
- **Apply Button:** `rgba(76, 175, 80, 0.8)` (green)
- **Cancel Button:** `rgba(200, 200, 200, 0.8)` (gray)

## Responsive Behavior

### Viewport Resize
- Board pan adjusts to maintain valid boundaries
- Small boards re-center automatically
- Components maintain absolute positions on board

### Component Resize
- Minimum size: 2×2 grid squares (60×60 px)
- Snap to grid (30px increments)
- Cannot resize past board boundaries
- Collision detection (if enabled)

### Dialog Positioning
- All dialogs rendered via React Portal
- Centered in viewport (not board)
- Fixed positioning (not affected by panning)
- Click outside to close

## Accessibility Notes

### Current Implementation (Phase 1)
- ⚠️ **Limited keyboard navigation** (ESC only)
- ⚠️ **No ARIA labels** on interactive elements
- ⚠️ **No focus indicators** on components
- ⚠️ **Color contrast** meets WCAG AA for text
- ⚠️ **No screen reader support** yet

### Planned (Phase 2+)
- Full keyboard navigation (Tab, Arrow keys)
- ARIA labels and roles
- Focus management and indicators
- Screen reader announcements
- High contrast mode option
- Zoom/scale accessibility

## Performance Notes

### Optimization Strategies
- **Transform-based panning:** Uses GPU acceleration
- **CSS Grid for visual grid:** No canvas overhead
- **Zustand state management:** Minimal re-renders
- **React.memo on components:** Prevent unnecessary updates
- **Portal-based dialogs:** Isolated from board render tree

### Known Performance Considerations
- **Large boards (>5000×5000):** May cause pan lag on weak devices
- **Many components (>100):** RGL drag/resize may slow
- **Uploaded images:** Base64 storage increases memory usage
- **Complex gradients:** Some browsers render slowly

### Recommended Limits (Phase 1)
- **Board size:** ≤ 5000×5000 px
- **Components:** ≤ 50 per board
- **Uploaded images:** ≤ 5 MB total per board

## Browser Compatibility

### Fully Supported
- ✅ Chrome/Edge 90+ (Chromium-based)
- ✅ Firefox 88+
- ✅ Safari 14+

### Partially Supported
- ⚠️ Mobile Safari (functional, touch UX not optimized)
- ⚠️ Mobile Chrome/Firefox (functional, small screen issues)

### Not Supported
- ❌ Internet Explorer (any version)
- ❌ Opera Mini
- ❌ UC Browser

### Required Features
- CSS Grid
- CSS Transforms
- CSS backdrop-filter (frosted glass effect)
- localStorage API
- ES6+ JavaScript (arrow functions, destructuring, etc.)

---

**Last Updated:** February 21, 2026  
**Phase:** 1E Complete  
**UI Version:** 1.0
