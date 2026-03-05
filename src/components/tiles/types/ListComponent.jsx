import React from 'react';
import './ListComponent.css';

/**
 * Available bullet characters for the list component.
 * Exported so the config panel can share the same list.
 */
export const BULLET_CHARS = [
  { value: '•', label: 'Bullet'   },
  { value: '◦', label: 'Circle'   },
  { value: '▪', label: 'Square'   },
  { value: '▸', label: 'Triangle' },
  { value: '–', label: 'Dash'     },
  { value: '›', label: 'Chevron'  },
  { value: '★', label: 'Star'     },
  { value: '✓', label: 'Check'    },
  { value: '→', label: 'Arrow'    },
  { value: '◆', label: 'Diamond'  },
];

export const DEFAULT_BULLET_CHAR = '•';

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
 * ListComponent
 *
 * Displays a titled, scrollable list of text items on the board.
 * Supports bullet, numbered, and unmarked list styles.
 * Text scales with the component's horizontal dimension via CSS container queries.
 * If the list exceeds the component's vertical space, it becomes scrollable.
 *
 * Props:
 *   id       {string} - Component identifier
 *   style    {object} - Visual overrides (backgroundColor, backgroundOpacity, textColor)
 *   content  {object} - List data (title, titleAlign, listStyle, items)
 */
const ListComponent = ({ id, style = {}, content = {} }) => {
  const backgroundColor   = style.backgroundColor   || '#404040';
  const backgroundOpacity = style.backgroundOpacity  ?? 0.5;
  const textColor         = style.textColor          || '#ffffff';

  const title       = content.title       || '';
  const titleAlign  = content.titleAlign  || 'left';
  const listStyle   = content.listStyle   || 'bullet';
  const bulletChar  = content.bulletChar  || DEFAULT_BULLET_CHAR;
  const items       = content.items       || [];

  /**
   * Render the marker span for each list item.
   * Using JSX markers + flexbox instead of native CSS list markers eliminates
   * the need for em-based padding-left on the <ul>, which was the source of
   * inconsistent indentation across font sizes.
   */
  const renderMarker = (idx) => {
    if (listStyle === 'numbered') {
      return (
        <span className="list-item-marker list-item-marker--numbered">
          {idx + 1}.
        </span>
      );
    }
    if (listStyle === 'bullet') {
      return (
        <span className="list-item-marker list-item-marker--bullet">
          {bulletChar}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className="list-component"
      style={{
        backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
        borderColor: `${textColor}33`,
        color: textColor,
      }}
    >
      {title && (
        <h2
          className="list-component-title"
          style={{ color: textColor, textAlign: titleAlign }}
        >
          {title}
        </h2>
      )}

      <div className="list-component-scroll">
        {items.length > 0 ? (
          <ul className="list-component-list">
            {items.map((item, idx) => (
              <li key={item.id} className="list-component-item" style={{ color: textColor }}>
                {renderMarker(idx)}
                <span className="list-item-text">{item.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="list-component-empty" style={{ color: `${textColor}55` }}>
            No items yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ListComponent;
