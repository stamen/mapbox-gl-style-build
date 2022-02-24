const isObject = v => typeof v === 'object' && !Array.isArray(v) && !!v;

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

export const combineVariables = (...variableGroups) => {
  let combined = {};
  variableGroups.forEach(variableGroup => {
    combined = merge(combined, variableGroup);
  });
  return combined;
};
