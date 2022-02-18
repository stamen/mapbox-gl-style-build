import $5OpyM$fs from "fs";
import $5OpyM$path from "path";
import $5OpyM$chalk from "chalk";




/**
 * Determine whether a value is or contains undefined within it
 *
 * @param {*} v - the value to check
 * @returns {boolean|array}
 */ const $5c3f8fbf0bc952bf$var$findUndefined = (v1)=>{
    if (v1 == undefined) return true;
    // For objects and arrays, we want to know the keys/indices
    // that contain undefined values
    if (typeof v1 === 'object' || Array.isArray(v1)) {
        const undefinedValues = Object.keys(v1).map((key)=>{
            const undefinedProps = $5c3f8fbf0bc952bf$var$findUndefined(v1[key]);
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
 */ const $5c3f8fbf0bc952bf$var$validateLayer = (layer)=>{
    let messages = [];
    const undefinedProps = $5c3f8fbf0bc952bf$var$findUndefined(layer);
    if (undefinedProps?.length) messages = [
        ...messages,
        ...undefinedProps.map((undefinedProp)=>{
            return `Undefined property at ${JSON.stringify(undefinedProp)}`;
        })
    ];
    return messages;
};
/**
 * Extend a baseStyle with the given overrides.
 *
 * paint and layout overrides do not fully overwrite paint and layout values in
 * the baseStyle, however, they add or replaces specific properties. In this
 * way, an overrides object can specify a single paint property to modify or add
 * without overwriting all of the paint properties of the baseStyle.
 *
 * @param {object} baseStyle
 * @param {object} overrides
 * @returns {object}
 */ const $5c3f8fbf0bc952bf$var$extend = (baseStyle, overrides)=>{
    const extended = {
        ...baseStyle
    };
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
 * Get a useful error message when something goes wrong while building a layer
 *
 * Avoid stack traces, try to find error description and line in the layer file.
 *
 * @param {Error} error - the error object thrown
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {string}
 */ const $5c3f8fbf0bc952bf$var$getLayerBuildErrorMessage = (error, name, path)=>{
    const { stack: stack  } = error;
    // Get first "at" line of stack trace, split : to get line number
    const lineNumber = stack.split('\n')[1].split(':')[1];
    // Load file and get the line at the given lineNumber
    const layerFile = $5OpyM$fs.readFileSync(path, 'utf8');
    const layerLine = layerFile.split('\n')[lineNumber - 1];
    return `${$5OpyM$chalk.red.bold('Error:')} Couldn't build layer ${$5OpyM$chalk.blue(name)}.

Details: ${error.message} in
  ${$5OpyM$chalk.blue(path)}

${lineNumber}: ${layerLine}`;
};
/**
 * Nicely format a file load error message
 *
 * @param {string} fileType - 'layer' or 'variant'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ const $5c3f8fbf0bc952bf$var$getFileLoadErrorMessage = (fileType, name, path)=>{
    return `${$5OpyM$chalk.red.bold('Error:')} Couldn't load ${fileType} ${$5OpyM$chalk.blue(name)}, does it exist? Attempted to load from

  ${$5OpyM$chalk.blue(path)}`;
};
/**
 * Nicely format and log validation messages for a variant
 *
 * @param {string} variant - the name of the variant
 * @param {object} validationMessages - the validation messages, keyed by layer name
 * @returns {Void}
 */ const $5c3f8fbf0bc952bf$var$logValidationMessages = (variant, validationMessages)=>{
    console.warn(`Found issues in variant ${$5OpyM$chalk.blue(variant)}:`);
    Object.keys(validationMessages).forEach((layer)=>{
        console.warn(`  Layer ${$5OpyM$chalk.blue(layer)}:`);
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
 */ const $5c3f8fbf0bc952bf$var$loadLayerBuilder = (name, path)=>{
    try {
        return require(path).default;
    } catch (error) {
        throw new Error($5c3f8fbf0bc952bf$var$getFileLoadErrorMessage('layer', name, path));
    }
};
/**
 * Load a variant, wrapped here to catch and format errors.
 *
 * @param {string} path - the file path to the variant
 * @param {string} name - the variant name
 * @returns {object}
 */ const $5c3f8fbf0bc952bf$var$loadVariant = (name, path)=>{
    try {
        return require(path);
    } catch (error) {
        throw new Error($5c3f8fbf0bc952bf$var$getFileLoadErrorMessage('variant', name, path));
    }
};
/**
 * Build a layer
 *
 * @param {object} context - the context, which contains variables for the layer
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {object}
 */ const $5c3f8fbf0bc952bf$var$buildLayer = (context, name, path)=>{
    const builder = $5c3f8fbf0bc952bf$var$loadLayerBuilder(name, path);
    let layer;
    try {
        layer = builder(context);
    } catch (error) {
        throw new Error($5c3f8fbf0bc952bf$var$getLayerBuildErrorMessage(error, name, path));
    }
    return $5c3f8fbf0bc952bf$var$extend(layer.baseStyle, layer.overrides);
};
const $5c3f8fbf0bc952bf$export$a6e5f510497b7388 = (name, inputDir)=>{
    if (!name) throw new Error('Must provide name.');
    if (!inputDir) throw new Error('Must provide inputDir.');
    const variantPath = $5OpyM$path.resolve(inputDir, 'variants', `${name}.js`);
    const { context: context , template: template  } = $5c3f8fbf0bc952bf$var$loadVariant(name, variantPath);
    const styleJson = JSON.parse(JSON.stringify(template));
    let validationMessages = {
    };
    styleJson.layers = template.layers.map((layerName)=>{
        const layerPath = $5OpyM$path.resolve(inputDir, 'layers', `${layerName}.js`);
        const layer = $5c3f8fbf0bc952bf$var$buildLayer(context, layerName, layerPath);
        // Collect validation messages for each layer
        const layerValidationMessages = $5c3f8fbf0bc952bf$var$validateLayer(layer);
        if (layerValidationMessages.length) validationMessages[layerName] = layerValidationMessages;
        return layer;
    });
    if (Object.keys(validationMessages).length > 0) $5c3f8fbf0bc952bf$var$logValidationMessages(name, validationMessages);
    return styleJson;
};




export {$5c3f8fbf0bc952bf$export$a6e5f510497b7388 as buildStyle};
//# sourceMappingURL=module.mjs.map
