import $ilDKq$fs from "fs";
import $ilDKq$path from "path";
import $ilDKq$chalk from "chalk";




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
 */ const $dd232d3fc18ccc7d$var$extend = (baseStyle, overrides)=>{
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
 * Nicely format a file load error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ const $dd232d3fc18ccc7d$var$getFileLoadErrorMessage = (fileType, name, path)=>{
    return `${$ilDKq$chalk.red.bold('Error:')} Couldn't load ${fileType} ${$ilDKq$chalk.blue(name)}, does it exist? Attempted to load from

  ${$ilDKq$chalk.blue(path)}`;
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
    try {
        return require(path).default;
    } catch (error) {
        throw new Error($dd232d3fc18ccc7d$var$getFileLoadErrorMessage('layer', name, path));
    }
};
/**
 * Load a style, wrapped here to catch and format errors.
 *
 * @param {string} path - the file path to the style
 * @param {string} name - the style name
 * @returns {object}
 */ const $dd232d3fc18ccc7d$var$loadStyle = (name, path)=>{
    try {
        return require(path);
    } catch (error) {
        throw new Error($dd232d3fc18ccc7d$var$getFileLoadErrorMessage('style', name, path));
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
    return $dd232d3fc18ccc7d$var$extend(layer.baseStyle, layer.overrides);
};
const $dd232d3fc18ccc7d$export$a6e5f510497b7388 = (stylePath, layerDir, options = {
})=>{
    if (!stylePath) throw new Error('Must provide stylePath.');
    if (!layerDir) throw new Error('Must provide layerDir.');
    const name = stylePath.split('/').pop().replace(/\.js$/, '');
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




export {$dd232d3fc18ccc7d$export$a6e5f510497b7388 as buildStyle, $c77f414eaee20539$export$10aa94554223adba as mergeVariables};
//# sourceMappingURL=module.js.map
