import cloneDeep from 'lodash.clonedeep'

/**
 * Merge overrides with a baseStyle or other overrides
 *
 * paint and layout overrides do not fully overwrite paint and layout values in
 * the baseStyle, however, they add or replaces specific properties. In this
 * way, an overrides object can specify a single paint property to modify or add
 * without overwriting all of the paint properties of the baseStyle.
 *
 * @param {object} baseStyle
 * @param {object} overrides
 * @returns {object}
 */
export const mergeOverrides = (baseStyle, overrides) => {
  const extended = cloneDeep(baseStyle)

  Object.entries(overrides).forEach(([k, v]) => {
    if (k === 'layout' || k === 'paint') {
      extended[k] = { ...extended[k], ...v };
    } else {
      extended[k] = v;
    }
  });

  return extended;
};

