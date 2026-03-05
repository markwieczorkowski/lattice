/**
 * Central Scheduler
 *
 * Manages all repeating and one-shot timed callbacks for the application.
 * Driven by the clock engine's rAF tick loop — no separate timers are created.
 *
 * All components needing timed updates (clocks, countdowns, reminders, alarms)
 * register with this scheduler instead of using setInterval/setTimeout directly.
 * This keeps the entire timing system on a single heartbeat with zero drift.
 *
 * Design follows: /docs/frontend_clock_scheduler_architecture_production_grade.md
 */

import { now, onTick } from './clockEngine';

let nextTaskId = 1;

/**
 * @typedef {Object} ScheduledTask
 * @property {number} intervalMs  - Milliseconds between fires (repeating tasks)
 * @property {number} nextFire    - Absolute timestamp (ms) of next execution
 * @property {function(number): void} callback - Invoked with current time
 * @property {boolean} repeat     - Whether this task repeats
 */

/** @type {Map<string, ScheduledTask>} */
const tasks = new Map();

/**
 * Called on every clock engine tick.
 * Fires any tasks whose scheduled time has arrived, then reschedules repeating ones.
 *
 * @param {number} currentTime - Current wall time from clock engine (ms)
 */
function schedulerTick(currentTime) {
  for (const [id, task] of tasks) {
    if (currentTime >= task.nextFire) {
      task.callback(currentTime);

      if (task.repeat) {
        // Advance by one interval, skipping any missed fires
        task.nextFire += task.intervalMs;
        while (task.nextFire <= currentTime) {
          task.nextFire += task.intervalMs;
        }
      } else {
        tasks.delete(id);
      }
    }
  }
}

// Register with the clock engine at module load time.
// The clock engine will not start firing until startClockEngine() is called from App.
onTick(schedulerTick);

/**
 * Schedule a callback to fire repeatedly at a fixed interval.
 *
 * @param {number} intervalMs - Milliseconds between invocations
 * @param {function(number): void} callback - Called with current time on each fire
 * @returns {string} taskId — pass to cancelTask() to unregister
 */
export function scheduleRepeating(intervalMs, callback) {
  const id = `sched-${nextTaskId++}`;
  tasks.set(id, {
    intervalMs,
    nextFire: now() + intervalMs,
    callback,
    repeat: true,
  });
  return id;
}

/**
 * Schedule a one-shot callback to fire at a specific absolute time.
 *
 * @param {number} fireAtMs - Absolute timestamp (from now()) to fire at
 * @param {function(number): void} callback - Called once when time arrives
 * @returns {string} taskId — pass to cancelTask() to unregister before firing
 */
export function scheduleAt(fireAtMs, callback) {
  const id = `sched-${nextTaskId++}`;
  tasks.set(id, {
    intervalMs: 0,
    nextFire: fireAtMs,
    callback,
    repeat: false,
  });
  return id;
}

/**
 * Cancel a scheduled task before it fires (or stop a repeating task).
 *
 * @param {string} taskId - ID returned by scheduleRepeating or scheduleAt
 */
export function cancelTask(taskId) {
  tasks.delete(taskId);
}
