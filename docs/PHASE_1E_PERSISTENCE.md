# Phase 1E: Persistence System

## Overview

Phase 1E implements a robust persistence system for saving and loading board states. The system is designed with **future database and multi-user support in mind**, using localStorage as the initial storage backend while maintaining a structure that can easily transition to a server-side database.

## Features Implemented

### Core Functionality
- ✅ **Multi-board support** - Save and manage multiple independent boards
- ✅ **Manual save/load** - User-controlled save and load operations via UI
- ✅ **Auto-load on startup** - Automatically loads the last opened board when app starts
- ✅ **Board metadata tracking** - Tracks board names, IDs, and last modified timestamps
- ✅ **Legacy migration** - Automatically migrates old single-board format to new multi-board format

### User Interface
- ✅ **LoadSave button** - Positioned to the left of Board Settings button
- ✅ **LoadSave dialog** - Clean interface for selecting and managing boards
- ✅ **Current board indicator** - Shows which board is currently active
- ✅ **Board selector** - Dropdown to select from available boards
- ✅ **Save/Load actions** - Dedicated buttons for each operation

## Architecture Design

### Storage Structure (localStorage)

The persistence system uses a **database-like structure** in localStorage that directly maps to how data would be stored in a future database:

```javascript
// Metadata table (equivalent to a 'boards_meta' table)
localStorage['spatial-boards-meta'] = {
  lastOpenedBoardId: 'default-board',  // User preference
  boards: [                             // List of available boards
    {
      id: 'default-board',              // Primary key
      name: 'Default',                  // User-facing name
      lastModified: 1645123456789       // Timestamp
    },
    // ... more boards
  ]
}

// Individual board data (equivalent to 'boards' table with foreign keys)
localStorage['spatial-board-{id}'] = {
  board: {                              // Board configuration
    id: 'board-id',
    name: 'Board Name',
    width: 2550,
    height: 2040,
    gridSize: 30,
    showTestControls: true,
    showGrid: true,
    background: { /* ... */ },
    overlapMode: 'no-overlap'
  },
  viewport: {                           // Viewport state
    panX: 0,
    panY: 0,
    zoom: 1
  },
  components: {                         // Components collection
    'component-id-1': { /* ... */ },
    'component-id-2': { /* ... */ }
  },
  uploadedImages: {                     // Uploaded images
    'image-name': 'data:image/png;base64,...'
  },
  lastModified: 1645123456789           // Timestamp
}
```

### Database Migration Path

When transitioning to a database, the localStorage structure maps directly to tables:

**Future Database Schema:**

```sql
-- Metadata table (per user in multi-user version)
CREATE TABLE boards_meta (
  user_id VARCHAR(255),                 -- Added in Phase 2+
  last_opened_board_id VARCHAR(255),
  PRIMARY KEY (user_id)
);

-- Boards table
CREATE TABLE boards (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),                 -- Added in Phase 2+ (foreign key)
  name VARCHAR(255),
  width INT,
  height INT,
  grid_size INT,
  show_test_controls BOOLEAN,
  show_grid BOOLEAN,
  background JSON,                      -- Or separate columns
  overlap_mode VARCHAR(50),
  last_modified BIGINT,
  created_at BIGINT
);

-- Viewport states (optional - could be part of boards)
CREATE TABLE viewport_states (
  board_id VARCHAR(255) PRIMARY KEY,
  pan_x FLOAT,
  pan_y FLOAT,
  zoom FLOAT,
  FOREIGN KEY (board_id) REFERENCES boards(id)
);

-- Components table
CREATE TABLE components (
  id VARCHAR(255) PRIMARY KEY,
  board_id VARCHAR(255),
  type VARCHAR(50),
  layout_x INT,
  layout_y INT,
  layout_w INT,
  layout_h INT,
  style JSON,
  content JSON,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- Uploaded images (could be stored as file references)
CREATE TABLE uploaded_images (
  id VARCHAR(255) PRIMARY KEY,
  board_id VARCHAR(255),                -- Or user_id for shared images
  name VARCHAR(255),
  data_url TEXT,                        -- Or file_path for server storage
  FOREIGN KEY (board_id) REFERENCES boards(id)
);
```

## API Layer (Zustand Store)

The Zustand store provides a clean API that abstracts storage operations. When migrating to a database, only the implementation of these methods needs to change:

### Storage Methods

```javascript
// Read operations
getBoardsMetadata()          // Get list of all boards and metadata
getAvailableBoards()         // Get array of available boards
loadBoard(boardId)           // Load specific board by ID
loadLastBoard()              // Load last opened board (auto-load)

// Write operations
saveCurrentBoard(boardName)  // Save current board state
setBoardsMetadata(metadata)  // Update metadata

// Maintenance operations
deleteBoard(boardId)         // Delete a board (not exposed in UI yet)
migrateOldFormat()          // Migrate legacy single-board format
```

### Migration Strategy

To convert from localStorage to database:

1. **Create database adapter layer:**
   ```javascript
   // src/services/storageAdapter.js
   class StorageAdapter {
     async getBoardsMetadata(userId) { /* ... */ }
     async saveBoard(userId, boardData) { /* ... */ }
     async loadBoard(userId, boardId) { /* ... */ }
     // ... etc
   }
   
   // localStorage implementation
   class LocalStorageAdapter extends StorageAdapter { /* ... */ }
   
   // Database implementation (Phase 2+)
   class DatabaseAdapter extends StorageAdapter { /* ... */ }
   ```

2. **Update store to use adapter:**
   ```javascript
   const adapter = new LocalStorageAdapter();  // Or DatabaseAdapter
   
   getBoardsMetadata: () => adapter.getBoardsMetadata(),
   saveCurrentBoard: (name) => adapter.saveBoard(/* ... */),
   // ... etc
   ```

3. **Add user authentication:**
   - Pass `userId` to all adapter methods
   - Filter board lists by user
   - Add sharing permissions table

## User Workflow

### Saving a Board

1. User clicks **LoadSave button** (floppy disk icon, upper-right)
2. LoadSave dialog opens
3. User enters/edits board name in "Board Name" field
4. User clicks **Save** button
5. Current board state is saved with the specified name
6. Dialog shows updated board list
7. Dialog closes

**Technical Flow:**
```javascript
saveCurrentBoard(boardName)
  → Save board data to localStorage['spatial-board-{id}']
  → Update metadata with board info
  → Update lastOpenedBoardId
```

### Loading a Board

1. User clicks **LoadSave button**
2. LoadSave dialog opens, showing current board
3. User selects a board from the dropdown
4. User clicks **Load** button
5. Selected board state is loaded into the app
6. Dialog closes

**Technical Flow:**
```javascript
loadBoard(boardId)
  → Read from localStorage['spatial-board-{id}']
  → Update Zustand store with loaded data
  → Update lastOpenedBoardId in metadata
  → Trigger re-render
```

### Auto-Load on Startup

1. App initializes (`App.jsx` mounts)
2. `migrateOldFormat()` checks for legacy data
3. `loadLastBoard()` reads metadata
4. Last opened board is loaded automatically
5. If load fails, creates default board

**Technical Flow:**
```javascript
// In App.jsx useEffect
useEffect(() => {
  migrateOldFormat();   // One-time migration if needed
  loadLastBoard();      // Load last board or create default
}, []);
```

## Component Structure

### LoadSaveButton Component

**Location:** `/src/components/ui/LoadSaveButton.jsx`

**Purpose:** Clickable button to open LoadSave dialog

**Styling:**
- Positioned at `top: 20px, right: 90px` (left of BoardSettingsButton)
- Floppy disk icon (universal save/load symbol)
- Dark gray with 75% opacity, frosted glass effect
- Consistent with other UI buttons

### LoadSaveDialog Component

**Location:** `/src/components/dialogs/LoadSaveDialog.jsx`

**Purpose:** Modal dialog for save/load operations

**Features:**
- Current board display (read-only)
- Board selector dropdown (sorted by last modified)
- Board name input (for saving)
- Load button (loads selected board)
- Save button (saves current board with entered name)
- Rendered via React Portal for proper positioning

**Styling:**
- Dark theme (rgba(64, 64, 64, 0.95))
- 75% opacity with backdrop blur
- Viewport-centered
- Event propagation isolated

## Data Flow

### Save Operation

```
User Input (Board Name)
  ↓
LoadSaveDialog
  ↓
useBoardStore.saveCurrentBoard(boardName)
  ↓
Read current state (board, viewport, components, images)
  ↓
localStorage['spatial-board-{id}'] ← JSON.stringify(data)
  ↓
Update localStorage['spatial-boards-meta']
  ↓
Success
```

### Load Operation

```
User Selection (Board ID)
  ↓
LoadSaveDialog
  ↓
useBoardStore.loadBoard(boardId)
  ↓
localStorage['spatial-board-{id}'] → JSON.parse(data)
  ↓
Zustand set({ board, viewport, components, images })
  ↓
Update localStorage['spatial-boards-meta'].lastOpenedBoardId
  ↓
React re-render with new data
```

## Future Enhancements (Phase 2+)

### Multi-User Support

**Changes Required:**

1. **Authentication System:**
   - Add user login/registration
   - Store user ID in session/token
   - Pass user ID to all persistence methods

2. **Server-Side Storage:**
   - Replace localStorage with REST API calls
   - Implement DatabaseAdapter for store
   - Add server-side validation and authorization

3. **Board Ownership & Sharing:**
   - Add `user_id` column to boards table
   - Filter board lists by user
   - Add sharing permissions table:
     ```sql
     CREATE TABLE board_permissions (
       board_id VARCHAR(255),
       user_id VARCHAR(255),
       permission VARCHAR(50),  -- 'owner', 'edit', 'view'
       PRIMARY KEY (board_id, user_id)
     );
     ```

4. **Conflict Resolution:**
   - Implement optimistic locking
   - Add `version` field to boards
   - Handle concurrent edits

### Additional Features

- **Board Templates:** Pre-configured board layouts
- **Export/Import:** JSON export for backup/sharing
- **Board History:** Undo/redo with snapshots
- **Auto-Save:** Periodic background saves
- **Cloud Sync:** Real-time sync across devices
- **Board Preview:** Thumbnails in board selector

## Testing Checklist

### Manual Testing

- [ ] Create new board and save with custom name
- [ ] Load existing board from selector
- [ ] Switch between multiple boards
- [ ] Verify auto-load on page refresh
- [ ] Add components to board and save
- [ ] Load board with components - verify layout preserved
- [ ] Change board settings and save - verify settings preserved
- [ ] Upload images, save board - verify images preserved on load
- [ ] Close and reopen app - verify last board loads automatically
- [ ] Test with empty browser storage (fresh start)
- [ ] Test legacy data migration (if old format data exists)

### Edge Cases

- [ ] Save with empty board name (should show alert)
- [ ] Load non-existent board (should handle gracefully)
- [ ] Corrupted localStorage data
- [ ] localStorage quota exceeded
- [ ] Multiple rapid save operations
- [ ] Switch boards during component placement mode

## Performance Considerations

### localStorage Limits

- **5-10 MB per domain** (varies by browser)
- Current implementation stores:
  - Board config: ~1 KB
  - Components: ~500 bytes each
  - Uploaded images: Can be large (base64 encoded)

**Recommendations:**
- Limit uploaded image sizes (compress before storing)
- Consider external image hosting for future versions
- Monitor localStorage usage and warn users approaching limits

### Serialization Optimization

```javascript
// Current approach: JSON.stringify/parse (simple, works for Phase 1)
// Future optimization: Use IndexedDB for larger datasets

// Phase 2+ consideration:
// - Move to IndexedDB for client-side storage (25-50 MB typical)
// - Use binary formats for images
// - Implement lazy loading for large boards
```

## Known Limitations

### Current Version (Phase 1E)

1. **No conflict resolution** - Last save wins
2. **No version history** - Can't undo to previous save
3. **No board deletion UI** - Method exists but not exposed
4. **No board duplication** - Would be useful feature
5. **No import/export** - Boards locked to browser
6. **Image storage in base64** - Less efficient than blob storage

### Planned for Future Phases

All limitations above are acknowledged and will be addressed in Phase 2+ as outlined in the architecture document.

## Code Examples

### Saving Current Board

```javascript
// In a component
import useBoardStore from './stores/useBoardStore';

function MyComponent() {
  const saveCurrentBoard = useBoardStore(state => state.saveCurrentBoard);
  
  const handleSave = () => {
    saveCurrentBoard('My Custom Board Name');
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Loading a Specific Board

```javascript
// In a component
import useBoardStore from './stores/useBoardStore';

function MyComponent() {
  const { loadBoard, getAvailableBoards } = useBoardStore();
  
  const handleLoad = (boardId) => {
    const success = loadBoard(boardId);
    if (!success) {
      alert('Failed to load board');
    }
  };
  
  const boards = getAvailableBoards();
  
  return (
    <select onChange={(e) => handleLoad(e.target.value)}>
      {boards.map(b => (
        <option key={b.id} value={b.id}>{b.name}</option>
      ))}
    </select>
  );
}
```

### Getting Board Metadata

```javascript
const metadata = useBoardStore.getState().getBoardsMetadata();
console.log('Last opened:', metadata.lastOpenedBoardId);
console.log('Available boards:', metadata.boards);
```

## Troubleshooting

### Board Not Loading

**Symptoms:** `loadBoard()` returns `false`

**Causes:**
1. Board ID doesn't exist in localStorage
2. Corrupted JSON data
3. localStorage access denied (privacy mode)

**Solutions:**
- Check browser console for errors
- Verify localStorage in DevTools (Application → Local Storage)
- Try `migrateOldFormat()` if using old data
- Clear localStorage and restart fresh

### "Quota Exceeded" Error

**Symptoms:** Save fails, console shows quota error

**Causes:**
- Too many uploaded images
- localStorage 5 MB limit reached

**Solutions:**
- Remove unused boards: `deleteBoard(boardId)`
- Compress/remove large images
- Implement image cleanup routine
- Consider upgrading to IndexedDB (future)

### Lost Changes After Refresh

**Symptoms:** Changes disappear on page refresh

**Causes:**
- Changes not saved before refresh
- Auto-load failed silently

**Solutions:**
- Manually save before closing: Click LoadSave → Save
- Implement auto-save (future feature)
- Check browser console for load errors

---

**Phase 1E Status:** ✅ **Complete**

**Next Phase:** Phase 2 - Advanced Features (Multi-board UI, Board Templates, etc.)

**Last Updated:** February 21, 2026
