import { create } from 'zustand';

/**
 * Zustand store for managing board state, viewport state, and components
 * Based on Phase 1 Architecture Specification
 */
const useBoardStore = create((set) => ({
  // Board Configuration
  board: {
    id: 'default-board',
    name: 'My Board',
    width: 2550,  // pixels (85 columns × 30px = exactly divisible by gridSize)
    height: 2040, // pixels (68 rows × 30px = exactly divisible by gridSize)
    gridSize: 30, // pixels (for both columns and rows)
    background: '#808080', // neutral gray
    overlapMode: 'overlap', // 'overlap' | 'no-overlap' | 'bump'
  },

  // Viewport State (panning and zoom)
  viewport: {
    panX: 0,
    panY: 0,
    zoom: 1, // Scaffolding for future zoom feature
  },

  // Components collection (empty for Phase 1A)
  components: {},

  // Actions for updating board configuration
  updateBoard: (updates) =>
    set((state) => ({
      board: { ...state.board, ...updates },
    })),

  // Actions for updating viewport (panning)
  setViewportPan: (panX, panY) =>
    set((state) => ({
      viewport: { ...state.viewport, panX, panY },
    })),

  // Action to reset viewport to top-left (origin)
  resetViewport: () =>
    set((state) => ({
      viewport: { ...state.viewport, panX: 0, panY: 0 },
    })),

  // Zoom scaffolding (not exposed in UI yet)
  setViewportZoom: (zoom) =>
    set((state) => ({
      viewport: { ...state.viewport, zoom },
    })),

  // Component management
  addComponent: (component) =>
    set((state) => ({
      components: {
        ...state.components,
        [component.id]: component,
      },
    })),

  updateComponent: (id, updates) =>
    set((state) => ({
      components: {
        ...state.components,
        [id]: { ...state.components[id], ...updates },
      },
    })),

  removeComponent: (id) =>
    set((state) => {
      const { [id]: removed, ...rest } = state.components;
      return { components: rest };
    }),

  // Update component layout (from RGL drag/resize events)
  updateComponentLayout: (id, layout) =>
    set((state) => {
      if (!state.components[id]) return state;
      return {
        components: {
          ...state.components,
          [id]: {
            ...state.components[id],
            layout: { ...state.components[id].layout, ...layout },
          },
        },
      };
    }),

  // Batch update all component layouts (from RGL onLayoutChange)
  updateAllLayouts: (layouts) =>
    set((state) => {
      const updatedComponents = { ...state.components };
      layouts.forEach((layout) => {
        if (updatedComponents[layout.i]) {
          updatedComponents[layout.i] = {
            ...updatedComponents[layout.i],
            layout: {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            },
          };
        }
      });
      return { components: updatedComponents };
    }),

  // Persistence helpers (for Phase 1E)
  saveToLocalStorage: () => {
    const state = useBoardStore.getState();
    localStorage.setItem('spatial-board-state', JSON.stringify({
      board: state.board,
      viewport: state.viewport,
      components: state.components,
    }));
  },

  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('spatial-board-state');
    if (saved) {
      const data = JSON.parse(saved);
      set({
        board: data.board || useBoardStore.getState().board,
        viewport: data.viewport || useBoardStore.getState().viewport,
        components: data.components || {},
      });
    }
  },
}));

export default useBoardStore;
