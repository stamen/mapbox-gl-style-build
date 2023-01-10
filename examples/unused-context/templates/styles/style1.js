module.exports.context = {
  sources: {
    root: 'Example'
  },
  colors: {
    road: 'black',
    water: 'blue'
  }
};

module.exports.template = {
  version: 8,
  name: 'simple',
  sources: {
    Example: {
      type: 'vector',
      url: 'https://example.com/source.json'
    }
  },
  sprite: 'https://example.com/sprites/sprite',
  glyphs: 'https://example.com/{fontstack}/{range}.pbf',
  layers: ['layer2', 'layer3'],
  id: 'example-simple'
};
