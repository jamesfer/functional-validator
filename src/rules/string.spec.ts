import pMapSeries from 'p-map-series';
import { validate } from '../validate';
import { endsWith, startsWith, string } from './string';

describe('string', () => {
  it('should pass a string', async () => {
    const result = await validate('this is a string', [string()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail not a string', async () => {
    await pMapSeries([1, false, new Date(), {}], async (value) => {
      const result = await validate(value, [string()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [string()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('endsWith', () => {
  it('should pass a string that ends correctly', async () => {
    const result = await validate('this is a string', [endsWith('string')]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a string that ends incorrectly', async () => {
    const result = await validate('this is a string, hey', [endsWith('string')]);
    expect(result.passed()).toBe(false);
  });

  it('should pass a value that is not a string', async () => {
    const result = await validate({}, [endsWith('string')]);
    expect(result.passed()).toBe(true);
  });
});

describe('startsWith', () => {
  it('should pass a string that ends correctly', async () => {
    const result = await validate('this is a string', [startsWith('this')]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a string that ends incorrectly', async () => {
    const result = await validate('hey, this is a string', [startsWith('this')]);
    expect(result.passed()).toBe(false);
  });

  it('should pass a value that is not a string', async () => {
    const result = await validate({}, [startsWith('string')]);
    expect(result.passed()).toBe(true);
  });
});
