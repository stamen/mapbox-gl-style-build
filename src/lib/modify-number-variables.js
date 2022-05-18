/**
 * Returns a new function that divides a number by the modifier passed here
 * @param {number} divisor - number to divide by in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */
const getDivideFn = divisor => {
  return num => num / divisor;
};
/**
 * Returns a new function that subtracts from a number by the modifier passed here
 * @param {number} toSubtract - number to subtract in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */
const getSubtractFn = toSubtract => {
  return num => num - toSubtract;
};
/**
 * Returns a new function that adds to a number by the modifier passed here
 * @param {number} toAdd - number to add in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */
const getAddFn = toAdd => {
  return num => num + toAdd;
};
/**
 * Returns a new function that multiplies a number by the modifier passed here
 * @param {number} multiplier - number to multiply by in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */
const getMultiplyFn = multiplier => {
  return num => num * multiplier;
};

/**
 * Modifies the property value after the transform function using options
 * @param {Array|number} value - property value of the variable
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Array|number} - the modified property values from the options
 */
const handleOptions = (value, options) => {
  const { round, floor, ceil, toFixed } = options;
  if (round) return Math.round(value);
  if (floor) return Math.floor(value);
  if (ceil) return Math.ceil(value);
  if (toFixed) return value.toFixed(toFixed);
  return value;
};

/**
 * Modifies the property value of the variable with the transform function
 * @param {Array|number} propertyValue - property value of the variable
 * @param {Function} fn - function to run the value or expression output values through
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Array|number} - the modified property values
 */
const modifyValue = (propertyValue, fn, options) => {
  if (typeof propertyValue === 'number') {
    return handleOptions(fn(propertyValue), options);
  }
  if (!Array.isArray(propertyValue)) return propertyValue;

  const expressionType = propertyValue[0];
  let sliceIndex;
  let outputCondition;
  let fallback;

  switch (expressionType) {
    case 'interpolate':
    case 'interpolate-hcl':
    case 'interpolate-lab': {
      sliceIndex = 3;
      outputCondition = i => i % 2 !== 0;
      break;
    }
    case 'step': {
      sliceIndex = 2;
      outputCondition = i => i % 2 === 0;
      break;
    }
    case 'case': {
      sliceIndex = 1;
      outputCondition = i => i % 2 !== 0;
      fallback = propertyValue.pop();
      break;
    }
    case 'match': {
      sliceIndex = 2;
      outputCondition = i => i % 2 !== 0;
      fallback = propertyValue.pop();
      break;
    }
  }

  // Rebuild modified expression
  const nextValue = propertyValue.slice(0, sliceIndex);
  const inputOutputs = propertyValue.slice(sliceIndex);
  inputOutputs.forEach((val, i) => {
    if (outputCondition(i)) {
      nextValue.push(modifyValue(val, fn, options));
    } else {
      nextValue.push(val);
    }
  });
  if (fallback !== undefined) {
    nextValue.push(modifyValue(fallback, fn, options));
  }

  return nextValue;
};

/**
 * Recurses the variables object to find the actual property values
 * @param {Object} variables - the original variable object
 * @param {Function} fn - function to run the value or expression output values through
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Object} - the modified variables
 */
const replaceVariables = (variables, fn, options) => {
  if (typeof variables !== 'object' || Array.isArray(variables)) {
    return modifyValue(variables, fn, options);
  }
  return Object.keys(variables).reduce((acc, key) => {
    acc[key] = replaceVariables(variables[key], fn, options);
    return acc;
  }, {});
};

/**
 * Modify number values in variables using a math operation
 * @param {Object} variables - the original variable object
 * @param {string} operator - Math operation, one of - '*', '/', '+', '-'
 * @param {number} modifier - number argument to modify value by
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Object} - the modified variables
 */
const modifyNumberVariables = (variables, operator, modifier, options = {}) => {
  let nextVariables = JSON.parse(JSON.stringify(variables));
  let mathFn = num => num;

  switch (operator) {
    case '*': {
      mathFn = getMultiplyFn(modifier);
      break;
    }
    case '/': {
      mathFn = getDivideFn(modifier);
      break;
    }
    case '+': {
      mathFn = getAddFn(modifier);
      break;
    }
    case '-': {
      mathFn = getSubtractFn(modifier);
      break;
    }
    default: {
      console.error(`${operator} is not a valid operator.`);
    }
  }

  nextVariables = replaceVariables(variables, mathFn, options);

  return nextVariables;
};

export { modifyNumberVariables };
