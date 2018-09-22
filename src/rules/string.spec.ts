import { validate } from '../validate';
import { endsWith, startsWith, string } from './string';

describe('string', () => {
  it('should pass a string', () => {
    const result = validate('this is a string', [string()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail not a string', () => {
    [1, false, new Date(), {}].map((value) => {
      const result = validate(value, [string()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [string()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('endsWith', () => {
  it('should pass a string that ends correctly', () => {
    const result = validate('this is a string', [endsWith('string')]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a string that ends incorrectly', () => {
    const result = validate('this is a string, hey', [endsWith('string')]);
    expect(result.passed()).toBe(false);
  });

  it('should pass a value that is not a string', () => {
    const result = validate({}, [endsWith('string')]);
    expect(result.passed()).toBe(true);
  });
});

describe('startsWith', () => {
  it('should pass a string that ends correctly', () => {
    const result = validate('this is a string', [startsWith('this')]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a string that ends incorrectly', () => {
    const result = validate('hey, this is a string', [startsWith('this')]);
    expect(result.passed()).toBe(false);
  });

  it('should pass a value that is not a string', () => {
    const result = validate({}, [startsWith('string')]);
    expect(result.passed()).toBe(true);
  });
});
