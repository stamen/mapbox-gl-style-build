var $gXNCa$fs = require("fs");
var $gXNCa$path = require("path");
var $gXNCa$chalk = require("chalk");

"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
Object.defineProperty(module.exports, "addOverrides", {
    enumerable: true,
    get: function get() {
        return $046eba4e112f393d$exports.addOverrides;
    }
});
Object.defineProperty(module.exports, "buildStyle", {
    enumerable: true,
    get: function get() {
        return $787eebfbd67e2373$exports.buildStyle;
    }
});
Object.defineProperty(module.exports, "mergeVariables", {
    enumerable: true,
    get: function get() {
        return $5d86828d3cc45dbd$exports.mergeVariables;
    }
});
var $046eba4e112f393d$exports = {};
"use strict";
Object.defineProperty($046eba4e112f393d$exports, "__esModule", {
    value: true
});
$046eba4e112f393d$exports.addOverrides = void 0;
function $046eba4e112f393d$var$ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function $046eba4e112f393d$var$_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        };
        i % 2 ? $046eba4e112f393d$var$ownKeys(Object(source), !0).forEach(function(key) {
            $046eba4e112f393d$var$_defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : $046eba4e112f393d$var$ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function $046eba4e112f393d$var$_defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function $046eba4e112f393d$var$_slicedToArray(arr, i) {
    return $046eba4e112f393d$var$_arrayWithHoles(arr) || $046eba4e112f393d$var$_iterableToArrayLimit(arr, i) || $046eba4e112f393d$var$_unsupportedIterableToArray(arr, i) || $046eba4e112f393d$var$_nonIterableRest();
}
function $046eba4e112f393d$var$_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function $046eba4e112f393d$var$_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return $046eba4e112f393d$var$_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return $046eba4e112f393d$var$_arrayLikeToArray(o, minLen);
}
function $046eba4e112f393d$var$_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function $046eba4e112f393d$var$_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function $046eba4e112f393d$var$_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
/**
 * Add overrides to a baseStyle
 *
 * paint and layout overrides do not fully overwrite paint and layout values in
 * the baseStyle, however, they add or replaces specific properties. In this
 * way, an overrides object can specify a single paint property to modify or add
 * without overwriting all of the paint properties of the baseStyle.
 *
 * @param {object} baseStyle
 * @param {object} overrides
 * @returns {object}
 */ var $046eba4e112f393d$var$addOverrides = function addOverrides(baseStyle, overrides) {
    var extended = JSON.parse(JSON.stringify(baseStyle));
    Object.entries(overrides).forEach(function(_ref) {
        var _ref2 = $046eba4e112f393d$var$_slicedToArray(_ref, 2), k = _ref2[0], v = _ref2[1];
        if (k === 'layout' || k === 'paint') extended[k] = $046eba4e112f393d$var$_objectSpread($046eba4e112f393d$var$_objectSpread({
        }, extended[k]), v);
        else extended[k] = v;
    });
    return extended;
};
$046eba4e112f393d$exports.addOverrides = $046eba4e112f393d$var$addOverrides;


var $787eebfbd67e2373$exports = {};
"use strict";
Object.defineProperty($787eebfbd67e2373$exports, "__esModule", {
    value: true
});
$787eebfbd67e2373$exports.buildStyle = void 0;

var $787eebfbd67e2373$var$_fs = $787eebfbd67e2373$var$_interopRequireDefault($gXNCa$fs);

var $787eebfbd67e2373$var$_path = $787eebfbd67e2373$var$_interopRequireDefault($gXNCa$path);

var $787eebfbd67e2373$var$_chalk = $787eebfbd67e2373$var$_interopRequireDefault($gXNCa$chalk);

function $787eebfbd67e2373$var$_interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    };
}
function $787eebfbd67e2373$var$_toConsumableArray(arr) {
    return $787eebfbd67e2373$var$_arrayWithoutHoles(arr) || $787eebfbd67e2373$var$_iterableToArray(arr) || $787eebfbd67e2373$var$_unsupportedIterableToArray(arr) || $787eebfbd67e2373$var$_nonIterableSpread();
}
function $787eebfbd67e2373$var$_nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function $787eebfbd67e2373$var$_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return $787eebfbd67e2373$var$_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return $787eebfbd67e2373$var$_arrayLikeToArray(o, minLen);
}
function $787eebfbd67e2373$var$_iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function $787eebfbd67e2373$var$_arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return $787eebfbd67e2373$var$_arrayLikeToArray(arr);
}
function $787eebfbd67e2373$var$_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function $787eebfbd67e2373$var$_defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function $787eebfbd67e2373$var$_typeof(obj1) {
    return $787eebfbd67e2373$var$_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, $787eebfbd67e2373$var$_typeof(obj1);
}
/**
 * Determine whether a value is or contains undefined within it
 *
 * @param {*} v - the value to check
 * @returns {boolean|array}
 */ var $787eebfbd67e2373$var$findUndefined = function findUndefined(v1) {
    if (v1 == undefined) return true; // For objects and arrays, we want to know the keys/indices
    // that contain undefined values
    if ($787eebfbd67e2373$var$_typeof(v1) === 'object' || Array.isArray(v1)) {
        var undefinedValues = Object.keys(v1).map(function(key) {
            var undefinedProps = findUndefined(v1[key]);
            if (!undefinedProps) return null; // This is the leaf node, just return the key
            if (typeof undefinedProps === 'boolean') return key; // Undefined properties are deeper, include key and further branches
            return $787eebfbd67e2373$var$_defineProperty({
            }, key, undefinedProps);
        }).filter(function(v) {
            return !!v;
        });
        return undefinedValues.length ? undefinedValues : false;
    }
    return false;
};
/**
 * Check built layer for validity
 *
 * @param {object} layer - the layer to check
 * @returns {array} an array of validation messages
 */ var $787eebfbd67e2373$var$validateLayer = function validateLayer(layer) {
    var messages = [];
    var undefinedProps = $787eebfbd67e2373$var$findUndefined(layer);
    if (undefinedProps !== null && undefinedProps !== void 0 && undefinedProps.length) messages = [].concat($787eebfbd67e2373$var$_toConsumableArray(messages), $787eebfbd67e2373$var$_toConsumableArray(undefinedProps.map(function(undefinedProp) {
        return "Undefined property at ".concat(JSON.stringify(undefinedProp));
    })));
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
 */ var $787eebfbd67e2373$var$getLayerBuildErrorMessage = function getLayerBuildErrorMessage(error, name, path) {
    var stack = error.stack; // Get first "at" line of stack trace, split : to get line number
    var lineNumber = stack.split('\n')[1].split(':')[1]; // Load file and get the line at the given lineNumber
    var layerFile = $787eebfbd67e2373$var$_fs["default"].readFileSync(path, 'utf8');
    var layerLine = layerFile.split('\n')[lineNumber - 1];
    return "".concat($787eebfbd67e2373$var$_chalk["default"].red.bold('Error:'), " Couldn't build layer ").concat($787eebfbd67e2373$var$_chalk["default"].blue(name), ".\n\nDetails: ").concat(error.message, " in\n  ").concat($787eebfbd67e2373$var$_chalk["default"].blue(path), "\n\n").concat(lineNumber, ": ").concat(layerLine);
};
/**
 * Nicely format a file load error message
 *
 * @param {string} fileType - 'layer' or 'style'
 * @param {string} name - the name of the file being loaded
 * @param {string} path - the file path being loaded
 * @returns {string}
 */ var $787eebfbd67e2373$var$getFileLoadErrorMessage = function getFileLoadErrorMessage(fileType, name, path) {
    return "".concat($787eebfbd67e2373$var$_chalk["default"].red.bold('Error:'), " Couldn't load ").concat(fileType, " ").concat($787eebfbd67e2373$var$_chalk["default"].blue(name), ", does it exist? Attempted to load from\n\n  ").concat($787eebfbd67e2373$var$_chalk["default"].blue(path));
};
/**
 * Nicely format and log validation messages for a style
 *
 * @param {string} style - the name of the style
 * @param {object} validationMessages - the validation messages, keyed by layer name
 * @returns {Void}
 */ var $787eebfbd67e2373$var$logValidationMessages = function logValidationMessages(style, validationMessages) {
    console.warn("Found issues in style ".concat($787eebfbd67e2373$var$_chalk["default"].blue(style), ":"));
    Object.keys(validationMessages).forEach(function(layer) {
        console.warn("  Layer ".concat($787eebfbd67e2373$var$_chalk["default"].blue(layer), ":"));
        validationMessages[layer].forEach(function(message) {
            console.warn("    ".concat(message));
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
 */ var $787eebfbd67e2373$var$loadLayerBuilder = function loadLayerBuilder(name, path) {
    try {
        return require(path)["default"];
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
 */ var $787eebfbd67e2373$var$loadStyle = function loadStyle(name, path) {
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
 */ var $787eebfbd67e2373$var$buildLayer = function buildLayer(context, name, path) {
    var builder = $787eebfbd67e2373$var$loadLayerBuilder(name, path);
    var layer;
    try {
        layer = builder(context);
    } catch (error) {
        throw new Error($787eebfbd67e2373$var$getLayerBuildErrorMessage(error, name, path));
    }
    return (0, $046eba4e112f393d$exports.addOverrides)(layer.baseStyle, layer.overrides);
};
/**
 * Build style
 *
 * @param {string} name - the name of the style to build
 * @param {string} styleDir - the input directory that contains styles
 * @param {string} layerDir - the input directory that contains layers
 * @returns {Object}
 */ var $787eebfbd67e2373$var$buildStyle = function buildStyle(stylePath, layerDir) {
    var _options$verbose;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    };
    if (!stylePath) throw new Error('Must provide stylePath.');
    if (!layerDir) throw new Error('Must provide layerDir.');
    var name = $787eebfbd67e2373$var$_path["default"].basename(stylePath, '.js');
    var verbose = (_options$verbose = options === null || options === void 0 ? void 0 : options.verbose) !== null && _options$verbose !== void 0 ? _options$verbose : false;
    var _loadStyle = $787eebfbd67e2373$var$loadStyle(name, $787eebfbd67e2373$var$_path["default"].resolve(stylePath)), context = _loadStyle.context, template = _loadStyle.template;
    var styleJson = JSON.parse(JSON.stringify(template));
    var validationMessages = {
    };
    if (verbose) console.log("Building style ".concat($787eebfbd67e2373$var$_chalk["default"].blue(name)));
    styleJson.layers = template.layers.map(function(layerName) {
        if (verbose) console.log("  Adding layer ".concat($787eebfbd67e2373$var$_chalk["default"].blue(layerName)));
        var layerPath = $787eebfbd67e2373$var$_path["default"].resolve(layerDir, "".concat(layerName, ".js"));
        var layer = $787eebfbd67e2373$var$buildLayer(context, layerName, layerPath); // Collect validation messages for each layer
        var layerValidationMessages = $787eebfbd67e2373$var$validateLayer(layer);
        if (layerValidationMessages.length) validationMessages[layerName] = layerValidationMessages;
        return layer;
    });
    if (Object.keys(validationMessages).length > 0) $787eebfbd67e2373$var$logValidationMessages(name, validationMessages);
    return styleJson;
};
$787eebfbd67e2373$exports.buildStyle = $787eebfbd67e2373$var$buildStyle;


var $5d86828d3cc45dbd$exports = {};
"use strict";
Object.defineProperty($5d86828d3cc45dbd$exports, "__esModule", {
    value: true
});
$5d86828d3cc45dbd$exports.mergeVariables = void 0;
function $5d86828d3cc45dbd$var$_typeof(obj1) {
    return $5d86828d3cc45dbd$var$_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, $5d86828d3cc45dbd$var$_typeof(obj1);
}
var $5d86828d3cc45dbd$var$isObject = function isObject(v) {
    return $5d86828d3cc45dbd$var$_typeof(v) === 'object' && !Array.isArray(v) && !!v;
};
/**
 * Merge the current object of variables with an extender object. Variables
 * defined in extender will override variables defined in the current variables,
 * if there is overlap. Nested variables are taken into account.
 * @param {Object} current - the original variable object
 * @param {Object} extender - the extender variable object, containing overrides
 * @returns {Object} - the merged variables
 */ var $5d86828d3cc45dbd$var$merge = function merge(current, extender) {
    var merged = JSON.parse(JSON.stringify(current));
    Object.keys(extender).forEach(function(k) {
        // Handle nested variables
        if ($5d86828d3cc45dbd$var$isObject(current[k]) && $5d86828d3cc45dbd$var$isObject(extender[k])) merged[k] = merge(current[k], extender[k]);
        else merged[k] = JSON.parse(JSON.stringify(extender[k]));
    });
    return merged;
};
/**
 * Merge any number of variable objects
 * @param {...Object} variableGroups - one or many variable objects, each 
 * passed as a separate parameter
 * @returns {Object} the merged variable object
 */ var $5d86828d3cc45dbd$var$mergeVariables = function mergeVariables() {
    for(var _len = arguments.length, variableGroups = new Array(_len), _key = 0; _key < _len; _key++)variableGroups[_key] = arguments[_key];
    return variableGroups.reduce(function(acc, cur) {
        return $5d86828d3cc45dbd$var$merge(acc, cur);
    }, {
    });
};
$5d86828d3cc45dbd$exports.mergeVariables = $5d86828d3cc45dbd$var$mergeVariables;




//# sourceMappingURL=main.js.map
