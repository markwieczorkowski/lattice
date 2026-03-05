import React from 'react';
import { useSecondClock } from '../../../hooks/useSecondClock';
import './ClockComponent.css';

/**
 * Web-safe font options for the clock display.
 * All entries use cross-browser-safe font stacks.
 * Exported so the config component can share the same list.
 */
export const CLOCK_FONTS = [
  {
    value: "'Courier New', Courier, monospace",
    label: 'Courier New',
  },
  {
    value: "Georgia, 'Times New Roman', serif",
    label: 'Georgia',
  },
  {
    value: "Arial, Helvetica, sans-serif",
    label: 'Arial',
  },
  
];

/** Default font stack used when no font is configured. */
export const DEFAULT_CLOCK_FONT = CLOCK_FONTS[0].value;

/**
 * US timezone options available in the clock config.
 * Exported so the config component can share the same list.
 */
export const US_TIMEZONES = [
  { value: 'local',                label: 'Local Time' },
  { value: 'America/New_York',     label: 'Eastern (ET)' },
  { value: 'America/Chicago',      label: 'Central (CT)' },
  { value: 'America/Denver',       label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles',  label: 'Pacific (PT)' },
  { value: 'America/Anchorage',    label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu',     label: 'Hawaii (HT)' },
  { value: 'America/Phoenix',      label: 'Arizona (No DST)' },
];

/**
 * Format a timestamp as a clock string using Intl.DateTimeFormat.
 *
 * @param {number} timestamp - Wall time in ms (from clock engine's now())
 * @param {object} opts
 * @param {boolean} opts.use24Hour  - Use 24-hour format (0-23) vs 12-hour (1-12 AM/PM)
 * @param {boolean} opts.showSeconds - Include seconds in display
 * @param {string}  opts.timezone  - IANA timezone or 'local'
 * @returns {string} Formatted time string
 */
function formatTime(timestamp, { use24Hour = false, showSeconds = true, timezone = 'local' }) {
  const date = new Date(timestamp);

  const options = {
    hour: use24Hour ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
    ...(showSeconds && { second: '2-digit' }),
    ...(timezone !== 'local' && { timeZone: timezone }),
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Convert a hex color string to rgba().
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * ClockComponent
 *
 * Displays a digital clock driven by the application's central clock engine.
 * Re-renders only when the second boundary is crossed, as detected by the
 * rAF tick loop — frame-perfect sync with the system clock, zero drift.
 *
 * Props:
 *   id       {string} - Component identifier (unused visually, kept for consistency)
 *   style    {object} - Visual style overrides (backgroundColor, backgroundOpacity, textColor)
 *   content  {object} - Clock settings (title, showSeconds, use24Hour, timezone)
 */
const ClockComponent = ({ id, style = {}, content = {} }) => {
  const backgroundColor   = style.backgroundColor   || '#404040';
  const backgroundOpacity = style.backgroundOpacity  ?? 0.85;
  const textColor         = style.textColor          || '#ffffff';

  const title       = content.title       || '';
  const showSeconds = content.showSeconds ?? true;
  const use24Hour   = content.use24Hour   ?? false;
  const timezone    = content.timezone    || 'local';
  const fontFamily  = content.fontFamily  || DEFAULT_CLOCK_FONT;

  const currentTime = useSecondClock();

  const timeString = formatTime(currentTime, { use24Hour, showSeconds, timezone });

  return (
    <div
      className="clock-component"
      style={{
        backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
        borderColor: `${textColor}55`,
      }}
    >
      {title && (
        <div className="clock-title" style={{ color: textColor }}>
          {title}
        </div>
      )}
      <div className="clock-display" style={{ color: textColor, fontFamily }}>
        {timeString}
      </div>
    </div>
  );
};

export default ClockComponent;
