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
    showTestControls: true, // Show/hide test controls panel
    showGrid: true, // Show/hide grid lines
    background: {
      type: 'solid', // 'solid' | 'gradient' | 'image'
      solidColor: '#808080', // For solid type
      gradientColors: ['#808080', '#606060'], // For gradient type [color1, color2]
      gradientDirection: 'vertical', // 'horizontal' | 'vertical' | 'diagonal'
      imageUrl: null, // For image type
      imageName: null, // Display name for uploaded images
    },
    overlapMode: 'no-overlap', // 'no-overlap' | 'overlap' | 'bump' (displayed as "Push Down")
  },

  // Uploaded images storage
  uploadedImages: {},

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
    set((state) => {
      const newBoard = { ...state.board, ...updates };
      
      // If board size changed, reset pan position appropriately
      if (updates.width !== undefined || updates.height !== undefined) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const boardWidth = newBoard.width;
        const boardHeight = newBoard.height;
        
        // Calculate centered position for dimensions smaller than viewport
        const panX = boardWidth < viewportWidth ? (viewportWidth - boardWidth) / 2 : 0;
        const panY = boardHeight < viewportHeight ? (viewportHeight - boardHeight) / 2 : 0;
        
        return {
          board: newBoard,
          viewport: { ...state.viewport, panX, panY },
        };
      }
      
      return { board: newBoard };
    }),

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
    set((state) => {
      if (!state.components[id]) return state;
      
      const component = state.components[id];
      return {
        components: {
          ...state.components,
          [id]: {
            ...component,
            ...updates,
            // Deep merge style and content objects
            style: updates.style ? { ...component.style, ...updates.style } : component.style,
            content: updates.content ? { ...component.content, ...updates.content } : component.content,
          },
        },
      };
    }),

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

  // Add uploaded image
  addUploadedImage: (name, dataUrl) =>
    set((state) => ({
      uploadedImages: {
        ...state.uploadedImages,
        [name]: dataUrl,
      },
    })),

  // Persistence helpers (Phase 1E - Multi-board support)
  // Design note: localStorage keys mirror future database structure for easy migration
  
  /**
   * Get metadata about all saved boards
   * Returns: { lastOpenedBoardId: string, boards: [{id, name, lastModified}] }
   */
  getBoardsMetadata: () => {
    const meta = localStorage.getItem('spatial-boards-meta');
    if (meta) {
      return JSON.parse(meta);
    }
    // Return default metadata if none exists
    return {
      lastOpenedBoardId: 'default-board',
      boards: [
        { id: 'default-board', name: 'Default', lastModified: Date.now() }
      ],
    };
  },

  /**
   * Update boards metadata
   */
  setBoardsMetadata: (metadata) => {
    localStorage.setItem('spatial-boards-meta', JSON.stringify(metadata));
  },

  /**
   * Save current board state to localStorage
   * @param {string} boardName - Optional custom name for the board
   */
  saveCurrentBoard: (boardName) => {
    const state = useBoardStore.getState();
    const boardId = state.board.id;
    const finalName = boardName || state.board.name;

    // Save board data with key pattern that mirrors future DB table
    const boardData = {
      board: { ...state.board, name: finalName },
      viewport: state.viewport,
      components: state.components,
      uploadedImages: state.uploadedImages,
      lastModified: Date.now(),
    };
    
    localStorage.setItem(`spatial-board-${boardId}`, JSON.stringify(boardData));

    // Update metadata
    const metadata = useBoardStore.getState().getBoardsMetadata();
    const existingBoardIndex = metadata.boards.findIndex(b => b.id === boardId);
    
    if (existingBoardIndex >= 0) {
      // Update existing board metadata
      metadata.boards[existingBoardIndex] = {
        id: boardId,
        name: finalName,
        lastModified: Date.now(),
      };
    } else {
      // Add new board to metadata
      metadata.boards.push({
        id: boardId,
        name: finalName,
        lastModified: Date.now(),
      });
    }
    
    metadata.lastOpenedBoardId = boardId;
    useBoardStore.getState().setBoardsMetadata(metadata);
  },

  /**
   * Load a specific board by ID
   * @param {string} boardId - The ID of the board to load
   */
  loadBoard: (boardId) => {
    const saved = localStorage.getItem(`spatial-board-${boardId}`);
    if (saved) {
      const data = JSON.parse(saved);
      const defaultState = useBoardStore.getState();
      
      // Migrate old background format if needed
      let boardData = data.board || defaultState.board;
      if (boardData.background && typeof boardData.background === 'string') {
        boardData = {
          ...boardData,
          background: {
            type: 'solid',
            solidColor: boardData.background,
            gradientColors: [boardData.background, '#606060'],
            gradientDirection: 'vertical',
            imageUrl: null,
            imageName: null,
          },
        };
      }
      
      set({
        board: boardData,
        viewport: data.viewport || defaultState.viewport,
        components: data.components || {},
        uploadedImages: data.uploadedImages || {},
      });

      // Update last opened board in metadata
      const metadata = useBoardStore.getState().getBoardsMetadata();
      metadata.lastOpenedBoardId = boardId;
      useBoardStore.getState().setBoardsMetadata(metadata);
      
      return true;
    }
    return false;
  },

  /**
   * Load the last opened board (called on app initialization)
   */
  loadLastBoard: () => {
    const metadata = useBoardStore.getState().getBoardsMetadata();
    const lastBoardId = metadata.lastOpenedBoardId || 'default-board';
    
    // Try to load the last board
    const loaded = useBoardStore.getState().loadBoard(lastBoardId);
    
    // If load failed, create a default board
    if (!loaded) {
      useBoardStore.getState().saveCurrentBoard('Default');
    }
  },

  /**
   * Get list of all available boards
   * Returns: [{id, name, lastModified}]
   */
  getAvailableBoards: () => {
    const metadata = useBoardStore.getState().getBoardsMetadata();
    return metadata.boards || [];
  },

  /**
   * Delete a board (not exposed in UI yet, but available for future use)
   */
  deleteBoard: (boardId) => {
    // Don't allow deleting the last board
    const metadata = useBoardStore.getState().getBoardsMetadata();
    if (metadata.boards.length <= 1) {
      return false;
    }

    // Remove from localStorage
    localStorage.removeItem(`spatial-board-${boardId}`);

    // Update metadata
    metadata.boards = metadata.boards.filter(b => b.id !== boardId);
    
    // If we deleted the last opened board, switch to first available
    if (metadata.lastOpenedBoardId === boardId) {
      metadata.lastOpenedBoardId = metadata.boards[0].id;
      useBoardStore.getState().loadBoard(metadata.boards[0].id);
    }
    
    useBoardStore.getState().setBoardsMetadata(metadata);
    return true;
  },

  // Legacy support - migrate old single-board format
  migrateOldFormat: () => {
    const oldData = localStorage.getItem('spatial-board-state');
    if (oldData && !localStorage.getItem('spatial-boards-meta')) {
      // Old format exists and new format doesn't - migrate it
      const data = JSON.parse(oldData);
      
      // Create default board with old data
      localStorage.setItem('spatial-board-default-board', oldData);
      
      // Create metadata
      const metadata = {
        lastOpenedBoardId: 'default-board',
        boards: [
          { id: 'default-board', name: 'Default', lastModified: Date.now() }
        ],
      };
      localStorage.setItem('spatial-boards-meta', JSON.stringify(metadata));
      
      // Remove old format
      localStorage.removeItem('spatial-board-state');
    }
  },
}));

export default useBoardStore;
