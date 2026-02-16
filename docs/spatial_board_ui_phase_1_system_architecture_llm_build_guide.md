# Spatial Board UI – Phase 1 System Architecture & LLM Build Guide

**Purpose:**  
This document defines the full system architecture, interaction model, state design, and phased development plan for a spatial, board-based UI framework built with React and `react-grid-layout` (RGL). It is designed to be used as a **source-of-truth specification** for both human developers and AI-based coding assistants (Cursor, Copilot, GPT-based IDEs).

This framework is the foundation for a highly flexible, component-based workspace that supports spatial organization, panning, layout manipulation, and extensible component types.

---

# 1. High-Level Concept

The system is a **spatial UI framework** consisting of:

- A **board** that acts as a bounded 2D workspace.
- A **grid-based layout system** where all components snap to discrete grid units.
- **Draggable and resizable components** placed on the board.
- A **pannable viewport** allowing navigation of a board larger than the visible screen.
- Modular, extensible **component types** implemented as React components.

This architecture prioritizes:

- High interactivity
- Visual spatial memory
- Predictable layout behavior
- Modular extensibility
- Performance

---

# 2. Architectural Overview

```
+--------------------------------------------------+
| Viewport (Browser Window)                        |
|                                                  |
|   +------------------------------------------+   |
|   | Board (Fixed Size, Transformed via Pan) |   |
|   |                                          |   |
|   |   +----------------------------------+   |   |
|   |   | react-grid-layout Container      |   |   |
|   |   |                                  |   |   |
|   |   |   +--------------------------+   |   |   |
|   |   |   | Component Tile           |   |   |   |
|   |   |   +--------------------------+   |   |   |
|   |   |                                  |   |   |
|   |   +----------------------------------+   |   |
|   +------------------------------------------+   |
+--------------------------------------------------+
```

---

# 3. Core Technology Stack

## 3.1 Frontend Framework

- **React** (JavaScript)
- Functional components
- Hooks-based architecture

## 3.2 Layout Engine

- **react-grid-layout (RGL)**

Provides:
- Grid snapping
- Drag-and-drop movement
- Resize handles
- Collision detection
- Overlap modes
- Bump / compaction behavior

## 3.3 State Management

- **Zustand**

Used for:
- Board state
- Viewport pan state
- Global UI state
- Component registry

## 3.4 Persistence

Phase 1:
- `localStorage`

Later phases:
- Backend database (Postgres or similar)

---

# 4. Board System

## 4.1 Board Definition

A **Board** is a bounded 2D workspace larger than the visible viewport.

### Initial Board Parameters

- Width: ~2560px
- Height: ~2048px
- Grid column width: 30px
- Grid row height: 30px

Board size is configurable but initially bounded.

---

## 4.2 Board Background

User-configurable board background:

- Solid color
- (Future) Uploaded image
- (Future) Center / Tile / Stretch modes

Default background: neutral gray

---

## 4.3 Board Panning

### Behavior

- Click + drag on **empty board space** pans the board
- Click + drag on **component** moves component (handled by RGL)

### Implementation

- Fixed viewport
- Board translated using CSS transforms

```
transform: translate(panX, panY)
```

### State

```js
{
  panX: number,
  panY: number
}
```

### Event Routing Priority

1. Resize handle → resize
2. Component body → move
3. Empty space → pan

---

# 5. Grid System

## 5.1 Invisible Grid

The grid is **logical only** (not visually rendered).

### Purpose

- Enforce discrete movement
- Predictable snapping
- Consistent layout math

### Grid Size

- Default: 30px

Component sizes expressed as:

```
width  = columns * colWidth
height = rows    * rowHeight
```

---

# 6. Component System

## 6.1 Component Tiles

All components exist as **tiles** inside react-grid-layout.

### Core Properties

- x, y (grid coordinates)
- w, h (grid dimensions)
- type
- content
- style

---

## 6.2 Component Interaction Rules

| Action | Behavior |
|----------|----------|
| Drag component | Move component (snap to grid) |
| Drag resize handle | Resize component |
| Click empty board | Pan board |
| Click menu icon | Open component menu |

---

## 6.3 Component Menu

Each component has a small menu icon in the top-right corner.

### Menu Options (Phase 1)

- Delete
- Background color
- Background opacity
- Text color

### Future

- Duplicate
- Export
- Advanced properties

---

# 7. Component Creation Model

## 7.1 Creation Flow

1. User clicks **Add Component** button
2. User selects component type
3. Component spawns at default size
4. Component appears near center of viewport

---

## 7.2 Default Component Sizes

Each component type defines:

```js
{
  defaultWidth: number,
  defaultHeight: number
}
```

---

# 8. Component Behavior Modes

User-selectable board-level layout behavior:

## 8.1 Overlap Mode

- Components allowed to overlap

RGL:
```js
allowOverlap = true
preventCollision = false
```

---

## 8.2 No Overlap Mode

- Components cannot overlap

RGL:
```js
allowOverlap = false
preventCollision = true
```

---

## 8.3 Bump Mode

- Components push each other to make space

RGL:
```js
compactType = 'vertical' | 'horizontal'
```

---

# 9. Viewport System

## 9.1 Fixed Viewport

- Viewport matches browser window
- Board is translated inside viewport

## 9.2 Zoom (Scaffolding Only)

Zoom support is architecturally prepared but **not exposed in Phase 1 UI**.

### Internal State

```js
zoom: number
```

Zoom may later scale:

```css
transform: translate(x, y) scale(zoom)
```

---

# 10. State Architecture

## 10.1 Zustand Store Structure

```js
{
  board: {
    id,
    name,
    width,
    height,
    background,
    overlapMode
  },

  viewport: {
    panX,
    panY,
    zoom
  },

  components: {
    [id]: {
      id,
      type,
      layout,
      style,
      content
    }
  }
}
```

---

# 11. Persistence Model

## 11.1 Phase 1 Persistence

- localStorage

### Save:

- Board config
- Layout
- Component data
- Viewport pan

---

## 11.2 Future Database Schema

### USERS

```
id
username
password_hash
preferences
```

### BOARDS

```
id
user_id
name
width
height
background
overlap_mode
```

### COMPONENTS

```
id
board_id
type
x
y
w
h
style
content
```

---

# 12. Performance Strategy

## 12.1 Rendering

- RGL handles memoization of children
- React memo for component internals

## 12.2 Virtualization

Not implemented in Phase 1.

Future strategies:

- Region chunking
- Viewport-based component culling

---

# 13. Phase 1 Development Plan

## Phase 1A — Core Board Infrastructure

- Fixed viewport
- Board container
- CSS transform panning
- Zustand store

---

## Phase 1B — react-grid-layout Integration

- Tile placement
- Drag
- Resize
- Collision behavior

---

## Phase 1C — Component Framework

- Base component wrapper
- Menu UI
- Style controls
- Delete

---

## Phase 1D — Board Settings Panel

- Board name
- Board size
- Background
- Overlap mode

---

## Phase 1E — Persistence

- Save/load from localStorage

---

# 14. Coding Guidance for LLM Agents

## Principles

- Favor clarity over cleverness
- Isolate board logic from component logic
- Avoid deep nesting
- Prefer pure functions

## Coding Priorities

1. Board + pan math
2. RGL integration
3. Component wrapper
4. Menu system
5. Persistence

---

# 15. Long-Term Extension Plan

- Multi-board support
- User accounts
- Cloud sync
- Collaboration
- Embedded drawing (Konva inside components)
- API widgets
- Real-time data components

---

# End of Architecture Specification

