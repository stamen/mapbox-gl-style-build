import { createLayerTemplate, createVariantTemplate } from '../create-template';

// Remove newlines and double space indents to standardize prettified files for tests to pass in case we change formatting
const removeNewLines = text => {
  return text.replace(/(\r\n|\n|\r|\s\s)/g, '');
};

describe('createLayerTemplate', () => {
  let baseLayer = {
    id: 'base-layer',
    type: 'symbol',
    source: 'places',
    'source-layer': 'place-place',
    layout: {
      'text-field': 'text',
      'text-font': ['Arial Unicode']
    },
    paint: {
      'text-color': 'red'
    }
  };
  let variants = {
    blueVariant: {
      id: 'blue-variant',
      type: 'symbol',
      source: 'places',
      'source-layer': 'place-place',
      layout: {
        'text-field': 'text',
        'text-font': ['Arial Unicode']
      },
      paint: {
        'text-color': 'blue'
      }
    },
    textVariant: {
      id: 'text-variant',
      type: 'symbol',
      source: 'places',
      'source-layer': 'place-place',
      layout: {
        'text-field': 'new text',
        'text-font': ['Univers']
      },
      paint: {
        'text-color': 'red'
      }
    }
  };
  test('Creates stringified template file to write', () => {
    const actual = createLayerTemplate(baseLayer, variants);
    const expected = `module.exports.default = (context) => {const baseStyle = {"id": "base-layer","type": "symbol","source": "places","source-layer": "place-place","layout": {"text-field": "text", "text-font": ["Arial Unicode"]},"paint": {"text-color": "red"}};let overrides = {};if (context.styleName === 'blueVariant') {overrides = {"id": "blue-variant", "paint": {"text-color": "blue"}};} else if (context.styleName === 'textVariant') {overrides = {"id": "text-variant","layout": {"text-field": "new text", "text-font": ["Univers"]}};}return {baseStyle,overrides};};`;
    expect(removeNewLines(actual)).toEqual(expected);
  });
});

describe('createVariantTemplate', () => {
  let style = {
    version: 8,
    name: 'my-style',
    sprite: 'https://path/to/sprite',
    glyphs: 'https://path/to/font.pbf',
    sources: {
      'my-source': {
        type: 'vector',
        url: 'https://path/to/source.json'
      }
    },
    layers: [
      {
        id: 'land',
        type: 'background',
        paint: {
          'background-color': 'brown'
        }
      },
      {
        id: 'park',
        type: 'fill',
        source: 'my-source',
        'source-layer': 'landuse',
        paint: {
          'fill-color': 'green'
        }
      },
      {
        id: 'place-label',
        type: 'symbol',
        source: 'my-source',
        'source-layer': 'place',
        layout: {
          'text-field': 'text',
          'text-font': ['Arial Unicode']
        },
        paint: {
          'text-color': 'black'
        }
      }
    ]
  };

  test('Creates stringified style template file to write', () => {
    const actual = createVariantTemplate(style);
    const expected = `module.exports.context = {colors: {},styleName: 'my-style'};module.exports.template = {"version": 8,"name": "my-style","sprite": "https://path/to/sprite","glyphs": "https://path/to/font.pbf","sources": {"my-source": {"type": "vector","url": "https://path/to/source.json"}},"layers": ["land","park","place-label"]};`;
    expect(removeNewLines(actual)).toEqual(expected);
  });
});
