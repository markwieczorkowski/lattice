/**
 * Clock Engine
 *
 * High-accuracy, monotonic time reference for the application.
 * Uses performance.now() as the primary timebase for drift-free measurement,
 * aligned to wall-clock time via Date.now() at initialization.
 *
 * A single requestAnimationFrame loop drives all timing in the app.
 * Components and the scheduler subscribe via onTick() to receive updates
 * on every animation frame, ensuring smooth, jitter-free rendering.
 *
 * Design follows: /docs/frontend_clock_scheduler_architecture_production_grade.md
 */

let baseWallTime = Date.now();
let baseMonotonic = performance.now();
let lastResync = baseMonotonic;

// Resync wall-clock baseline every 30 seconds to correct floating-point drift
const RESYNC_INTERVAL_MS = 30_000;

/**
 * Returns the current wall-clock time in milliseconds.
 * Monotonic: immune to system clock jumps, NTP corrections, or event-loop stalls.
 */
export function now() {
  return baseWallTime + (performance.now() - baseMonotonic);
}

/**
 * Resynchronizes baseline with the system clock.
 * Corrects accumulated floating-point drift without introducing discontinuities
 * larger than the natural drift itself.
 */
function resync() {
  baseWallTime = Date.now();
  baseMonotonic = performance.now();
}

// Set of functions called on every rAF tick, receives current time in ms
const tickListeners = new Set();

/**
 * Register a callback invoked on every animation frame tick.
 * Returns an unsubscribe function for cleanup.
 *
 * @param {function(number): void} fn - Called with current wall time in ms
 * @returns {function(): void} unsubscribe
 */
export function onTick(fn) {
  tickListeners.add(fn);
  return () => tickListeners.delete(fn);
}

let rafId = null;
let isRunning = false;

function tick() {
  const mono = performance.now();

  if (mono - lastResync >= RESYNC_INTERVAL_MS) {
    resync();
    lastResync = mono;
  }

  const currentTime = now();
  for (const listener of tickListeners) {
    listener(currentTime);
  }

  rafId = requestAnimationFrame(tick);
}

/**
 * Start the rAF clock loop. Safe to call multiple times — starts only once.
 * Should be called once from the application root (App.jsx) on mount.
 */
export function startClockEngine() {
  if (!isRunning) {
    isRunning = true;
    rafId = requestAnimationFrame(tick);
  }
}

/**
 * Stop the clock loop. Intended for cleanup in tests or hot module reload.
 */
export function stopClockEngine() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
    isRunning = false;
  }
}
