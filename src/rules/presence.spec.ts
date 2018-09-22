import { defined, notNull, required } from './presence';
import { validate } from '../validate';


describe('required', () => {
  const test = (value: any) => validate(value, [required()]).passed();

  it('should fail null and undefined', () => {
    expect(test(null)).toBe(false);
    expect(test(undefined)).toBe(false);
  });

  it('should pass all other values', () => {
    expect(test('')).toBe(true);
    expect(test(false)).toBe(true);
    expect(test(0)).toBe(true);
    expect(test({})).toBe(true);
    expect(test([])).toBe(true);
  });
});

describe('notNull', () => {
  const test = (value: any) => validate(value, [notNull()]).passed();

  it('should fail null', () => {
    expect(test(null)).toBe(false);
  });

  it('should pass all other values', () => {
    expect(test(undefined)).toBe(true);
    expect(test('')).toBe(true);
    expect(test(false)).toBe(true);
    expect(test(0)).toBe(true);
    expect(test({})).toBe(true);
    expect(test([])).toBe(true);
  });
});

describe('defined', () => {
  const test = (value: any) => validate(value, [defined()]).passed();

  it('should fail undefined', () => {
    expect(test(undefined)).toBe(false);
  });

  it('should pass all other values', () => {
    expect(test(null)).toBe(true);
    expect(test('')).toBe(true);
    expect(test(false)).toBe(true);
    expect(test(0)).toBe(true);
    expect(test({})).toBe(true);
    expect(test([])).toBe(true);
  });
});
