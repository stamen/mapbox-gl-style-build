import { removeEmpty, deleteProp } from '../primitive-utils';

describe('removeEmpty', () => {
  let obj = {};
  test('returns empty object for empty object', () => {
    const actual = removeEmpty(obj);
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test('returns empty object for empty objects nested', () => {
    obj = { a: { b: {} } };
    const actual = removeEmpty(obj);
    const expected = {};
    expect(actual).toEqual(expected);
  });

  test('removes empty objects in object', () => {
    obj = { a: 'hello', b: {} };
    const actual = removeEmpty(obj);
    const expected = { a: 'hello' };
    expect(actual).toEqual(expected);
  });

  test('removes empty objects nested in object', () => {
    obj = { a: 'hello', b: { ba: { c: {} }, bb: 'hello' } };
    const actual = removeEmpty(obj);
    const expected = { a: 'hello', b: { bb: 'hello' } };
    expect(actual).toEqual(expected);
  });

  test('removes empty objects nested in object recursively', () => {
    obj = { a: 'hello', b: { c: { d: { e: { f: { g: {} } } } } } };
    const actual = removeEmpty(obj);
    const expected = { a: 'hello' };
    expect(actual).toEqual(expected);
  });
});

describe('deleteProp', () => {
  let obj = {};
  test('deletes value at path', () => {
    obj = { a: 'a', b: { c: { d: 'deleteme', e: 'saveme' } } };
    const actual = deleteProp(obj, ['b', 'c', 'd']);
    const expected = { a: 'a', b: { c: { e: 'saveme' } } };
    expect(actual).toEqual(expected);
  });

  test('returns original object if path does not exist', () => {
    obj = { a: 'a', b: 'b' };
    const actual = deleteProp(obj, ['c', 'd']);
    const expected = obj;
    expect(actual).toEqual(expected);
  });
});
