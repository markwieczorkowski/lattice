# Multi-Board Management

## Overview

The spatial board UI now supports full multi-board management with Add, Save, Load, and Delete operations. Users can create multiple boards, switch between them, and maintain separate workspace states.

## Key Concepts

### Default Board State
- **ID:** `default-unsaved`
- **Behavior:** Unnamed, unsaved starting state
- **Appearance:** Does not appear in saved boards list
- **Purpose:** Clean slate for new users or after deleting all boards

### Saved Boards
- **Unique ID:** Generated automatically (`board-{timestamp}-{random}`)
- **User-defined name:** Required for saving
- **Persistent storage:** localStorage with database-ready structure
- **Metadata tracking:** Name, ID, last modified timestamp

## User Operations

### 1. ADD (Create New Board)

**Trigger:** Click "Add" button in Current Board section

**Behavior:**
- Opens name input dialog
- Prompts: "Enter Board Name"
- User enters name → clicks OK
- Current board state saved under new name
- New board becomes active
- Original board (if named) remains saved

**Use Cases:**
- Save current work before experimenting
- Create duplicate/variant of existing board
- Save default board for first time

**Logic:**
```
Default Board + ADD → Prompt name → Save as new board → Active
Named Board + ADD → Prompt name → Save duplicate → New board active (old preserved)
```

### 2. SAVE (Update Existing Board)

**Trigger:** Click "Save" button in Current Board section

**Behavior on Default Board:**
- Same as ADD (prompts for name)
- Creates new saved board

**Behavior on Named Board:**
- Overwrites existing saved board
- No prompt (silent save)
- Updates timestamp

**Use Cases:**
- Quick save of current work
- Update existing board layout
- Checkpoint progress

**Logic:**
```
Default Board + SAVE → (Same as ADD) → Prompt name → Create new board
Named Board + SAVE → Overwrite existing save → Update timestamp
```

### 3. LOAD (Switch Boards)

**Trigger:** Select board from dropdown → Click "Load" in Saved Boards section

**Behavior:**
- Loads selected board state into app
- Replaces current board (unsaved changes lost)
- Selected board becomes active
- Will auto-load on next app visit

**Use Cases:**
- Switch between different workspaces
- Revert to saved state (discard unsaved changes)
- Load previous version/variant

**Warning:** Unsaved changes to current board are lost. Use ADD or SAVE first if needed.

**Logic:**
```
Select board → LOAD → Replace current state → Becomes active board
```

### 4. DELETE (Remove Saved Board)

**Trigger:** Select board from dropdown → Click "Delete" in Saved Boards section

**Behavior:**
- Shows confirmation: "Delete {board-name}?"
- User clicks OK → Board permanently deleted from storage
- User clicks Cancel → No change

**Special Case - Deleting Active Board:**
- If deleted board is currently loaded
- App resets to default-unsaved state
- User can then load another board or continue with default

**Use Cases:**
- Remove outdated boards
- Clean up duplicates
- Free storage space

**Logic:**
```
Select board → DELETE → Confirm → Remove from storage
  If deleted == active → Reset to default-unsaved
  If deleted != active → No state change
```

## UI Layout

### Dialog Organization

```
┌─────────────────────────────────────────┐
│ Board Management                     [×]│
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ CURRENT BOARD                       ││
│ │ My Board (unsaved)                  ││
│ │                                     ││
│ │  [ Add ]    [ Save ]                ││
│ │                                     ││
│ │ Add: Save current board with new    ││
│ │      name                           ││
│ │ Save: Save as new board             ││
│ └─────────────────────────────────────┘│
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ SAVED BOARDS                        ││
│ │                                     ││
│ │ [Board 1 - Feb 28, 2026 4:30 PM ▼] ││
│ │                                     ││
│ │  [ Load ]   [ Delete ]              ││
│ │                                     ││
│ │ Load: Switch to selected board      ││
│ │ Delete: Remove selected board       ││
│ └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

**Visual Grouping:**
- **Current Board section:** Green tint, ADD/SAVE buttons
- **Saved Boards section:** Blue tint, selector + LOAD/DELETE buttons
- **Clear separation:** Divider line, color coding, section titles

## State Flow Diagram

```
┌─────────────────┐
│ App Starts      │
└────────┬────────┘
         │
         v
  ┌─────────────┐
  │ Load Last   │
  │ Board?      │
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
    v         v
   Yes       No
    │         │
    │    ┌────v────┐
    │    │ Default │
    │    │ Unsaved │
    │    └─────────┘
    │
    v
┌──────────────┐
│ Load Saved   │
│ Board State  │
└──────────────┘
```

## Storage Architecture

### localStorage Structure

```javascript
// Metadata
'spatial-boards-meta': {
  lastOpenedBoardId: 'board-123' | null,
  boards: [
    { id: 'board-123', name: 'Work', lastModified: 1709149800000 },
    { id: 'board-456', name: 'Personal', lastModified: 1709149900000 }
  ]
}

// Individual boards
'spatial-board-board-123': {
  board: { id: 'board-123', name: 'Work', ... },
  viewport: { panX: 0, panY: 0, zoom: 1 },
  components: { ... },
  uploadedImages: { ... },
  lastModified: 1709149800000
}
```

### Key Design Decisions

1. **No "Default" in saved list:** Default is special unsaved state
2. **Unique IDs:** `board-{timestamp}-{random}` prevents collisions
3. **Database-ready:** Structure maps directly to future tables
4. **Metadata separate:** Quick board list without loading full data

## Store Methods (API)

### New Methods

```javascript
isCurrentBoardSaved()
// Returns: boolean
// Check if current board is saved (not default-unsaved)

generateBoardId()
// Returns: string (unique ID)
// Generate unique board ID for new boards

createNewBoard(boardName)
// Params: boardName (string)
// Returns: boolean (success)
// Save current state as new board with given name

saveCurrentBoard()
// Returns: boolean (success)
// Overwrite existing saved board (fails on default-unsaved)

resetToDefault()
// Returns: void
// Reset app to default-unsaved state

deleteBoard(boardId)
// Params: boardId (string)
// Returns: boolean (success)
// Delete board, reset to default if deleting active board
```

### Updated Methods

```javascript
getBoardsMetadata()
// Now returns empty boards array instead of default board

loadLastBoard()
// Now handles no saved boards gracefully (stays on default)

migrateOldFormat()
// Creates unique ID for migrated board instead of 'default-board'
```

## Workflow Examples

### Example 1: First Time User

1. App starts → Default unsaved board
2. User builds workspace
3. Clicks "Save" → Prompts for name
4. Enters "My Workspace" → Board saved
5. Refreshes page → "My Workspace" auto-loads

### Example 2: Creating Variants

1. User has "Main Layout" board loaded
2. Wants to try different arrangement
3. Clicks "Add" → Enters "Variant A"
4. Current state saved as "Variant A"
5. Makes changes, clicks "Save" → Updates "Variant A"
6. Clicks "Load" → Selects "Main Layout"
7. Back to original, "Variant A" preserved

### Example 3: Cleaning Up

1. User has 5 saved boards
2. "Old Test" is obsolete
3. Selects "Old Test" from dropdown
4. Clicks "Delete" → Confirms
5. Board removed from list
6. If it was active → Resets to default

### Example 4: Save vs Add

**Scenario A - Overwrite (SAVE):**
```
Board: "Dashboard" (saved) → Make changes → Click SAVE
Result: "Dashboard" updated with changes
```

**Scenario B - New Board (ADD):**
```
Board: "Dashboard" (saved) → Make changes → Click ADD
Prompt: "New Dashboard" → Result: Two boards exist:
  - "Dashboard" (original state)
  - "New Dashboard" (with changes)
```

## Error Handling

### Cannot Save Default
```javascript
// Default board + SAVE → Opens name prompt (same as ADD)
if (!isCurrentBoardSaved()) {
  // Prompt for name instead of failing
}
```

### Cannot Delete Default
```javascript
// Attempting to delete 'default-unsaved' fails silently
if (boardId === 'default-unsaved') return false;
```

### Delete Active Board
```javascript
// Deleting currently active board resets to default
if (currentBoard.id === boardIdToDelete) {
  resetToDefault();
}
```

### No Saved Boards
```javascript
// Shows message: "No saved boards yet. Click Add or Save to create one."
if (availableBoards.length === 0) {
  // Show empty state message
}
```

## Future Enhancements

### Short Term (Phase 2)
- Board search/filter
- Board rename (without duplicating)
- Board export/import (JSON)
- Board templates/presets
- Keyboard shortcuts (Ctrl+S to save)

### Medium Term (Phase 3)
- Board thumbnails/previews
- Board categories/tags
- Board sorting options
- Board duplication (explicit copy)
- Auto-save (periodic background save)

### Long Term (Multi-User)
- User authentication
- Database persistence
- Board sharing (read-only/edit)
- Real-time collaboration
- Version history
- Conflict resolution

## Testing Checklist

### ADD Operation
- [ ] ADD on default → prompts name → creates board
- [ ] ADD on saved board → prompts name → creates duplicate
- [ ] ADD with empty name → button disabled
- [ ] ADD with duplicate name → allowed (unique IDs)
- [ ] Cancel ADD → no changes

### SAVE Operation
- [ ] SAVE on default → prompts name (like ADD)
- [ ] SAVE on saved board → overwrites silently
- [ ] Timestamp updates after save
- [ ] Board list refreshes after save

### LOAD Operation
- [ ] LOAD switches board state
- [ ] LOAD updates active board
- [ ] LOAD with no boards → selector disabled
- [ ] LOAD same board → reloads (discards unsaved)
- [ ] Dialog closes after successful load

### DELETE Operation
- [ ] DELETE removes board from list
- [ ] DELETE confirmation required
- [ ] DELETE cancel → no change
- [ ] DELETE active board → resets to default
- [ ] DELETE last board → empty list + default state
- [ ] Cannot DELETE default-unsaved

### Persistence
- [ ] Boards survive page refresh
- [ ] Last board auto-loads on startup
- [ ] No saved boards → default on startup
- [ ] Migration from old format works

### Edge Cases
- [ ] Empty board name rejected
- [ ] Very long board names handled
- [ ] Special characters in names
- [ ] localStorage quota exceeded
- [ ] Corrupted board data
- [ ] Rapid ADD/SAVE clicks

## Known Limitations

1. **No undo after LOAD:** Loading discards unsaved changes
2. **No board rename:** Must ADD as new + DELETE old
3. **No auto-save:** User must manually save
4. **No version history:** Only latest save kept
5. **localStorage only:** No cloud sync yet

---

**Status:** ✅ Complete  
**Phase:** 1E Enhanced  
**Last Updated:** February 28, 2026
