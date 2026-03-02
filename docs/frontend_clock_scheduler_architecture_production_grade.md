# Frontend Clock + Scheduler Architecture (Production-Grade)

**Purpose:**  
Define a robust, high-accuracy, low-drift clock and scheduling architecture for React-based real-time UIs (Visual Workboard, Spatial UI, and Trading Cockpit), with clean extensibility toward a Go-based backend time authority.

---

## Design Goals

This architecture is designed to:

- Provide **high-precision timekeeping** for UI clocks, timers, alarms, reminders, and recurring tasks.
- Eliminate **event-loop drift** and **timer jitter**.
- Avoid **timer explosion** from excessive `setTimeout` / `setInterval` usage.
- Maintain **smooth rendering performance** under heavy UI workloads.
- Cleanly support **future backend time synchronization** using a Go-based NTP-like service.

---

## Core Design Principles

### 1. Separate Timekeeping from Display

- **Timekeeping:** Maintain an accurate, monotonic notion of time.
- **Display:** Render time visually in a smooth, jitter-free way.

These are distinct problems and should be handled independently.

---

### 2. Use Monotonic Time as the Primary Clock

- Use `performance.now()` as the primary timebase.
- Use `Date.now()` only for wall-clock alignment.

This eliminates:

- Drift caused by event-loop delays
- Clock jumps caused by NTP or system time corrections

---

### 3. Centralized Scheduling

Instead of each component creating its own timers:

- All timers, alarms, reminders, and recurring tasks register with a **single scheduler**.
- The scheduler is driven by a single **requestAnimationFrame loop**.

This ensures:

- Predictable execution order
- Minimal overhead
- Consistent timing behavior

---

### 4. Backend as Time Authority (Optional, Later)

- The frontend clock should support **periodic time synchronization** with a backend Go service.
- Backend integration should require **no architectural changes** to frontend components.

---

# High-Level Architecture

```
┌───────────────────────────────┐
│   Go Backend (Optional)       │
│   - Authoritative Clock       │
│   - Trade Scheduling          │
│   - Session Timing            │
└─────────────┬─────────────────┘
              │  periodic sync
              ▼
┌───────────────────────────────┐
│ Frontend Clock Engine         │
│ - Monotonic Time Base         │
│ - Wall Time Offset            │
│ - Optional Backend Sync       │
└─────────────┬─────────────────┘
              ▼
┌───────────────────────────────┐
│ Central Scheduler             │
│ - Timers                      │
│ - Alarms                      │
│ - Reminders                   │
│ - Recurring Tasks             │
└─────────────┬─────────────────┘
              ▼
┌───────────────────────────────┐
│ UI Components                 │
│ - Clock widgets               │
│ - Countdown timers            │
│ - Task boards                 │
│ - Trading dashboards          │
└───────────────────────────────┘
```

---

# Clock Engine Design

## Core Concept

The clock engine maintains a continuously running, monotonic time reference that is immune to:

- Event loop stalls
- Frame drops
- Timer drift
- System clock jumps

---

## Time Model

### Baseline Capture

At initialization:

```js
let baseWallTime = Date.now();
let baseMonotonic = performance.now();
```

### Current Time Computation

```js
function now() {
  return baseWallTime + (performance.now() - baseMonotonic);
}
```

This provides:

- Monotonic progression
- Wall-clock alignment
- No drift accumulation

---

## Periodic Drift Correction

Every ~30–60 seconds:

```js
function resync() {
  const wall = Date.now();
  const mono = performance.now();

  baseWallTime = wall;
  baseMonotonic = mono;
}
```

This corrects:

- Small floating point drift
- System-level time adjustments

---

## Backend Time Sync (Optional)

Later, `resync()` can be replaced or augmented with backend synchronization:

```text
Client mono t0 → request
Server time Ts → response
Client mono t1

latency ≈ (t1 - t0)/2
offset = Ts + latency - t1
```

Then:

```js
now() = performance.now() + offset
```

This allows:

- Sub-5ms synchronization accuracy
- Multi-client time alignment
- Trading-safe timestamps

---

# requestAnimationFrame (rAF) Scheduling Loop

## Why rAF

- rAF runs once per display refresh (~60–144 Hz)
- Executes before browser repaint
- Synchronizes timing with rendering

This ensures:

- Minimal visual jitter
- No unnecessary CPU wakeups
- Zero timer drift

---

## Global Time Loop

```js
function timeLoop() {
  clock.tick();
  scheduler.tick();
  requestAnimationFrame(timeLoop);
}

timeLoop();
```

This is the **single heartbeat** of the entire timing system.

---

# Central Scheduler Design

## Scheduler Responsibilities

- Manage all timed events
- Trigger callbacks precisely
- Support:
  - One-shot timers
  - Repeating timers
  - Cron-like schedules
  - Alarms
  - Reminders

---

## Event Model

```ts
interface ScheduledEvent {
  time: number;       // absolute timestamp (ms)
  callback: () => void;
  repeat?: number;   // ms interval for repeating tasks
  id: string;
}
```

---

## Data Structure

Use a **priority queue / binary heap**, sorted by execution time.

This ensures:

- O(log N) insertion
- O(log N) removal
- Minimal scanning overhead

---

## Scheduler Core Loop

```js
class Scheduler {
  queue = new MinHeap();

  add(event) {
    this.queue.push(event);
  }

  tick() {
    const t = now();

    while (this.queue.peek()?.time <= t) {
      const ev = this.queue.pop();
      ev.callback();

      if (ev.repeat) {
        ev.time += ev.repeat;
        this.queue.push(ev);
      }
    }
  }
}
```

---

# Component-Level APIs

## Clock Display Component

```js
function useClock() {
  const [time, setTime] = useState(now());

  useEffect(() => {
    const id = scheduler.addRepeating(1000, () => {
      setTime(now());
    });

    return () => scheduler.remove(id);
  }, []);

  return time;
}
```

---

## Timer API

```js
const timerId = scheduler.add({
  time: now() + 5_000,
  callback: () => console.log("Timer fired")
});
```

---

## Repeating Task API

```js
scheduler.add({
  time: now() + 60_000,
  repeat: 60_000,
  callback: refreshTasks
});
```

---

## Alarm API

```js
scheduler.add({
  time: alarmTimestamp,
  callback: triggerAlarm
});
```

---

# Recurring To-Do Scheduling

Recurring tasks can be implemented via:

- Fixed intervals
- Cron-like rules

Example cron adapter:

```js
function scheduleCron(rule, callback) {
  const next = cronParser.next(rule);
  scheduler.add({
    time: next,
    callback: () => {
      callback();
      scheduleCron(rule, callback);
    }
  });
}
```

---

# Performance Characteristics

| Metric | Expected Result |
|-----------|------------------|
| Timer resolution | ~0.1 ms (internal) |
| UI refresh jitter | < 16 ms |
| Timer accuracy | ±5–10 ms |
| Event throughput | 10k+ timers |
| CPU overhead | negligible |

---

# Integration with Go Backend

## Backend Responsibilities

- Maintain authoritative time
- Provide NTP-style synchronization
- Manage:
  - Trading session boundaries
  - Trade execution timing
  - Multi-client event scheduling

---

## WebSocket Time Sync Protocol

```text
Client → TIME_REQUEST
Server → SERVER_TIMESTAMP
```

Frontend estimates latency and adjusts offset.

---

## Event Sync Model

Backend can push:

```json
{
  "type": "schedule",
  "time": 1700000000000,
  "action": "EXECUTE_TRADE"
}
```

Frontend registers this with scheduler.

---

# Why This Architecture Scales

| Use Case | Supported |
|-------------|-------------|
| Productivity UI | ✅ |
| Visual dashboards | ✅ |
| Trading cockpits | ✅ |
| Multi-device sync | ✅ |
| Deterministic scheduling | ✅ |
| Distributed execution | ✅ |

---

# Key Design Insight

> **Never count time. Always measure it.**

Counting via `setInterval` accumulates drift.  
Measuring via monotonic clocks guarantees correctness.

---

# Implementation Roadmap

## Phase 1 – Frontend Only

- Clock engine
- Scheduler
- UI clock component
- Timer + alarm APIs

## Phase 2 – Backend Sync

- Go time service
- WebSocket sync
- Offset correction

## Phase 3 – Trading Integration

- Trade execution timers
- Session scheduling
- Multi-client synchronization

---

# Summary

This architecture gives you:

- Professional-grade timing accuracy
- Smooth UI performance
- Clean extensibility
- Trading-ready synchronization

Without prematurely forcing backend complexity.

---

**This model mirrors how game engines, real-time trading dashboards, and simulation systems manage time.**

It is robust, battle-tested, and scales cleanly from productivity apps to professional trading platforms.

