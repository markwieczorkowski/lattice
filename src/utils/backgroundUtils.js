/**
 * Background Utilities
 * 
 * Helper functions for board background management
 */

/**
 * Migrate old background format to new format
 * Old: board.background = '#808080'
 * New: board.background = { type, solidColor, ... }
 */
export const migrateBackgroundFormat = (background) => {
  // If already new format
  if (typeof background === 'object' && background.type) {
    return background;
  }

  // If old format (string color)
  if (typeof background === 'string') {
    return {
      type: 'solid',
      solidColor: background,
      gradientColors: [background, '#606060'],
      gradientDirection: 'vertical',
      imageUrl: null,
      imageName: null,
    };
  }

  // Default fallback
  return {
    type: 'solid',
    solidColor: '#808080',
    gradientColors: ['#808080', '#606060'],
    gradientDirection: 'vertical',
    imageUrl: null,
    imageName: null,
  };
};

/**
 * Generate CSS background value from board background config
 */
export const generateBackgroundCSS = (background) => {
  const bg = migrateBackgroundFormat(background);

  switch (bg.type) {
    case 'solid':
      return bg.solidColor;

    case 'gradient': {
      const [color1, color2] = bg.gradientColors;
      let direction;
      switch (bg.gradientDirection) {
        case 'horizontal':
          direction = 'to right';
          break;
        case 'vertical':
          direction = 'to bottom';
          break;
        case 'diagonal':
          direction = 'to bottom right';
          break;
        default:
          direction = 'to bottom';
      }
      return `linear-gradient(${direction}, ${color1}, ${color2})`;
    }

    case 'image':
      return bg.imageUrl ? `url(${bg.imageUrl})` : bg.solidColor;

    default:
      return bg.solidColor;
  }
};
