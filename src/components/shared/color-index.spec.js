import { describe, expect, test } from 'vitest';
import { placeColorsOnIndexes } from './color-index';

describe('Color on index placing', () => {
  test('should place "colors" in specific "fields" of the data, leaving the rest intact', () => {
    const props = {
      size: 35,
      foo: 'bar',
      bar: 2,
      baz: '1',
    };

    const expected = {
      size: 35,
      foo: 'bar',
      bar: '#aaa',
      baz: '#fff',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['bar', 'baz'],
      colors: ['#fff', '#aaa'],
    });
    expect(actual).toEqual(expected);
  });

  test('should be able to work with any number of colors and indexes', () => {
    const props = {
      size: 35,
      topLeft: '4',
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 35,
      topLeft: '#111',
      topRight: '#444',
      bottomRight: '#000',
      bottomLeft: '#fff',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: ['#fff', '#aaa', '#000', '#111', '#444'],
    });
    expect(actual).toEqual(expected);
  });

  test('should take "0" as "no color here"', () => {
    const props = {
      size: 35,
      foo: 1,
      bar: 0,
      baz: 2,
    };

    const expected = {
      size: 35,
      foo: '#fff',
      baz: '#aaa',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['foo', 'bar', 'baz'],
      colors: ['#fff', '#aaa'],
    });
    expect(actual).toEqual(expected);
  });

  test('should take excessive index as "no color here"', () => {
    const props = {
      size: 35,
      foo: 1,
      bar: 2,
      baz: 3,
    };

    const expected = {
      size: 35,
      foo: '#fff',
      bar: '#aaa',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['foo', 'bar', 'baz'],
      colors: ['#fff', '#aaa'],
    });
    expect(actual).toEqual(expected);
  });

  test('should take an invalid string as "no color here"', () => {
    const props = {
      size: 35,
      topLeft: 2,
      topRight: '0',
      bottomRight: 'qwe',
      bottomLeft: 1,
    };

    const expected = {
      size: 35,
      topLeft: '#aaa',
      bottomLeft: '#fff',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: ['#fff', '#aaa'],
    });
    expect(actual).toEqual(expected);
  });

  test('should add colors to its own field and leave the rest alone if no fields are specified', () => {
    const props = {
      size: 35,
      topLeft: 2,
      topRight: '0',
      bottomRight: 'qwe',
      bottomLeft: 1,
    };

    const actual = placeColorsOnIndexes(props, {
      fields: [],
      colors: ['#fff', '#aaa'],
    });
    expect(actual).toEqual({ ...props, colors: ['#fff', '#aaa'] });
  });

  test('should leave data alone if no colors are provided', () => {
    const props = {
      size: 35,
      topLeft: 2,
      topRight: '0',
      bottomRight: 'qwe',
      bottomLeft: 1,
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: [],
    });
    expect(actual).toEqual(props);
  });

  test('should scale fields by given ratio, assuming they have not been adapted', () => {
    const props = {
      size: 35,
      foo: 120,
      topLeft: 4,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 17.5,
      foo: 60,
      topLeft: '#111',
      topRight: '#444',
      bottomRight: '#000',
      bottomLeft: '#fff',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: ['#fff', '#aaa', '#000', '#111', '#444'],
      scaled: ['topLeft', 'size', 'foo'],
      scaleRatio: 0.5,
    });

    expect(actual).toEqual(expected);
  });

  test('should not proceed with scaling if ratio is missing', () => {
    const props = {
      size: 35,
      foo: 120,
      topLeft: 4,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 35,
      foo: 120,
      topLeft: '#111',
      topRight: '#444',
      bottomRight: '#000',
      bottomLeft: '#fff',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: ['#fff', '#aaa', '#000', '#111', '#444'],
      scaled: ['size', 'foo'],
    });
    expect(actual).toEqual(expected);
  });

  test('should scale given data, even when there are no adaptable fields', () => {
    const props = {
      size: 35,
      foo: 120,
      topLeft: 4,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 17.5,
      foo: 60,
      topLeft: 2,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
      colors: ['#fff', '#aaa', '#000', '#111', '#444'],
    };

    const actual = placeColorsOnIndexes(props, {
      fields: [],
      colors: ['#fff', '#aaa', '#000', '#111', '#444'],
      scaled: ['topLeft', 'size', 'foo'],
      scaleRatio: 0.5,
    });

    expect(actual).toEqual(expected);
  });

  test('should scale given data, even when there are no colors', () => {
    const props = {
      size: 35,
      foo: 120,
      topLeft: 4,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 17.5,
      foo: 60,
      topLeft: 2,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const actual = placeColorsOnIndexes(props, {
      fields: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
      colors: [],
      scaled: ['topLeft', 'size', 'foo'],
      scaleRatio: 0.5,
    });

    expect(actual).toEqual(expected);
  });

  test('should scale given data, even when there are no colors nor adapted fields', () => {
    const props = {
      size: 35,
      foo: 120,
      topLeft: 4,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
    };

    const expected = {
      size: 17.5,
      foo: 60,
      topLeft: 2,
      topRight: '5',
      bottomRight: '3',
      bottomLeft: '1',
      colors: [],
    };

    const actual = placeColorsOnIndexes(props, {
      fields: [],
      colors: [],
      scaled: ['topLeft', 'size', 'foo'],
      scaleRatio: 0.5,
    });

    expect(actual).toEqual(expected);
  });
});
