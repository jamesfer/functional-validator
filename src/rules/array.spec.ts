import { validate } from '../validate';
import { array, maxLength, minLength } from './array';

describe('array', () => {
  const test = (value: any) => validate(value, [array()]).passed();

  it('should pass an array', () => {
    expect(test([])).toBe(true);
  });

  it('should pass null and undefined', () => {
    expect(test(null)).toBe(true);
    expect(test(undefined)).toBe(true);
  });

  it('should fail on all other values', () => {
    ['', { length: 0 }, () => undefined, new Date()].forEach((value) => {
      expect(test(value)).toBe(false);
    });
  });
});

describe('maxLength', () => {
  const test = (value: any) => validate(value, [maxLength(5)]).passed();

  it('should pass values with a length less than the limit', () => {
    expect(test([])).toBe(true);
    expect(test('')).toBe(true);
    expect(test({ length: 0 })).toBe(true);
  });

  it('should fail values with a length greater than the limit', () => {
    expect(test([1, 2, 3, 4, 5, 6])).toBe(false);
    expect(test('abcdef')).toBe(false);
    expect(test({ length: 100 })).toBe(false);
  });

  it('should pass values with the exact right length', () => {
    expect(test([1, 2, 3, 4, 5])).toBe(true);
    expect(test('abcde')).toBe(true);
    expect(test({ length: 5 })).toBe(true);
  });

  it('should pass non-array-like value', () => {
    expect(test(null)).toBe(true);
    expect(test(undefined)).toBe(true);
    expect(test(new Date())).toBe(true);
    expect(test(() => undefined)).toBe(true);
  });
});

describe('minLength', () => {
  const test = (value: any) => validate(value, [minLength(5)]).passed();

  it('should pass values with a length greater than the limit', () => {
    expect(test([1, 2, 3, 4, 5, 6])).toBe(true);
    expect(test('abcdef')).toBe(true);
    expect(test({ length: 100 })).toBe(true);
  });

  it('should fail values with a length less than the limit', () => {
    expect(test([])).toBe(false);
    expect(test('')).toBe(false);
    expect(test({ length: 0 })).toBe(false);
  });

  it('should pass values with the exact right length', () => {
    expect(test([1, 2, 3, 4, 5])).toBe(true);
    expect(test('abcde')).toBe(true);
    expect(test({ length: 5 })).toBe(true);
  });

  it('should pass non-array-like value', () => {
    expect(test(null)).toBe(true);
    expect(test(undefined)).toBe(true);
    expect(test(new Date())).toBe(true);
    expect(test(() => undefined)).toBe(true);
  });
});
