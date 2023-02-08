const sharedColors = require('../variables/colors');
const { mergeVariables } = require('../../../../dist/main');

module.exports.context = {
  sources: {
    root: 'Example'
  },
  colors: mergeVariables(sharedColors, {
    road: 'gray',
    water: 'blue'
  })
};

module.exports.template = {
  version: 8,
  name: 'style-2',
  sources: {
    Example: {
      type: 'vector',
      url: 'https://example.com/source.json'
    }
  },
  sprite: 'https://example.com/sprites/sprite',
  glyphs: 'https://example.com/{fontstack}/{range}.pbf',
  layers: ['layer1', 'layer2', 'layer3'],
  id: 'example-simple'
};
