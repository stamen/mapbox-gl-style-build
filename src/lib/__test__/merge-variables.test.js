import { mergeVariables } from '../merge-variables';

describe('mergeVariables', () => {
  test('works with one object', () => {
    const variables = { backgroundLow: 'red' };
    const actual = mergeVariables(variables);
    expect(actual).toEqual(variables);
  });

  test('works with two objects', () => {
    const expected = {
      backgroundLow: 'red',
      backgroundHigh: 'green'
    };

    const actual = mergeVariables(
      { backgroundLow: 'red', backgroundHigh: 'pink' },
      { backgroundHigh: 'green' }
    );

    expect(actual).toEqual(expected);
  });

  test('works with nested variables', () => {
    const expected = {
      background: {
        low: 'red',
        high: 'green'
      },
      roads: {
        major: 'yellow',
        minor: 'white'
      }
    };

    const actual = mergeVariables(
      {
        background: {
          low: 'red',
          high: 'purple'
        },
        roads: {
          major: 'yellow',
          minor: 'white'
        }
      },
      {
        background: { high: 'green' } // Just tweak one nested property
      }
    );

    expect(actual).toEqual(expected);
  });

  test('works with array values', () => {
    const expected = {
      backgroundLow: 'red',
      backgroundHigh: 'pink',
      roadOpacity: ['interpolate', ['linear'], ['zoom'], 2, 0, 12, 1]
    };

    const actual = mergeVariables(
      {
        backgroundLow: 'red',
        backgroundHigh: 'pink',
        roadOpacity: 0.75
      },
      {
        roadOpacity: ['interpolate', ['linear'], ['zoom'], 2, 0, 12, 1]
      }
    );

    expect(actual).toEqual(expected);
  });
});
