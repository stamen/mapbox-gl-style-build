import { modifyNumberVariables } from '../modify-number-variables';

describe('modifyNumberVariables', () => {
  test('simple divide', () => {
    const variables = { number: 12 };
    const actual = modifyNumberVariables(variables, '/', 3, {});
    const expected = { number: 4 };
    expect(actual).toEqual(expected);
  });

  test('simple add', () => {
    const variables = { number: 12 };
    const actual = modifyNumberVariables(variables, '+', 3, {});
    const expected = { number: 15 };
    expect(actual).toEqual(expected);
  });

  test('simple subtract', () => {
    const variables = { number: 12 };
    const actual = modifyNumberVariables(variables, '-', 3, {});
    const expected = { number: 9 };
    expect(actual).toEqual(expected);
  });

  test('simple multiply', () => {
    const variables = { number: 3 };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = { number: 6 };
    expect(actual).toEqual(expected);
  });

  test('error on unsupported operator', () => {
    const variables = { number: 3 };
    const actual = () => modifyNumberVariables(variables, '%', 2, {});
    expect(actual).toThrow('% is not a valid operator.');
  });

  test('interpolate multiply', () => {
    const variables = {
      number: ['interpolate', ['linear'], ['zoom'], 5, 3, 10, 4]
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      number: ['interpolate', ['linear'], ['zoom'], 5, 6, 10, 8]
    };
    expect(actual).toEqual(expected);
  });

  test('step multiply', () => {
    const variables = {
      number: ['step', ['zoom'], 3, 10, 4]
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      number: ['step', ['zoom'], 6, 10, 8]
    };
    expect(actual).toEqual(expected);
  });

  test('match multiply', () => {
    const variables = {
      number: ['match', ['get', 'class'], 'primary', 3, 'secondary', 4, 5]
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      number: ['match', ['get', 'class'], 'primary', 6, 'secondary', 8, 10]
    };
    expect(actual).toEqual(expected);
  });

  test('case multiply', () => {
    const variables = {
      number: [
        'case',
        ['==', ['get', 'class'], 'primary'],
        3,
        ['==', ['get', 'class'], 'secondary'],
        4,
        5
      ]
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      number: [
        'case',
        ['==', ['get', 'class'], 'primary'],
        6,
        ['==', ['get', 'class'], 'secondary'],
        8,
        10
      ]
    };
    expect(actual).toEqual(expected);
  });

  test('nested interpolate match multiply', () => {
    const variables = {
      number: [
        'interpolate',
        ['linear'],
        ['zoom'],
        5,
        ['match', ['get', 'class'], 'primary', 3, 'secondary', 4, 5],
        10,
        6
      ]
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      number: [
        'interpolate',
        ['linear'],
        ['zoom'],
        5,
        ['match', ['get', 'class'], 'primary', 6, 'secondary', 8, 10],
        10,
        12
      ]
    };
    expect(actual).toEqual(expected);
  });

  test('nested variables multiply', () => {
    const variables = {
      groupA: {
        subGroupA: 3
      },
      groupB: 2,
      groupC: {
        subGroupC: {
          lineWidth: 7
        }
      }
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      groupA: {
        subGroupA: 6
      },
      groupB: 4,
      groupC: {
        subGroupC: {
          lineWidth: 14
        }
      }
    };
    expect(actual).toEqual(expected);
  });

  test('nested variables nested interpolate multiply', () => {
    const variables = {
      groupA: {
        subGroupA: [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          ['match', ['get', 'class'], 'primary', 3, 'secondary', 4, 5],
          10,
          6
        ]
      },
      groupB: ['interpolate', ['linear'], ['zoom'], 5, 3, 10, 6],
      groupC: {
        subGroupC: {
          lineWidth: [
            'match',
            ['get', 'class'],
            'primary',
            3,
            'secondary',
            4,
            5
          ]
        }
      }
    };
    const actual = modifyNumberVariables(variables, '*', 2, {});
    const expected = {
      groupA: {
        subGroupA: [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          ['match', ['get', 'class'], 'primary', 6, 'secondary', 8, 10],
          10,
          12
        ]
      },
      groupB: ['interpolate', ['linear'], ['zoom'], 5, 6, 10, 12],
      groupC: {
        subGroupC: {
          lineWidth: [
            'match',
            ['get', 'class'],
            'primary',
            6,
            'secondary',
            8,
            10
          ]
        }
      }
    };
    expect(actual).toEqual(expected);
  });

  test('handles literal values not contained in variable object', () => {
    const variable = 3;
    const actual = modifyNumberVariables(variable, '*', 2, {});
    const expected = 6;
    expect(actual).toEqual(expected);
  });

  test('handles expression values not contained in variable object', () => {
    const variable = [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      ['match', ['get', 'class'], 'primary', 3, 'secondary', 4, 5],
      10,
      6
    ];
    const actual = modifyNumberVariables(variable, '*', 2, {});
    const expected = [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      ['match', ['get', 'class'], 'primary', 6, 'secondary', 8, 10],
      10,
      12
    ];
    expect(actual).toEqual(expected);
  });

  test('passes through values of wrong type', () => {
    const variables = { number: 'abc' };
    const actual = modifyNumberVariables(variables, '*', 3, {});
    const expected = { number: 'abc' };
    expect(actual).toEqual(expected);
  });

  test('handles options: round', () => {
    const variables = { number: 3.12345 };
    const actual = modifyNumberVariables(variables, '*', 2, { round: true });
    const expected = { number: 6 };
    expect(actual).toEqual(expected);
  });

  test('handles options: floor', () => {
    const variables = { number: 3.32345 };
    const actual = modifyNumberVariables(variables, '*', 2, { floor: true });
    const expected = { number: 6 };
    expect(actual).toEqual(expected);
  });

  test('handles options: ceil', () => {
    const variables = { number: 3.12345 };
    const actual = modifyNumberVariables(variables, '*', 2, { ceil: true });
    const expected = { number: 7 };
    expect(actual).toEqual(expected);
  });

  test('handles options: toFixed', () => {
    const variables = { number: 3.12345 };
    const actual = modifyNumberVariables(variables, '*', 2, { toFixed: 2 });
    const expected = { number: 6.25 };
    expect(actual).toEqual(expected);
  });
});
