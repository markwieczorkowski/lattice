# Spatial Board UI - Phase 1

A flexible, component-based spatial workspace built with React and react-grid-layout.

## Features

- **Spatial 2D Workspace**: Bounded board larger than the viewport
- **Grid-based Layout**: Discrete grid units for predictable component placement
- **Draggable & Resizable Components**: Intuitive interaction with all components
- **Pannable Viewport**: Navigate large boards with smooth panning
- **Modular Architecture**: Extensible component type system

## Technology Stack

- **React** - UI framework
- **react-grid-layout** - Grid layout engine
- **Zustand** - State management
- **Vite** - Build tool and dev server
- **localStorage** - Persistence (Phase 1)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
lattice/
├── src/
│   ├── components/      # React components
│   ├── stores/          # Zustand state stores
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global CSS
├── docs/                # Documentation
├── public/              # Static assets
└── index.html           # HTML entry point
```

## Architecture

See `docs/spatial_board_ui_phase_1_system_architecture_llm_build_guide.md` for detailed system architecture and development plan.

## Development Phases

- **Phase 1A**: Core Board Infrastructure
- **Phase 1B**: react-grid-layout Integration
- **Phase 1C**: Component Framework
- **Phase 1D**: Board Settings Panel
- **Phase 1E**: Persistence

## License

ISC
