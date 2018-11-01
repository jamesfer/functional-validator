import { validate } from '../validate';
import { array, maxLength, minLength } from './array';
import pMapSeries = require('p-map-series');

describe('array', () => {
  const test = async (value: any) => (await validate(value, [array()])).passed();

  it('should pass an array', async () => {
    expect(await test([])).toBe(true);
  });

  it('should pass null and undefined', async () => {
    expect(await test(null)).toBe(true);
    expect(await test(undefined)).toBe(true);
  });

  it('should fail on all other values', async () => {
    await pMapSeries(['', { length: 0 }, () => undefined, new Date()], async (value) => {
      expect(await test(value)).toBe(false);
    });
  });
});

describe('maxLength', () => {
  const test = async (value: any) => (await validate(value, [maxLength(5)])).passed();

  it('should pass values with a length less than the limit', async () => {
    expect(await test([])).toBe(true);
    expect(await test('')).toBe(true);
    expect(await test({ length: 0 })).toBe(true);
  });

  it('should fail values with a length greater than the limit', async () => {
    expect(await test([1, 2, 3, 4, 5, 6])).toBe(false);
    expect(await test('abcdef')).toBe(false);
    expect(await test({ length: 100 })).toBe(false);
  });

  it('should pass values with the exact right length', async () => {
    expect(await test([1, 2, 3, 4, 5])).toBe(true);
    expect(await test('abcde')).toBe(true);
    expect(await test({ length: 5 })).toBe(true);
  });

  it('should pass non-array-like value', async () => {
    expect(await test(null)).toBe(true);
    expect(await test(undefined)).toBe(true);
    expect(await test(new Date())).toBe(true);
    expect(await test(() => undefined)).toBe(true);
  });
});

describe('minLength', () => {
  const test = async (value: any) => (await validate(value, [minLength(5)])).passed();

  it('should pass values with a length greater than the limit', async () => {
    expect(await test([1, 2, 3, 4, 5, 6])).toBe(true);
    expect(await test('abcdef')).toBe(true);
    expect(await test({ length: 100 })).toBe(true);
  });

  it('should fail values with a length less than the limit', async () => {
    expect(await test([])).toBe(false);
    expect(await test('')).toBe(false);
    expect(await test({ length: 0 })).toBe(false);
  });

  it('should pass values with the exact right length', async () => {
    expect(await test([1, 2, 3, 4, 5])).toBe(true);
    expect(await test('abcde')).toBe(true);
    expect(await test({ length: 5 })).toBe(true);
  });

  it('should pass non-array-like value', async () => {
    expect(await test(null)).toBe(true);
    expect(await test(undefined)).toBe(true);
    expect(await test(new Date())).toBe(true);
    expect(await test(() => undefined)).toBe(true);
  });
});
