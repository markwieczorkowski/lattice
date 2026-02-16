/**
 * Component Type Registry
 * 
 * Defines all available component types with their default properties.
 * Each component type specifies default grid dimensions (in grid units).
 */

export const COMPONENT_TYPES = {
  test: {
    id: 'test',
    name: 'Test Component',
    defaultWidth: 4,  // 4 grid squares = 120px
    defaultHeight: 4, // 4 grid squares = 120px
    minWidth: 2,      // Minimum 2 squares
    minHeight: 2,     // Minimum 2 squares
  },
  // Future component types will be added here
};

/**
 * Get component type configuration
 */
export const getComponentType = (typeId) => {
  return COMPONENT_TYPES[typeId] || null;
};

/**
 * Get all available component types as array
 */
export const getAvailableComponentTypes = () => {
  return Object.values(COMPONENT_TYPES);
};

/**
 * Generate unique component ID
 */
export const generateComponentId = () => {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
