# Spatial Board UI - Setup Guide

## Prerequisites

- **Node.js** version 18 or higher
- **npm** version 9 or higher

Verify your versions:
```bash
node --version
npm --version
```

---

## Installation Steps

### 1. Install All Dependencies

Run this command from the project root:

```bash
npm install
```

This will install:

**Core Dependencies:**
- `react` (^18.3.1) - Core React library
- `react-dom` (^18.3.1) - React DOM rendering
- `react-grid-layout` (^1.4.4) - Grid layout engine for draggable/resizable components
- `zustand` (^4.5.5) - Lightweight state management

**Development Dependencies:**
- `vite` (^5.4.11) - Fast build tool and dev server
- `@vitejs/plugin-react` (^4.3.3) - React plugin for Vite with Fast Refresh

---

## Verify Installation

After running `npm install`, verify that `node_modules/` directory exists and contains the packages:

```bash
ls node_modules/ | grep -E '(react|zustand|vite|react-grid-layout)'
```

You should see:
- react
- react-dom
- react-grid-layout
- zustand
- vite

---

## Project Structure Created

The following structure has been set up:

```
visworkboard/
├── src/
│   ├── components/          # React components (board, tiles, etc.)
│   ├── stores/              # Zustand state stores
│   ├── utils/               # Helper functions
│   ├── styles/              # Additional CSS files
│   ├── App.jsx              # Root application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── docs/                    # Architecture documentation
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Project dependencies
├── .gitignore               # Git ignore rules
└── README.md                # Project overview
```

---

## Running the Development Server

Once dependencies are installed, start the dev server:

```bash
npm run dev
```

**What happens:**
1. Vite starts the development server on port 3000
2. Browser opens automatically to `http://localhost:3000`
3. You'll see a placeholder page confirming the setup is complete
4. Hot Module Replacement (HMR) is active - changes auto-refresh

---

## Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Next Steps - Development Phases

According to the architecture document, development follows these phases:

### **Phase 1A - Core Board Infrastructure**
- Fixed viewport container
- Board container with CSS transform panning
- Zustand store setup
- Pan interaction (mouse drag on empty space)

### **Phase 1B - react-grid-layout Integration**
- Grid layout component
- Tile placement system
- Drag-and-drop movement
- Resize handles
- Collision behavior modes

### **Phase 1C - Component Framework**
- Base component wrapper
- Component menu UI (top-right corner)
- Style controls (background, opacity, text color)
- Delete functionality

### **Phase 1D - Board Settings Panel**
- Board name input
- Board size configuration
- Background color/image
- Overlap mode toggle

### **Phase 1E - Persistence**
- Save board state to localStorage
- Load board state on mount
- Auto-save on changes

---

## Configuration Details

### Vite Configuration (`vite.config.js`)

```javascript
{
  server: {
    port: 3000,        // Dev server port
    open: true         // Auto-open browser
  },
  build: {
    outDir: 'dist',    // Production build directory
    sourcemap: true    // Generate source maps for debugging
  }
}
```

### Package Configuration

The project is configured as an ES module (`"type": "module"` in package.json), which is required for modern React development with Vite.

---

## Key Architecture Notes

### Grid System
- Grid size: 30px columns × 30px rows
- Board size: ~2560px × ~2048px (initial)
- Grid is logical only (not visually rendered)

### State Management (Zustand)
The store will manage:
- Board configuration (size, background, overlap mode)
- Viewport state (panX, panY, zoom)
- Components collection (tiles with layout, content, style)

### Interaction Model
1. **Drag on component** → Move component (RGL)
2. **Drag resize handle** → Resize component (RGL)
3. **Drag on empty space** → Pan board
4. **Click menu icon** → Open component settings

---

## Troubleshooting

### Port 3000 Already in Use
If port 3000 is occupied, Vite will prompt to use another port or you can modify `vite.config.js`:

```javascript
server: {
  port: 3001  // or any available port
}
```

### Dependencies Not Installing
Clear npm cache and retry:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### React DevTools
Install React DevTools browser extension for enhanced debugging:
- Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

---

## Ready to Build!

Your workspace is now fully configured and ready for Phase 1A development. Start the dev server and begin building the spatial board UI:

```bash
npm run dev
```

Refer to `docs/spatial_board_ui_phase_1_system_architecture_llm_build_guide.md` for detailed architecture specifications.
