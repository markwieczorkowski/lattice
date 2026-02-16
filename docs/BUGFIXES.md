# Bug Fixes - Phase 1B

## Issue #1: Components Could Exceed Bottom Board Boundary

**Problem:**
- Components could be placed, moved, or resized past the bottom edge of the board
- Other three edges (top, left, right) were properly bounded
- Bottom boundary was not enforced by RGL

**Root Cause:**
- RGL `maxRows` property was not set
- Without `maxRows`, RGL allows infinite vertical expansion

**Fix:**
- Added `maxRows` calculation: `board.height / board.gridSize` (68 rows)
- Added `maxRows={rows}` to ResponsiveGridLayout configuration
- Updated placement collision detection to check all boundaries

**Files Changed:**
- `src/components/Board.jsx` - Added rows calculation and maxRows prop
- `src/components/Board.jsx` - Updated wouldCollide() to check boundaries

**Result:**
- Components now properly bounded on all four edges
- Cannot place, drag, or resize past any board edge
- Shadow preview shows red when attempting to place beyond boundaries

---

## Issue #2: Horizontal Grid Misalignment (Increasing Rightward Drift)

**Problem:**
- Components aligned perfectly on left side of board
- Alignment drift increased toward right side
- Components appeared slightly right of grid lines
- Shadow previews aligned correctly, but final placement drifted

**Root Cause:**
- Board width (2560px) was not exactly divisible by gridSize (30px)
- Calculation: 2560 / 30 = 85.333... columns (using Math.floor = 85 columns)
- RGL column width: 2560 / 85 = 30.117647px per column
- Visual grid: exactly 30px per column
- Difference: 0.117647px per column
- At column 85: 0.117647 × 85 = 10px cumulative drift!

**Detailed Analysis:**

Visual Grid:
```
Column 0:    0px
Column 1:   30px
Column 2:   60px
...
Column 85: 2550px
```

RGL Grid (before fix):
```
Column 0:     0px
Column 1:    30.117647px
Column 2:    60.235294px
...
Column 85: 2560px (10px drift!)
```

**Fix:**
- Changed board width from 2560px to 2550px (85 × 30 = 2550)
- Changed board height from 2048px to 2040px (68 × 30 = 2040)
- Changed column calculation from `Math.floor(width / gridSize)` to `width / gridSize`
- Added `transformScale={1}` to RGL for clarity

**Files Changed:**
- `src/stores/useBoardStore.js` - Updated board dimensions
- `src/components/Board.jsx` - Updated cols/rows calculation

**Result:**
- Perfect alignment at all positions on the board
- Visual grid and RGL grid now exactly synchronized
- No cumulative drift
- RGL column width: 2550 / 85 = 30.000000px (exact match!)

---

## Key Takeaway: Grid Alignment

**Rule:** Board dimensions MUST be exactly divisible by gridSize.

**Formula:**
```
width  = desiredColumns × gridSize
height = desiredRows    × gridSize
```

**Example Configurations:**

30px grid:
```javascript
board: {
  width: 2550,   // 85 columns
  height: 2040,  // 68 rows
  gridSize: 30
}
```

40px grid:
```javascript
board: {
  width: 2560,   // 64 columns
  height: 2040,  // 51 rows
  gridSize: 40
}
```

50px grid:
```javascript
board: {
  width: 2550,   // 51 columns
  height: 2050,  // 41 rows
  gridSize: 50
}
```

**Never do this:**
```javascript
board: {
  width: 2560,   // ❌ 2560 / 30 = 85.333... (causes drift)
  height: 2048,  // ❌ 2048 / 30 = 68.266... (causes drift)
  gridSize: 30
}
```

---

## Testing Verification

### Test Bottom Boundary
1. Place component near bottom of board
2. Try to drag it past bottom edge
3. Try to resize it past bottom edge
4. Component should stop at boundary (cannot exceed)

### Test Grid Alignment
1. Place components at various positions across board
2. Verify alignment with grid lines at all positions
3. Check far-right edge (previously had worst drift)
4. All components should align perfectly with grid

### Test Placement Preview
1. Enter placement mode
2. Move shadow across entire board
3. Shadow should align with grid everywhere
4. Final placed component should match shadow position exactly

---

**Status:** ✅ Both issues resolved and tested
**Date:** Phase 1B completion
**Impact:** Critical for user experience and spatial precision
