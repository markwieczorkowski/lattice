# Quick Start - Phase 1D Board Settings

## 🎯 What's New in Phase 1D

Phase 1D adds **Board Settings Panel** with comprehensive customization options.

## 🎨 Access Board Settings

**Location:** Green button with three lines (≡) in upper-right corner

**How to open:**
1. Click the board settings button
2. Settings dialog appears
3. Make your changes
4. Click **Apply** to save or **Cancel** to discard

## ⚙️ Available Settings

### 1. Current Board
- Dropdown selector
- Currently: "Default" (placeholder)
- Future: Switch between multiple boards

### 2. Show Test Controls
- Checkbox to show/hide info panel (top-left)
- Default: Checked (visible)
- Uncheck for cleaner UI

### 3. Board Size
- **Width** and **Height** inputs
- Units: pixels
- Recommendation: Use multiples of 30 (grid size)

**Examples:**
- Small: 1800 × 1500
- Medium: 2550 × 2040 (default)
- Large: 3600 × 2700

### 4. Board Background

Choose from three types:

#### Solid Color
- Single color picker
- Choose any color
- Simple and clean

#### Gradient Color
- **Color 1** - Start color
- **Color 2** - End color
- **Direction** - Horizontal, Vertical, or Diagonal

**Try these:**
- Sunset: #ff7e5f → #feb47b (Horizontal)
- Ocean: #2e3192 → #1bffff (Vertical)
- Forest: #134e5e → #71b280 (Diagonal)

#### Image
- **Select Image** - Choose from uploaded images
- **Upload Image** - Add new background image

**Supported formats:** JPEG, PNG, GIF, WebP

**Image behavior:**
- Covers entire board
- Centered
- No repeat

## 💡 Example Configurations

### Minimalist Board
- Size: 2550 × 2040
- Background: Solid #e0e0e0 (light gray)
- Show Test Controls: Off

### Vibrant Board
- Size: 3000 × 2400
- Background: Gradient (#ff6b6b → #4ecdc4, Diagonal)
- Show Test Controls: On

### Custom Branded Board
- Size: 2550 × 2040
- Background: Image (your logo/branding)
- Show Test Controls: Off

### Large Workspace
- Size: 4200 × 3000
- Background: Solid #2a2a2a (dark)
- Show Test Controls: On

## 🎨 Creative Background Ideas

### Gradients

**Warm Sunset:**
- Type: Gradient
- Colors: #FF512F → #DD2476
- Direction: Horizontal

**Cool Ocean:**
- Type: Gradient
- Colors: #00D4FF → #0099FF
- Direction: Vertical

**Purple Haze:**
- Type: Gradient
- Colors: #8E2DE2 → #4A00E0
- Direction: Diagonal

**Earth Tones:**
- Type: Gradient
- Colors: #8B7355 → #614124
- Direction: Vertical

### Solid Colors

**Professional:**
- Navy: #1e3a5f
- Charcoal: #36454f
- Slate: #708090

**Vibrant:**
- Teal: #008080
- Coral: #ff7f50
- Lavender: #9370db

## ⌨️ Workflow

### Quick Style Change

1. Click settings button (≡)
2. Select background type
3. Choose colors
4. Click Apply
5. Done!

### Upload Background Image

1. Click settings button
2. Select "Image" from background type
3. Click "Upload Image"
4. Choose file from computer
5. Preview appears
6. Click Apply
7. Image covers board

### Resize Board

1. Click settings button
2. Enter new Width: 3000
3. Enter new Height: 2400
4. Click Apply
5. Board resizes (components stay positioned)
6. Pan to explore larger area

### Toggle Test Controls

1. Click settings button
2. Uncheck "Show Test Controls"
3. Click Apply
4. Info panel (top-left) hidden
5. Cleaner workspace view

## 🎯 Important Notes

### Apply Required

**Board settings are NOT live preview:**
- Changes staged in dialog
- Must click Apply to save
- Cancel discards all changes
- Different from component configuration

### Board Size Recommendations

**For best grid alignment:**
- Use multiples of 30px
- Examples: 1800, 2100, 2550, 3000, 3600

**Why:** Prevents grid drift and ensures perfect alignment

### Image Size

**Recommendation:** 
- Keep images under 2MB
- Larger images increase localStorage usage
- Images stored as base64 (larger than original)

### Background Visibility

**Components have semi-transparent backgrounds:**
- Background color shows through components
- Helps with spatial context
- Choose backgrounds that work with component colors

## 🔧 Troubleshooting

**Image won't upload?**
- Check file format (JPEG, PNG, GIF, WebP only)
- Try smaller file size

**Gradient not showing?**
- Click Apply button
- Check both colors are different
- Try different direction

**Board size changed but looks wrong?**
- Use multiples of 30px for perfect grid alignment
- Example: 2550, not 2560

**Test controls won't hide?**
- Make sure to click Apply after unchecking
- Check box state in dialog

## 🚧 Coming in Phase 1E

- Auto-save to localStorage
- Manual save/load UI
- Export board configuration
- Import board configuration
- Reset to defaults

---

**Start customizing your board!** 🎨

Choose colors, upload images, resize your workspace, and create your perfect spatial environment.
