import React from 'react';
import useBoardStore from '../../../stores/useBoardStore';
import { US_TIMEZONES, CLOCK_FONTS, DEFAULT_CLOCK_FONT } from './ClockComponent';
import './ClockComponentConfig.css';

/**
 * ClockComponentConfig
 *
 * Configuration panel rendered inside the Configure dialog for ClockComponent.
 * All changes apply immediately (live preview).
 *
 * Settings:
 *   - Background color and opacity
 *   - Text/accent color
 *   - Clock title (optional label shown above the time)
 *   - Show seconds toggle
 *   - 12-hour vs 24-hour format
 *   - Timezone (US timezones + local)
 */
const ClockComponentConfig = ({ componentId }) => {
  const { components, updateComponent } = useBoardStore();
  const component = components[componentId];

  if (!component) return null;

  const bgColor   = component.style?.backgroundColor   || '#404040';
  const bgOpacity = component.style?.backgroundOpacity  ?? 0.85;
  const textColor = component.style?.textColor          || '#ffffff';

  const title       = component.content?.title       !== undefined ? component.content.title : '';
  const showSeconds = component.content?.showSeconds ?? true;
  const use24Hour   = component.content?.use24Hour   ?? false;
  const timezone    = component.content?.timezone    || 'local';
  const fontFamily  = component.content?.fontFamily  || DEFAULT_CLOCK_FONT;

  const updateStyle   = (patch) => updateComponent(componentId, { style:   { ...component.style,   ...patch } });
  const updateContent = (patch) => updateComponent(componentId, { content: { ...component.content, ...patch } });

  const stopProp = (e) => e.stopPropagation();

  return (
    <div
      className="clock-component-config"
      onMouseDown={stopProp}
      onClick={stopProp}
    >
      {/* ── Appearance ─────────────────────────────────────────── */}
      <div className="clock-config-section">
        <label className="clock-config-label">Background Color</label>
        <div className="clock-config-color-row">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="clock-color-picker"
          />
          <span className="clock-color-value">{bgColor}</span>
        </div>
      </div>

      <div className="clock-config-section">
        <label className="clock-config-label">
          Background Opacity
          <span className="clock-config-value">{Math.round(bgOpacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={bgOpacity}
          onChange={(e) => updateStyle({ backgroundOpacity: parseFloat(e.target.value) })}
          className="clock-opacity-slider"
        />
      </div>

      <div className="clock-config-section">
        <label className="clock-config-label">Text / Accent Color</label>
        <div className="clock-config-color-row">
          <input
            type="color"
            value={textColor}
            onChange={(e) => updateStyle({ textColor: e.target.value })}
            className="clock-color-picker"
          />
          <span className="clock-color-value">{textColor}</span>
        </div>
      </div>

      {/* ── Font ───────────────────────────────────────────────── */}
      <div className="clock-config-section">
        <label className="clock-config-label">Clock Font</label>
        <div className="clock-font-grid">
          {CLOCK_FONTS.map((font) => (
            <button
              key={font.value}
              className={`clock-font-card${fontFamily === font.value ? ' active' : ''}`}
              onClick={() => updateContent({ fontFamily: font.value })}
              title={font.label}
            >
              <span className="clock-font-preview" style={{ fontFamily: font.value }}>
                12:34
              </span>
              <span className="clock-font-name">{font.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Display ────────────────────────────────────────────── */}
      <div className="clock-config-section">
        <label className="clock-config-label">Clock Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => updateContent({ title: e.target.value })}
          className="clock-text-input"
          placeholder="Optional label (leave blank to hide)"
          maxLength={40}
        />
      </div>

      {/* ── Time Format ────────────────────────────────────────── */}
      <div className="clock-config-section">
        <label className="clock-config-label">Time Format</label>
        <div className="clock-toggle-group">
          <button
            className={`clock-toggle-btn${!use24Hour ? ' active' : ''}`}
            onClick={() => updateContent({ use24Hour: false })}
          >
            12-Hour
          </button>
          <button
            className={`clock-toggle-btn${use24Hour ? ' active' : ''}`}
            onClick={() => updateContent({ use24Hour: true })}
          >
            24-Hour
          </button>
        </div>
      </div>

      <div className="clock-config-section">
        <label className="clock-config-label">
          Show Seconds
        </label>
        <label className="clock-switch-label">
          <div
            className={`clock-switch${showSeconds ? ' on' : ''}`}
            onClick={() => updateContent({ showSeconds: !showSeconds })}
            role="switch"
            aria-checked={showSeconds}
          >
            <div className="clock-switch-thumb" />
          </div>
          <span className="clock-switch-text">{showSeconds ? 'Visible' : 'Hidden'}</span>
        </label>
      </div>

      {/* ── Timezone ───────────────────────────────────────────── */}
      <div className="clock-config-section">
        <label className="clock-config-label">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => updateContent({ timezone: e.target.value })}
          className="clock-select"
        >
          {US_TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClockComponentConfig;
