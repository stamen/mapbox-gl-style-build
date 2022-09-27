import $ilDKq$fs from "fs";
import $ilDKq$path from "path";
import $ilDKq$chalk from "chalk";
import $ilDKq$jsonstringifyprettycompact from "json-stringify-pretty-compact";
import {latest as $ilDKq$latest} from "@mapbox/mapbox-gl-style-spec";




const $3b9d4e5c487c058b$export$e8f23fe521397581 = (baseStyle, overrides)=>{
    const extended = JSON.parse(JSON.stringify(baseStyle));
    Object.entries(overrides).forEach(([k, v])=>{
        if (k === 'layout' || k === 'paint') extended[k] = {
            ...extended[k],
            ...v
        };
        else extended[k] = v;
    });
    return extended;
};


/**
 * Check if a file exists
 *
 * @param {string} path - the file path
 * @return {boolean} whether the file exists
 */ const $dd232d3fc18ccc7d$var$fileExists = (path)=>{
    try {
        $ilDKq$fs.accessSync(path, $ilDKq$fs.constants.R_OK);
    } catch (e) {
        return false;
    }
    return true;
};
/**
 * Determine whether a value is or contains undefined within it
 *
 * @param {*} v - the value to check
 * @returns {boolean|array}
 */ const $dd232d3fc18ccc7d$var$findUndefined = (v1)=>{
    if (v1 == undefined) return true;
    // For objects and arrays, we want to know the keys/indices
    // that contain undefined values
    if (typeof v1 === 'object' || Array.isArray(v1)) {
        const undefinedValues = Object.keys(v1).map((key)=>{
            const undefinedProps = $dd232d3fc18ccc7d$var$findUndefined(v1[key]);
            if (!undefinedProps) return null;
            // This is the leaf node, just return the key
            if (typeof undefinedProps === 'boolean') return key;
            // Undefined properties are deeper, include key and further branches
            return {
                [key]: undefinedProps
            };
        }).filter((v)=>!!v
        );
        return undefinedValues.length ? undefinedValues : false;
    }
    return false;
};
/**
 * Check built layer for validity
 *
 * @param {object} layer - the layer to check
 * @returns {array} an array of validation messages
 */ const $dd232d3fc18ccc7d$var$validateLayer = (layer)=>{
    let messages = [];
    const undefinedProps = $dd232d3fc18ccc7d$var$findUndefined(layer);
    if (undefinedProps?.length) messages = [
        ...messages,
        ...undefinedProps.map((undefinedProp)=>{
            return `Undefined property at ${JSON.stringify(undefinedProp)}`;
        })
    ];
    return messages;
};
/**
 * Get a useful error message when something goes wrong while building a layer
 *
 * Avoid stack traces, try to find error description and line in the layer file.
 *
 * @param {Error} error - the error object thrown
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {string}
 */ const $dd232d3fc18ccc7d$var$getLayerBuildErrorMessage = (error, name, path)=>{
    const { stack: stack  } = error;
    // Get first "at" line of stack trace, split : to get line number
    const lineNumber = stack.split('\n')[1].split(':')[1];
    // Load file and get the line at the given lineNumber
    const layerFile = $ilDKq$fs.readFileSync(path, 'utf8');
    const layerLine = layerFile.split('\n')[lineNumber - 1];
    return `${$ilDKq$chalk.red.bold('Error:')} Couldn't build layer ${$ilDKq$chalk.blue(name)}.

Details: ${error.message} in
  ${$ilDKq$chalk.blue(path)}

${lineNumber}: ${layerLine}`;
};
/**
 * Nicely format a file does not exist error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ const $dd232d3fc18ccc7d$var$getFileDoesNotExistMessage = (fileType, name, path)=>{
    return `\n${$ilDKq$chalk.red.bold('Error:')} Couldn't load ${fileType} ${$ilDKq$chalk.blue(name)}, does it exist? Attempted to load from
  ${$ilDKq$chalk.blue(path)}
`;
};
/**
 * Nicely format a file error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @param {string} error - the error message
 * @returns {string}
 */ const $dd232d3fc18ccc7d$var$getFileErrorMessage = (fileType, name, path, error)=>{
    return `\n${$ilDKq$chalk.red.bold('Error:')} Couldn't load ${fileType} ${$ilDKq$chalk.blue(name)}. Received this error:

${$ilDKq$chalk.red(error.stack)}
`;
};
/**
 * Nicely format and log validation messages for a style
 *
 * @param {string} style - the name of the style
 * @param {object} validationMessages - the validation messages, keyed by layer name
 * @returns {Void}
 */ const $dd232d3fc18ccc7d$var$logValidationMessages = (style, validationMessages)=>{
    console.warn(`Found issues in style ${$ilDKq$chalk.blue(style)}:`);
    Object.keys(validationMessages).forEach((layer)=>{
        console.warn(`  Layer ${$ilDKq$chalk.blue(layer)}:`);
        validationMessages[layer].forEach((message)=>{
            console.warn(`    ${message}`);
        });
    });
    console.warn('');
};
/**
 * Load the function that will build the layer.
 *
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {function} the layer builder
 */ const $dd232d3fc18ccc7d$var$loadLayerBuilder = (name, path)=>{
    if (!$dd232d3fc18ccc7d$var$fileExists(path)) throw new Error($dd232d3fc18ccc7d$var$getFileDoesNotExistMessage('layer', name, path));
    try {
        return require(path).default;
    } catch (error) {
        throw new Error($dd232d3fc18ccc7d$var$getFileErrorMessage('layer', name, path, error));
    }
};
/**
 * Load a style, wrapped here to catch and format errors.
 *
 * @param {string} path - the file path to the style
 * @param {string} name - the style name
 * @returns {object}
 */ const $dd232d3fc18ccc7d$var$loadStyle = (name, path)=>{
    if (!$dd232d3fc18ccc7d$var$fileExists(path)) throw new Error($dd232d3fc18ccc7d$var$getFileDoesNotExistMessage('style', name, path));
    try {
        return require(path);
    } catch (error) {
        throw new Error($dd232d3fc18ccc7d$var$getFileErrorMessage('style', name, path, error));
    }
};
/**
 * Build a layer
 *
 * @param {object} context - the context, which contains variables for the layer
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {object}
 */ const $dd232d3fc18ccc7d$var$buildLayer = (context, name, path)=>{
    const builder = $dd232d3fc18ccc7d$var$loadLayerBuilder(name, path);
    let layer;
    try {
        layer = builder(context);
    } catch (error) {
        throw new Error($dd232d3fc18ccc7d$var$getLayerBuildErrorMessage(error, name, path));
    }
    return $3b9d4e5c487c058b$export$e8f23fe521397581(layer.baseStyle, layer.overrides);
};
const $dd232d3fc18ccc7d$export$a6e5f510497b7388 = (stylePath, layerDir, options = {
})=>{
    if (!stylePath) throw new Error('Must provide stylePath.');
    if (!layerDir) throw new Error('Must provide layerDir.');
    const name = $ilDKq$path.basename(stylePath, '.js');
    const verbose = options?.verbose ?? false;
    const { context: context , template: template  } = $dd232d3fc18ccc7d$var$loadStyle(name, $ilDKq$path.resolve(stylePath));
    const styleJson = JSON.parse(JSON.stringify(template));
    let validationMessages = {
    };
    if (verbose) console.log(`Building style ${$ilDKq$chalk.blue(name)}`);
    styleJson.layers = template.layers.map((layerName)=>{
        if (verbose) console.log(`  Adding layer ${$ilDKq$chalk.blue(layerName)}`);
        const layerPath = $ilDKq$path.resolve(layerDir, `${layerName}.js`);
        const layer = $dd232d3fc18ccc7d$var$buildLayer(context, layerName, layerPath);
        // Collect validation messages for each layer
        const layerValidationMessages = $dd232d3fc18ccc7d$var$validateLayer(layer);
        if (layerValidationMessages.length) validationMessages[layerName] = layerValidationMessages;
        return layer;
    });
    if (Object.keys(validationMessages).length > 0) $dd232d3fc18ccc7d$var$logValidationMessages(name, validationMessages);
    return styleJson;
};



const $c77f414eaee20539$var$isObject = (v)=>typeof v === 'object' && !Array.isArray(v) && !!v
;
/**
 * Merge the current object of variables with an extender object. Variables
 * defined in extender will override variables defined in the current variables,
 * if there is overlap. Nested variables are taken into account.
 * @param {Object} current - the original variable object
 * @param {Object} extender - the extender variable object, containing overrides
 * @returns {Object} - the merged variables
 */ const $c77f414eaee20539$var$merge = (current, extender)=>{
    const merged = JSON.parse(JSON.stringify(current));
    Object.keys(extender).forEach((k)=>{
        // Handle nested variables
        if ($c77f414eaee20539$var$isObject(current[k]) && $c77f414eaee20539$var$isObject(extender[k])) merged[k] = $c77f414eaee20539$var$merge(current[k], extender[k]);
        else merged[k] = JSON.parse(JSON.stringify(extender[k]));
    });
    return merged;
};
const $c77f414eaee20539$export$10aa94554223adba = (...variableGroups)=>{
    return variableGroups.reduce((acc, cur)=>$c77f414eaee20539$var$merge(acc, cur)
    , {
    });
};


/**
 * Returns a new function that divides a number by the modifier passed here
 * @param {number} divisor - number to divide by in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */ const $5248365052184b80$var$getDivideFn = (divisor)=>{
    return (num)=>num / divisor
    ;
};
/**
 * Returns a new function that subtracts from a number by the modifier passed here
 * @param {number} toSubtract - number to subtract in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */ const $5248365052184b80$var$getSubtractFn = (toSubtract)=>{
    return (num)=>num - toSubtract
    ;
};
/**
 * Returns a new function that adds to a number by the modifier passed here
 * @param {number} toAdd - number to add in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */ const $5248365052184b80$var$getAddFn = (toAdd)=>{
    return (num)=>num + toAdd
    ;
};
/**
 * Returns a new function that multiplies a number by the modifier passed here
 * @param {number} multiplier - number to multiply by in the output function
 * @returns {Function} - a function that multiplies a number by the modifier passed
 */ const $5248365052184b80$var$getMultiplyFn = (multiplier)=>{
    return (num)=>num * multiplier
    ;
};
/**
 * Modifies the property value after the transform function using options
 * @param {Array|number} value - property value of the variable
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Array|number} - the modified property values from the options
 */ const $5248365052184b80$var$handleOptions = (value, options)=>{
    const { round: round , floor: floor , ceil: ceil , toFixed: toFixed  } = options;
    if (round) return Math.round(value);
    if (floor) return Math.floor(value);
    if (ceil) return Math.ceil(value);
    if (toFixed !== undefined) return Number(value.toFixed(toFixed));
    return value;
};
/**
 * Modifies the property value of the variable with the transform function
 * @param {Array|number} propertyValue - property value of the variable
 * @param {Function} fn - function to run the value or expression output values through
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Array|number} - the modified property values
 */ const $5248365052184b80$var$modifyValue = (propertyValue, fn, options)=>{
    if (typeof propertyValue === 'number') return $5248365052184b80$var$handleOptions(fn(propertyValue), options);
    if (!Array.isArray(propertyValue)) return propertyValue;
    const expressionType = propertyValue[0];
    let sliceIndex;
    let outputCondition;
    let fallback;
    switch(expressionType){
        case 'interpolate':
        case 'interpolate-hcl':
        case 'interpolate-lab':
            sliceIndex = 3;
            outputCondition = (i)=>i % 2 !== 0
            ;
            break;
        case 'step':
            sliceIndex = 2;
            outputCondition = (i)=>i % 2 === 0
            ;
            break;
        case 'case':
            sliceIndex = 1;
            outputCondition = (i)=>i % 2 !== 0
            ;
            fallback = propertyValue.pop();
            break;
        case 'match':
            sliceIndex = 2;
            outputCondition = (i)=>i % 2 !== 0
            ;
            fallback = propertyValue.pop();
            break;
    }
    // Rebuild modified expression
    const nextValue = propertyValue.slice(0, sliceIndex);
    const inputOutputs = propertyValue.slice(sliceIndex);
    inputOutputs.forEach((val, i)=>{
        if (outputCondition(i)) nextValue.push($5248365052184b80$var$modifyValue(val, fn, options));
        else nextValue.push(val);
    });
    if (fallback !== undefined) nextValue.push($5248365052184b80$var$modifyValue(fallback, fn, options));
    return nextValue;
};
/**
 * Recurses the variables object to find the actual property values
 * @param {Object|Array|number} variables - the original variable object or variable
 * @param {Function} fn - function to run the value or expression output values through
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Object} - the modified variables
 */ const $5248365052184b80$var$replaceVariables = (variables, fn, options)=>{
    if (typeof variables !== 'object' || Array.isArray(variables)) return $5248365052184b80$var$modifyValue(variables, fn, options);
    return Object.keys(variables).reduce((acc, key)=>{
        acc[key] = $5248365052184b80$var$replaceVariables(variables[key], fn, options);
        return acc;
    }, {
    });
};
/**
 * Modify number values in variables using a math operation
 * @param {Object|Array|number} variables - the original variable object or variable
 * @param {string} operator - Math operation, one of - '*', '/', '+', '-'
 * @param {number} modifier - number argument to modify value by
 * @param {Object} [options] - options object with keys: round?: boolean, floor?: boolean, ceil?: boolean, toFixed?: number
 * @returns {Object} - the modified variables
 */ const $5248365052184b80$export$84c6f462c47512cf = (variables, operator, modifier, options = {
})=>{
    let nextVariables = JSON.parse(JSON.stringify(variables));
    let mathFn = (num)=>num
    ;
    switch(operator){
        case '*':
            mathFn = $5248365052184b80$var$getMultiplyFn(modifier);
            break;
        case '/':
            mathFn = $5248365052184b80$var$getDivideFn(modifier);
            break;
        case '+':
            mathFn = $5248365052184b80$var$getAddFn(modifier);
            break;
        case '-':
            mathFn = $5248365052184b80$var$getSubtractFn(modifier);
            break;
        default:
            throw new Error(`${operator} is not a valid operator.`);
    }
    nextVariables = $5248365052184b80$var$replaceVariables(variables, mathFn, options);
    return nextVariables;
};




const $7feac53bc43fae8b$export$6b76883d21416ca5 = (baseLayer, variants)=>{
    let layer = baseLayer;
    if (!layer) layer = Object.values(variants)[0];
    let baseStyle = $ilDKq$jsonstringifyprettycompact(layer, {
        indent: 2
    }).split('\n').join('\n  ');
    let allOverrides = '';
    // TODO currently making the primary differentiator style id until we sort differences
    for(const styleName in variants){
        let overrides = {
        };
        if (layer && Object.keys(variants).length) {
            let variantLayer = variants[styleName];
            Object.entries(variantLayer).forEach(([k, v])=>{
                if (k === 'layout' || k === 'paint') return;
                if (JSON.stringify(v) === JSON.stringify(layer[k])) return;
                overrides[k] = v;
            });
            if (variantLayer.layout) {
                // If a property does not exist on a variant, override with the default
                const defaultLayout = Object.keys(layer.layout || {
                }).reduce((acc, k)=>{
                    acc[k] = $ilDKq$latest[`layout_${layer.type}`][k].default;
                    return acc;
                }, {
                });
                const fullLayout = {
                    ...defaultLayout,
                    ...variantLayer.layout
                };
                Object.entries(fullLayout).forEach(([k, v])=>{
                    if (JSON.stringify(v) === JSON.stringify(layer?.layout?.[k])) return;
                    if (!overrides.layout) overrides.layout = {
                    };
                    overrides.layout[k] = v;
                });
            }
            if (variantLayer.paint) {
                // If a property does not exist on a variant, override with the default
                const defaultPaint = Object.keys(layer.paint || {
                }).reduce((acc, k)=>{
                    acc[k] = $ilDKq$latest[`paint_${layer.type}`][k].default;
                    return acc;
                }, {
                });
                const fullPaint = {
                    ...defaultPaint,
                    ...variantLayer.paint
                };
                Object.entries(fullPaint).forEach(([k, v])=>{
                    if (JSON.stringify(v) === JSON.stringify(layer?.paint?.[k])) return;
                    if (!overrides.paint) overrides.paint = {
                    };
                    overrides.paint[k] = v;
                });
            }
        }
        overrides = $ilDKq$jsonstringifyprettycompact(overrides, {
            indent: 2
        }).split('\n').join('\n    ');
        allOverrides += `${!!allOverrides ? ' else if' : 'if'} (context.styleName === '${styleName}') {
        overrides = ${overrides};
    }`;
    }
    const fileContent = `module.exports.default = (context) => {
        const baseStyle = ${baseStyle};

        let overrides = {};

        ${allOverrides}

        return {
            baseStyle,
            overrides
        };
    };`;
    return fileContent;
};
const $7feac53bc43fae8b$export$65b94debc34e9714 = (style)=>{
    const templateStyle = {
        ...style,
        layers: style.layers.map((l)=>l.id
        )
    };
    // TODO this seems Amazon specific
    const fileContent = `module.exports.context = {
  colors: {
  },
  styleName: '${style.name}'
};

module.exports.template = ${JSON.stringify(templateStyle, null, 2)};
`;
    return fileContent;
};




export {$3b9d4e5c487c058b$export$e8f23fe521397581 as mergeOverrides, $dd232d3fc18ccc7d$export$a6e5f510497b7388 as buildStyle, $c77f414eaee20539$export$10aa94554223adba as mergeVariables, $5248365052184b80$export$84c6f462c47512cf as modifyNumberVariables, $7feac53bc43fae8b$export$6b76883d21416ca5 as createLayerTemplate, $7feac53bc43fae8b$export$65b94debc34e9714 as createVariantTemplate};
//# sourceMappingURL=module.js.map
