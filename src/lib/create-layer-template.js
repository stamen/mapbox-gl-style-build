#!/usr/bin/env node

import stringifyPretty from 'json-stringify-pretty-compact';
import { latest } from '@mapbox/mapbox-gl-style-spec';

export const createLayerTemplate = (baseLayer, variants) => {
  let layer = baseLayer;
  if (!layer) layer = Object.values(variants)[0];

  let baseStyle = stringifyPretty(layer, { indent: 2 })
    .split('\n')
    .join('\n  ');

  let allOverrides = '';

  // TODO currently making the primary differentiator style id until we sort differences
  for (const styleName in variants) {
    let overrides = {};

    if (layer && Object.keys(variants).length) {
      let variantLayer = variants[styleName];

      Object.entries(variantLayer).forEach(([k, v]) => {
        if (k === 'layout' || k === 'paint') return;
        if (JSON.stringify(v) === JSON.stringify(layer[k])) return;
        overrides[k] = v;
      });

      if (variantLayer.layout) {
        // If a property does not exist on a variant, override with the default
        const defaultLayout = Object.keys(layer.layout || {}).reduce(
          (acc, k) => {
            acc[k] = latest[`layout_${layer.type}`][k].default;
            return acc;
          },
          {}
        );

        const fullLayout = { ...defaultLayout, ...variantLayer.layout };

        Object.entries(fullLayout).forEach(([k, v]) => {
          if (JSON.stringify(v) === JSON.stringify(layer?.layout?.[k])) return;
          if (!overrides.layout) overrides.layout = {};
          overrides.layout[k] = v;
        });
      }

      if (variantLayer.paint) {
        // If a property does not exist on a variant, override with the default
        const defaultPaint = Object.keys(layer.paint || {}).reduce((acc, k) => {
          acc[k] = latest[`paint_${layer.type}`][k].default;
          return acc;
        }, {});

        const fullPaint = { ...defaultPaint, ...variantLayer.paint };

        Object.entries(fullPaint).forEach(([k, v]) => {
          if (JSON.stringify(v) === JSON.stringify(layer?.paint?.[k])) return;
          if (!overrides.paint) overrides.paint = {};
          overrides.paint[k] = v;
        });
      }
    }
    overrides = stringifyPretty(overrides, { indent: 2 })
      .split('\n')
      .join('\n    ');

    allOverrides += `${
      !!allOverrides ? ' else if' : 'if'
    } (context.styleName === '${styleName}') {
        overrides = ${overrides};
    }`;
  }

  const fileContent = `module.exports.default = (context) => {
        const baseStyle = ${baseStyle};

        let overrides = {};

        ${allOverrides}

        return {
            baseStyle,
            overrides
        };
    };`;

  return fileContent;
};

export const createVariantTemplate = style => {
  const templateStyle = {
    ...style,
    layers: style.layers.map(l => l.id)
  };

  // TODO this seems Amazon specific
  const fileContent = `module.exports.context = {
  colors: {
  },
  styleName: '${style.name}'
};

module.exports.template = ${JSON.stringify(templateStyle, null, 2)};
`;

  return fileContent;
};
