# Quick Start - Phase 1B Features

## 🎯 What's New in Phase 1B

Phase 1B adds **component placement and management** using react-grid-layout.

## 🚀 Try It Out

### Add Your First Component

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Click the green "+" button** in the lower-right corner

3. **Select "Test Component"** from the menu

4. **Move your mouse** over the board
   - Green shadow = valid placement ✅
   - Red shadow = collision detected ❌

5. **Click to place** the component on the board

### Move Components

1. **Click and drag** the component body (not the corner)
2. Component moves with grid snapping
3. Blue placeholder shows destination
4. **Release to drop**

### Resize Components

1. **Hover over lower-right corner** of any component
2. Cursor changes to resize cursor
3. **Click and drag** to resize
4. Component resizes in grid increments (30px)
5. Minimum size: 2×2 squares (60×60px)

### Pan the Board

- **Click and drag empty gray space** to pan
- Components move with the board
- Pan still limited to 1 grid square border

## ⌨️ Keyboard Shortcuts

- **ESC** - Cancel placement mode

## 🎨 Visual Indicators

| Color | Meaning |
|-------|---------|
| 🟢 Green shadow | Valid placement location |
| 🔴 Red shadow | Collision - cannot place here |
| 🔵 Blue placeholder | Component destination during drag |
| ⚪ White corner indicator | Resize handle |

## 📏 Component Specs

**Test Component:**
- Default size: 4×4 squares (120×120px)
- Minimum size: 2×2 squares (60×60px)
- Grid snap: 30px increments
- Styling: Semi-transparent dark gray, white border

## 🔧 Collision Behavior

**Current Mode:** No Overlap

- Cannot place components on top of each other
- Cannot drag into occupied space
- Cannot resize into other components
- Components push against boundaries

**Future:** Settings to allow overlap or bump/displace (Phase 1D)

## 💡 Tips

1. **Add multiple components** - place as many test components as you want
2. **Organize spatially** - drag components to group related items
3. **Use the grid** - semi-transparent grid helps with alignment
4. **Pan to explore** - board is 2560×2048px, much larger than viewport
5. **ESC to cancel** - press ESC any time during placement to cancel

## 🐛 Expected Behaviors

- ✅ Components snap to 30px grid
- ✅ Drag is smooth with placeholder
- ✅ Resize respects minimum size
- ✅ Cannot overlap components (by design)
- ✅ Placement mode disables panning
- ✅ Components stay within board bounds

## 🎯 What Works Now

- ✅ Add test components
- ✅ Drag components to move
- ✅ Resize components from corner
- ✅ Collision prevention
- ✅ Grid snapping
- ✅ Pan board with components
- ✅ Shadow preview during placement

## 🚧 Coming in Phase 1C

- Component menu (delete, style options)
- Custom background colors
- Text color customization
- Opacity controls
- Delete individual components

## 🚧 Coming in Phase 1D

- Board settings panel
- Change board name and size
- Set board background
- Toggle overlap modes (overlap, bump, no-overlap)

---

**Ready to build your spatial workspace!** 🎉

Place components, organize them spatially, and create your custom board layout.
