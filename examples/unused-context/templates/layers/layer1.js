module.exports.default = context => {
  const baseStyle = {
    id: 'land',
    type: 'background',
    paint: {
      'background-color': context.colors.backgroundLow
    }
  };

  let overrides = {};

  return {
    baseStyle,
    overrides
  };
};
