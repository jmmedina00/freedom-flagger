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
});
