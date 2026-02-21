# Overlap Mode Feature

## Overview

Overlap Mode controls how components interact when being moved or resized. Three distinct behaviors are supported, all leveraging react-grid-layout's collision system.

## Three Overlap Modes

### 1. No Overlap (Default)

**Behavior:**
- Components cannot overlap each other
- Drag/resize blocked if it would cause overlap
- Components maintain distinct spaces
- Clean, organized layout

**RGL Configuration:**
```javascript
{
  allowOverlap: false,
  preventCollision: true,
  compactType: null
}
```

**Use Cases:**
- Organized workspaces
- Clear visual separation
- Dashboard-style layouts
- Preventing accidental overlaps

**Interaction:**
- Drag component toward another → stops at edge
- Resize toward another → stops at edge
- Placeholder shows red if placement would overlap

---

### 2. Overlap

**Behavior:**
- Components can freely overlap
- No collision detection
- Components can be stacked
- Z-index determines visual layering

**RGL Configuration:**
```javascript
{
  allowOverlap: true,
  preventCollision: false,
  compactType: null
}
```

**Use Cases:**
- Layered designs
- Overlapping cards
- Collage-style layouts
- Floating elements

**Interaction:**
- Drag component anywhere
- Resize without restrictions (within board bounds)
- Components can occupy same grid cells
- Most recently moved component on top

**Visual Layering:**
- Dragging component: z-index: 100
- Resizing component: z-index: 100
- Static components: z-index: 1

---

### 3. Bump

**Behavior:**
- Components push each other out of the way
- Automatic repositioning of other components
- Vertical compaction (components pushed down)
- Dynamic layout adjustment

**RGL Configuration:**
```javascript
{
  allowOverlap: false,
  preventCollision: false,
  compactType: 'vertical'
}
```

**Use Cases:**
- Fluid layouts
- Automatic organization
- Space-efficient arrangements
- Dynamic workspaces

**Interaction:**
- Drag component into occupied space → other components move down
- Resize into occupied space → other components pushed away
- Automatic gap filling
- Vertical flow maintained

**Compaction:**
- Components arrange vertically
- Gaps automatically filled
- Top components stay near top
- Bottom components pushed down as needed

---

## Configuration

### Changing Overlap Mode

1. Open **Board Settings** (upper-right button)
2. Find **Overlap Mode** selector
3. Choose mode:
   - No Overlap
   - Overlap
   - Bump
4. Click **Apply**

### Mode Descriptions (In UI)

**No Overlap:**
"Components cannot overlap each other"

**Overlap:**
"Components can freely overlap"

**Bump:**
"Components push each other when moved"

---

## Technical Implementation

### Store Configuration

```javascript
board: {
  overlapMode: 'no-overlap' | 'overlap' | 'bump'
}
```

Default: `'no-overlap'`

### RGL Props Mapping

| Mode | allowOverlap | preventCollision | compactType |
|------|--------------|------------------|-------------|
| no-overlap | false | true | null |
| overlap | true | false | null |
| bump | false | false | 'vertical' |

### Dynamic Configuration

`getRGLConfig()` function in Board.jsx:
- Reads `board.overlapMode`
- Returns appropriate RGL props
- Applied to ResponsiveGridLayout component

### Placement Preview

Shadow preview respects overlap mode:
- **No Overlap / Bump:** Red if collision, green if clear
- **Overlap:** Always green (can place anywhere)

**Implementation:**
```javascript
const wouldCollide = (x, y, w, h) => {
  // Always check board boundaries
  if (outOfBounds) return true;
  
  // In overlap mode, allow placement anywhere
  if (board.overlapMode === 'overlap') return false;
  
  // Check component collision for other modes
  return hasCollision;
};
```

---

## Behavior Details

### No Overlap Mode

**Component Drag:**
- Cannot drag into occupied space
- Stops at collision boundary
- Placeholder shows valid position

**Component Resize:**
- Cannot resize into occupied space
- Handle stops at collision boundary
- Maintains component separation

**Component Placement:**
- Red shadow if would collide
- Cannot place in occupied cells
- Must find empty space

---

### Overlap Mode

**Component Drag:**
- Can drag anywhere on board
- No collision detection
- Can stack components

**Component Resize:**
- Can resize without restrictions
- Can expand over other components
- No boundary except board edges

**Component Placement:**
- Always green shadow (within bounds)
- Can place on top of existing components
- Components layer based on z-index

**Z-Index Management:**
- Static: 1
- Dragging: 100
- Resizing: 100

**Result:** Last interacted component appears on top

---

### Bump Mode

**Component Drag:**
- Dragging into occupied space pushes other components
- Other components move down to make room
- Automatic layout adjustment

**Component Resize:**
- Resizing into occupied space pushes others
- Layout reflows vertically
- Components maintain relative positions

**Component Placement:**
- Can place in occupied space
- Existing components pushed down
- Layout automatically compacts

**Compaction Behavior:**
- Vertical compaction (top-to-bottom)
- Gaps filled automatically
- Items pack tightly
- Empty space minimized

**Example:**
```
Before:
[A] [B]
    [C]

Drag A onto B's space:

After:
[A]
[B] (pushed down)
[C] (pushed further down)
```

---

## Use Case Scenarios

### Dashboard Layout (No Overlap)
- Widgets stay separated
- Clean grid arrangement
- Easy to scan visually
- Professional appearance

### Creative Canvas (Overlap)
- Layer elements freely
- Create depth
- Collage-style designs
- Artistic freedom

### Dynamic Lists (Bump)
- Automatic organization
- Insert items easily
- No manual gap management
- Fluid rearrangement

---

## Testing Instructions

### Test No Overlap

1. Set mode to "No Overlap"
2. Place two components
3. Try to drag one onto the other
4. Should stop at edge (cannot overlap)

### Test Overlap

1. Set mode to "Overlap"
2. Place two components
3. Drag one onto the other
4. Should overlap freely
5. Last dragged appears on top

### Test Bump

1. Set mode to "Bump"
2. Place three components in vertical column:
   - A at top
   - B in middle
   - C at bottom
3. Drag B upward into A's space
4. A should push down
5. C should also move down
6. Vertical flow maintained

### Test Mode Switching

1. Place components in "No Overlap" mode
2. Switch to "Overlap" mode
3. Components stay in place
4. Now can drag over each other
5. Switch to "Bump" mode
6. Components may reflow (compaction)
7. Switch back to "No Overlap"
8. Layout preserved

---

## Performance Considerations

### Mode Switching

Switching modes does not re-mount components:
- Layout recalculated
- RGL props updated
- Components re-rendered in place
- Smooth transition

### Bump Mode Performance

Compaction happens on:
- Drag end
- Resize end
- Layout change

**Not on:** Every mouse move

**Result:** Smooth performance even with many components

---

## Visual Indicators

### Drag Placeholder

**All modes:**
- Blue semi-transparent placeholder
- Shows destination position
- Smooth animation

**Bump mode specific:**
- Other components move in real-time during drag
- Shows final layout as you drag

### Shadow Preview (Placement)

**No Overlap / Bump:**
- Green: Valid (no collision)
- Red: Invalid (collision)

**Overlap:**
- Always green (can place anywhere within bounds)

---

## Future Enhancements

Potential additions:
1. **Horizontal compaction** - Option for left-to-right bump
2. **Free compaction** - Both directions
3. **Z-index controls** - Manual layer ordering in overlap mode
4. **Snap zones** - Magnetic snap points
5. **Alignment guides** - Visual alignment helpers

---

## Architecture Notes

### Mode Persistence

Overlap mode is:
- ✅ Stored in board configuration
- ✅ Persisted to localStorage
- ✅ Restored on app load
- ✅ Included in board export

### Component Compatibility

All component types work with all modes:
- TestComponent ✅
- Future components ✅

No component-specific code required.

### RGL Integration

Direct mapping to RGL props:
- Clean configuration
- No custom collision code
- Leverages RGL's robust collision system
- Standard react-grid-layout behavior

---

## Files Modified

1. **useBoardStore.js**
   - Changed default overlapMode to 'no-overlap'
   - Already had overlapMode in config

2. **BoardSettingsDialog.jsx**
   - Added Overlap Mode selector
   - Added descriptive hints for each mode
   - Included in Apply workflow

3. **Board.jsx**
   - Added `getRGLConfig()` function
   - Applied dynamic RGL configuration
   - Updated placement collision detection

**Lines Added:** ~60

---

## Summary

**Three Modes:**
1. ✅ No Overlap - Organized, separated layout
2. ✅ Overlap - Free layering and stacking
3. ✅ Bump - Automatic space management

**Implementation:**
- Selector in Board Settings
- Dynamic RGL configuration
- Mode-aware placement preview
- Smooth transitions

**Result:** Users can choose layout behavior based on their workflow needs.

---

**Status:** ✅ Complete

Overlap mode fully functional with all three behaviors working correctly!
