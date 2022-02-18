# mapbox-gl-style-build

Build [Mapbox GL styles](https://docs.mapbox.com/mapbox-gl-js/style-spec/) by composing layers.

## Usage

### Style definition

This script assumes you have two directories:

 1. The **styles** directory, which contains each style you want to build. Each style is defined as a JS module that exports two plain JS objects:
    1. `context`: The variables this style defines that will be passed to layers during the build
    2. `template`: The style, which is a [Mapbox GL style](https://docs.mapbox.com/mapbox-gl-js/style-spec/), the only difference being that `layers` is an array of layer ids. 
 2. The **layers** directory, which contains each layer that will be included in a style. Each layer is defined as a JS module that exports a default function. The function takes one parameter: `context`, which contains the variables passed from the style. The function 
 must return two objects:
    1. `baseStyle`: The base style object
    2. `overrides`: Any overrides for to the `baseStyle`, may be an empty object if no overrides are necessary

See the `examples` directory for examples.

### Using the script

Once installed using your package manager:

```
mapbox-gl-style-build
    --style-dir=templates/styles
    --layer-dir=templates/layers
    --out-dir=build
```

The parameters are as follows:
 * `--style-dir`: the style directory as defined above
 * `--layer-dir`: the layer directory as defined above
 * `--out-dir`: the directory built styles will be placed within
 * `-v`: include for verbose output


## Development

 1. Clone this rep
 2. `yarn install`
 3. `yarn watch`
 4. Edit files in `src/` and they will be built into `dist/`
