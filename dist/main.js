var $gXNCa$fs = require("fs");
var $gXNCa$path = require("path");
var $gXNCa$chalk = require("chalk");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "buildStyle", () => $787eebfbd67e2373$export$a6e5f510497b7388);
$parcel$export(module.exports, "combineVariables", () => $2ad1fb18aaf57afe$export$567f04859746aee);



/**
 * Determine whether a value is or contains undefined within it
 *
 * @param {*} v - the value to check
 * @returns {boolean|array}
 */ const $787eebfbd67e2373$var$findUndefined = (v1)=>{
    if (v1 == undefined) return true;
    // For objects and arrays, we want to know the keys/indices
    // that contain undefined values
    if (typeof v1 === 'object' || Array.isArray(v1)) {
        const undefinedValues = Object.keys(v1).map((key)=>{
            const undefinedProps = $787eebfbd67e2373$var$findUndefined(v1[key]);
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
 */ const $787eebfbd67e2373$var$validateLayer = (layer)=>{
    let messages = [];
    const undefinedProps = $787eebfbd67e2373$var$findUndefined(layer);
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
 */ const $787eebfbd67e2373$var$extend = (baseStyle, overrides)=>{
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
 */ const $787eebfbd67e2373$var$getLayerBuildErrorMessage = (error, name, path)=>{
    const { stack: stack  } = error;
    // Get first "at" line of stack trace, split : to get line number
    const lineNumber = stack.split('\n')[1].split(':')[1];
    // Load file and get the line at the given lineNumber
    const layerFile = ($parcel$interopDefault($gXNCa$fs)).readFileSync(path, 'utf8');
    const layerLine = layerFile.split('\n')[lineNumber - 1];
    return `${($parcel$interopDefault($gXNCa$chalk)).red.bold('Error:')} Couldn't build layer ${($parcel$interopDefault($gXNCa$chalk)).blue(name)}.

Details: ${error.message} in
  ${($parcel$interopDefault($gXNCa$chalk)).blue(path)}

${lineNumber}: ${layerLine}`;
};
/**
 * Nicely format a file load error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ const $787eebfbd67e2373$var$getFileLoadErrorMessage = (fileType, name, path)=>{
    return `${($parcel$interopDefault($gXNCa$chalk)).red.bold('Error:')} Couldn't load ${fileType} ${($parcel$interopDefault($gXNCa$chalk)).blue(name)}, does it exist? Attempted to load from

  ${($parcel$interopDefault($gXNCa$chalk)).blue(path)}`;
};
/**
 * Nicely format and log validation messages for a style
 *
 * @param {string} style - the name of the style
 * @param {object} validationMessages - the validation messages, keyed by layer name
 * @returns {Void}
 */ const $787eebfbd67e2373$var$logValidationMessages = (style, validationMessages)=>{
    console.warn(`Found issues in style ${($parcel$interopDefault($gXNCa$chalk)).blue(style)}:`);
    Object.keys(validationMessages).forEach((layer)=>{
        console.warn(`  Layer ${($parcel$interopDefault($gXNCa$chalk)).blue(layer)}:`);
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
 */ const $787eebfbd67e2373$var$loadLayerBuilder = (name, path)=>{
    try {
        return require(path).default;
    } catch (error) {
        throw new Error($787eebfbd67e2373$var$getFileLoadErrorMessage('layer', name, path));
    }
};
/**
 * Load a style, wrapped here to catch and format errors.
 *
 * @param {string} path - the file path to the style
 * @param {string} name - the style name
 * @returns {object}
 */ const $787eebfbd67e2373$var$loadStyle = (name, path)=>{
    try {
        return require(path);
    } catch (error) {
        throw new Error($787eebfbd67e2373$var$getFileLoadErrorMessage('style', name, path));
    }
};
/**
 * Build a layer
 *
 * @param {object} context - the context, which contains variables for the layer
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {object}
 */ const $787eebfbd67e2373$var$buildLayer = (context, name, path)=>{
    const builder = $787eebfbd67e2373$var$loadLayerBuilder(name, path);
    let layer;
    try {
        layer = builder(context);
    } catch (error) {
        throw new Error($787eebfbd67e2373$var$getLayerBuildErrorMessage(error, name, path));
    }
    return $787eebfbd67e2373$var$extend(layer.baseStyle, layer.overrides);
};
const $787eebfbd67e2373$export$a6e5f510497b7388 = (name, styleDir, layerDir, options = {
})=>{
    if (!name) throw new Error('Must provide name.');
    if (!styleDir) throw new Error('Must provide styleDir.');
    if (!layerDir) throw new Error('Must provide layerDir.');
    const verbose = options?.verbose ?? false;
    const stylePath = ($parcel$interopDefault($gXNCa$path)).resolve(styleDir, `${name}.js`);
    const { context: context , template: template  } = $787eebfbd67e2373$var$loadStyle(name, stylePath);
    const styleJson = JSON.parse(JSON.stringify(template));
    let validationMessages = {
    };
    if (verbose) console.log(`Building style ${($parcel$interopDefault($gXNCa$chalk)).blue(name)}`);
    styleJson.layers = template.layers.map((layerName)=>{
        if (verbose) console.log(`  Adding layer ${($parcel$interopDefault($gXNCa$chalk)).blue(layerName)}`);
        const layerPath = ($parcel$interopDefault($gXNCa$path)).resolve(layerDir, `${layerName}.js`);
        const layer = $787eebfbd67e2373$var$buildLayer(context, layerName, layerPath);
        // Collect validation messages for each layer
        const layerValidationMessages = $787eebfbd67e2373$var$validateLayer(layer);
        if (layerValidationMessages.length) validationMessages[layerName] = layerValidationMessages;
        return layer;
    });
    if (Object.keys(validationMessages).length > 0) $787eebfbd67e2373$var$logValidationMessages(name, validationMessages);
    return styleJson;
};


const $2ad1fb18aaf57afe$var$isObject = (v)=>typeof v === 'object' && !Array.isArray(v) && !!v
;
const $2ad1fb18aaf57afe$var$merge = (current, extender)=>{
    const merged = JSON.parse(JSON.stringify(current));
    Object.keys(extender).forEach((k)=>{
        // Handle nested variables
        if ($2ad1fb18aaf57afe$var$isObject(current[k]) && $2ad1fb18aaf57afe$var$isObject(extender[k])) merged[k] = $2ad1fb18aaf57afe$var$merge(current[k], extender[k]);
        else merged[k] = JSON.parse(JSON.stringify(extender[k]));
    });
    return merged;
};
const $2ad1fb18aaf57afe$export$567f04859746aee = (...variableGroups)=>{
    let combined = {
    };
    variableGroups.forEach((variableGroup)=>{
        combined = $2ad1fb18aaf57afe$var$merge(combined, variableGroup);
    });
    return combined;
};




//# sourceMappingURL=main.js.map
