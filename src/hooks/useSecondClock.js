import { useEffect, useRef, useState } from 'react';
import { now, onTick } from '../services/clockEngine';

/**
 * useSecondClock
 *
 * Returns the current wall-clock time (ms), updating on every second boundary
 * as detected by the rAF-driven clock engine tick loop.
 *
 * Instead of firing on a fixed 1000ms interval from an arbitrary start point,
 * this hook checks the second value on every animation frame and triggers a
 * re-render the moment the second actually changes. This keeps the displayed
 * time frame-perfectly in sync with the real system clock rollover.
 *
 * Any number of components can call this hook simultaneously — they all share
 * the single underlying rAF loop via the clock engine's onTick registry, with
 * no additional timer overhead per instance.
 *
 * @returns {number} Current wall time in milliseconds
 */
export function useSecondClock() {
  const [time, setTime] = useState(() => now());
  const lastSecondRef = useRef(Math.floor(now() / 1000));

  useEffect(() => {
    const unsubscribe = onTick((t) => {
      const currentSecond = Math.floor(t / 1000);

      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        setTime(t);
      }
    });

    return unsubscribe;
  }, []);

  return time;
}
