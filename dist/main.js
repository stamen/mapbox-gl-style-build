var $imiQD$fs = require("fs");
var $imiQD$path = require("path");
var $imiQD$chalk = require("chalk");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "buildStyle", () => $d3d51e661990e06e$export$a6e5f510497b7388);
$parcel$export(module.exports, "mergeVariables", () => $1c55b3ddc6522c05$export$10aa94554223adba);



/**
 * Determine whether a value is or contains undefined within it
 *
 * @param {*} v - the value to check
 * @returns {boolean|array}
 */ const $d3d51e661990e06e$var$findUndefined = (v1)=>{
    if (v1 == undefined) return true;
    // For objects and arrays, we want to know the keys/indices
    // that contain undefined values
    if (typeof v1 === 'object' || Array.isArray(v1)) {
        const undefinedValues = Object.keys(v1).map((key)=>{
            const undefinedProps = $d3d51e661990e06e$var$findUndefined(v1[key]);
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
 */ const $d3d51e661990e06e$var$validateLayer = (layer)=>{
    let messages = [];
    const undefinedProps = $d3d51e661990e06e$var$findUndefined(layer);
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
 */ const $d3d51e661990e06e$var$extend = (baseStyle, overrides)=>{
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
 */ const $d3d51e661990e06e$var$getLayerBuildErrorMessage = (error, name, path)=>{
    const { stack: stack  } = error;
    // Get first "at" line of stack trace, split : to get line number
    const lineNumber = stack.split('\n')[1].split(':')[1];
    // Load file and get the line at the given lineNumber
    const layerFile = ($parcel$interopDefault($imiQD$fs)).readFileSync(path, 'utf8');
    const layerLine = layerFile.split('\n')[lineNumber - 1];
    return `${($parcel$interopDefault($imiQD$chalk)).red.bold('Error:')} Couldn't build layer ${($parcel$interopDefault($imiQD$chalk)).blue(name)}.

Details: ${error.message} in
  ${($parcel$interopDefault($imiQD$chalk)).blue(path)}

${lineNumber}: ${layerLine}`;
};
/**
 * Nicely format a file load error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ const $d3d51e661990e06e$var$getFileLoadErrorMessage = (fileType, name, path)=>{
    return `${($parcel$interopDefault($imiQD$chalk)).red.bold('Error:')} Couldn't load ${fileType} ${($parcel$interopDefault($imiQD$chalk)).blue(name)}, does it exist? Attempted to load from

  ${($parcel$interopDefault($imiQD$chalk)).blue(path)}`;
};
/**
 * Nicely format and log validation messages for a style
 *
 * @param {string} style - the name of the style
 * @param {object} validationMessages - the validation messages, keyed by layer name
 * @returns {Void}
 */ const $d3d51e661990e06e$var$logValidationMessages = (style, validationMessages)=>{
    console.warn(`Found issues in style ${($parcel$interopDefault($imiQD$chalk)).blue(style)}:`);
    Object.keys(validationMessages).forEach((layer)=>{
        console.warn(`  Layer ${($parcel$interopDefault($imiQD$chalk)).blue(layer)}:`);
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
 */ const $d3d51e661990e06e$var$loadLayerBuilder = (name, path)=>{
    try {
        return require(path).default;
    } catch (error) {
        throw new Error($d3d51e661990e06e$var$getFileLoadErrorMessage('layer', name, path));
    }
};
/**
 * Load a style, wrapped here to catch and format errors.
 *
 * @param {string} path - the file path to the style
 * @param {string} name - the style name
 * @returns {object}
 */ const $d3d51e661990e06e$var$loadStyle = (name, path)=>{
    try {
        return require(path);
    } catch (error) {
        throw new Error($d3d51e661990e06e$var$getFileLoadErrorMessage('style', name, path));
    }
};
/**
 * Build a layer
 *
 * @param {object} context - the context, which contains variables for the layer
 * @param {string} name - the layer name
 * @param {string} path - the file path to the layer
 * @returns {object}
 */ const $d3d51e661990e06e$var$buildLayer = (context, name, path)=>{
    const builder = $d3d51e661990e06e$var$loadLayerBuilder(name, path);
    let layer;
    try {
        layer = builder(context);
    } catch (error) {
        throw new Error($d3d51e661990e06e$var$getLayerBuildErrorMessage(error, name, path));
    }
    return $d3d51e661990e06e$var$extend(layer.baseStyle, layer.overrides);
};
const $d3d51e661990e06e$export$a6e5f510497b7388 = (stylePath, layerDir, options = {
})=>{
    if (!stylePath) throw new Error('Must provide stylePath.');
    if (!layerDir) throw new Error('Must provide layerDir.');
    const name = stylePath.split('/').pop().replace(/\.js$/, '');
    const verbose = options?.verbose ?? false;
    const { context: context , template: template  } = $d3d51e661990e06e$var$loadStyle(name, ($parcel$interopDefault($imiQD$path)).resolve(stylePath));
    const styleJson = JSON.parse(JSON.stringify(template));
    let validationMessages = {
    };
    if (verbose) console.log(`Building style ${($parcel$interopDefault($imiQD$chalk)).blue(name)}`);
    styleJson.layers = template.layers.map((layerName)=>{
        if (verbose) console.log(`  Adding layer ${($parcel$interopDefault($imiQD$chalk)).blue(layerName)}`);
        const layerPath = ($parcel$interopDefault($imiQD$path)).resolve(layerDir, `${layerName}.js`);
        const layer = $d3d51e661990e06e$var$buildLayer(context, layerName, layerPath);
        // Collect validation messages for each layer
        const layerValidationMessages = $d3d51e661990e06e$var$validateLayer(layer);
        if (layerValidationMessages.length) validationMessages[layerName] = layerValidationMessages;
        return layer;
    });
    if (Object.keys(validationMessages).length > 0) $d3d51e661990e06e$var$logValidationMessages(name, validationMessages);
    return styleJson;
};


const $1c55b3ddc6522c05$var$isObject = (v)=>typeof v === 'object' && !Array.isArray(v) && !!v
;
/**
 * Merge the current object of variables with an extender object. Variables
 * defined in extender will override variables defined in the current variables,
 * if there is overlap. Nested variables are taken into account.
 * @param {Object} current - the original variable object
 * @param {Object} extender - the extender variable object, containing overrides
 * @returns {Object} - the merged variables
 */ const $1c55b3ddc6522c05$var$merge = (current, extender)=>{
    const merged = JSON.parse(JSON.stringify(current));
    Object.keys(extender).forEach((k)=>{
        // Handle nested variables
        if ($1c55b3ddc6522c05$var$isObject(current[k]) && $1c55b3ddc6522c05$var$isObject(extender[k])) merged[k] = $1c55b3ddc6522c05$var$merge(current[k], extender[k]);
        else merged[k] = JSON.parse(JSON.stringify(extender[k]));
    });
    return merged;
};
const $1c55b3ddc6522c05$export$10aa94554223adba = (...variableGroups)=>{
    return variableGroups.reduce((acc, cur)=>$1c55b3ddc6522c05$var$merge(acc, cur)
    , {
    });
};




//# sourceMappingURL=main.js.map
