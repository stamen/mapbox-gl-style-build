module.exports.default = context => {
  const baseStyle = {
    id: 'water',
    type: 'fill',
    source: context.sources.root,
    'source-layer': 'water',
    minzoom: 16,
    paint: {
      'fill-color': context.colors.water
    }
  };

  let overrides = {};

  return {
    baseStyle,
    overrides
  };
};
