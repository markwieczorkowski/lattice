# Minimum Size Constraint Fix

## Issue

Components could be resized below their configured minimum dimensions (2×2 squares), down to 1×1 square.

**Expected:** Test components should not resize below 2×2 (60×60px)  
**Actual:** Components could resize down to 1×1 (30×30px)

## Root Cause

The minimum constraints were defined in two places but not properly connected:

1. **Component Registry** (`componentRegistry.js`):
   ```javascript
   test: {
     minWidth: 2,
     minHeight: 2
   }
   ```

2. **RGL Layout Generation** (`Board.jsx` - `getLayoutFromComponents()`):
   ```javascript
   {
     i: comp.id,
     x, y, w, h,
     minW: getComponentType(comp.type)?.minWidth || 2,
     minH: getComponentType(comp.type)?.minHeight || 2,
   }
   ```

**Problem:** The `data-grid` attribute passed to individual grid items only included layout data:
```javascript
<div key={component.id} data-grid={component.layout}>
```

The `component.layout` object only contains `{ x, y, w, h }` - **no minW or minH**.

## Why This Matters

React Grid Layout (RGL) respects minimum constraints from two sources:

1. **layouts prop** - Initial layout configuration
2. **data-grid attribute** - Per-item overrides (takes precedence)

Since we were passing `data-grid={component.layout}` without minW/minH, RGL had no minimum constraints on the actual rendered items, even though the layouts prop had them.

## Solution

Update the `data-grid` attribute to include minimum constraints from the component type:

**Before:**
```javascript
<div key={component.id} data-grid={component.layout}>
  <ComponentTile component={component} />
</div>
```

**After:**
```javascript
{Object.values(components).map((component) => {
  const componentType = getComponentType(component.type);
  return (
    <div 
      key={component.id} 
      data-grid={{
        ...component.layout,
        minW: componentType?.minWidth || 2,
        minH: componentType?.minHeight || 2,
      }}
    >
      <ComponentTile component={component} />
    </div>
  );
})}
```

## What This Does

1. Retrieves component type definition from registry
2. Extracts minWidth and minHeight
3. Includes them in data-grid object
4. RGL enforces these constraints during resize

## Result

✅ Test components cannot be resized below 2×2 squares (60×60px)  
✅ Resize handle stops at minimum dimensions  
✅ Constraints applied consistently  
✅ Works for all component types (extensible)

## Testing

1. Place a test component (default 4×4)
2. Drag resize handle to make it smaller
3. Component should stop at 2×2
4. Cannot resize to 1×1

## Future Component Types

When adding new component types, minimum constraints will automatically apply:

```javascript
export const COMPONENT_TYPES = {
  test: { minWidth: 2, minHeight: 2 },
  note: { minWidth: 3, minHeight: 4 },  // Different minimums
  widget: { minWidth: 4, minHeight: 2 },
};
```

Each component type can have unique minimum dimensions based on its content requirements.

## Files Modified

- `src/components/Board.jsx` - Updated component rendering to include minW/minH in data-grid

**Status:** ✅ Fixed
