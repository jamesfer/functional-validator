import { defined, notNull, required } from './presence';
import { validate } from '../validate';

describe('required', () => {
  const test = async (value: any) => (await validate(value, [required()])).passed();

  it('should fail null and undefined', async () => {
    expect(await test(null)).toBe(false);
    expect(await test(undefined)).toBe(false);
  });

  it('should pass all other values', async () => {
    expect(await test('')).toBe(true);
    expect(await test(false)).toBe(true);
    expect(await test(0)).toBe(true);
    expect(await test({})).toBe(true);
    expect(await test([])).toBe(true);
  });
});

describe('notNull', () => {
  const test = async (value: any) => (await validate(value, [notNull()])).passed();

  it('should fail null', async () => {
    expect(await test(null)).toBe(false);
  });

  it('should pass all other values', async () => {
    expect(await test(undefined)).toBe(true);
    expect(await test('')).toBe(true);
    expect(await test(false)).toBe(true);
    expect(await test(0)).toBe(true);
    expect(await test({})).toBe(true);
    expect(await test([])).toBe(true);
  });
});

describe('defined', () => {
  const test = async (value: any) => (await validate(value, [defined()])).passed();

  it('should fail undefined', async () => {
    expect(await test(undefined)).toBe(false);
  });

  it('should pass all other values', async () => {
    expect(await test(null)).toBe(true);
    expect(await test('')).toBe(true);
    expect(await test(false)).toBe(true);
    expect(await test(0)).toBe(true);
    expect(await test({})).toBe(true);
    expect(await test([])).toBe(true);
  });
});
