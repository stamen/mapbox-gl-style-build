const isObject = v => typeof v === 'object' && !Array.isArray(v) && !!v;

/**
 * Merge the current object of variables with an extender object. Variables
 * defined in extender will override variables defined in the current variables,
 * if there is overlap. Nested variables are taken into account.
 * @param {Object} current - the original variable object
 * @param {Object} extender - the extender variable object, containing overrides
 * @returns {Object} - the merged variables
 */
const merge = (current, extender) => {
  const merged = JSON.parse(JSON.stringify(current));

  Object.keys(extender).forEach(k => {
    // Handle nested variables
    if (isObject(current[k]) && isObject(extender[k])) {
      merged[k] = merge(current[k], extender[k]);
    }
    else {
      merged[k] = JSON.parse(JSON.stringify(extender[k]));
    }
  });

  return merged;
};


/**
 * Merge any number of variable objects
 * @param {...Object} variableGroups - one or many variable objects, each 
 * passed as a separate parameter
 * @returns {Object} the merged variable object
 */
export const mergeVariables = (...variableGroups) => {
  return variableGroups.reduce((acc, cur) => merge(acc, cur), {});
};
