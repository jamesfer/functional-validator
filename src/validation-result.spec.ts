import { validate } from './validate';
import { greaterThan, number, string } from './rules';

describe('ValidationResult', () => {
  describe('passed()', () => {
    it('should return true if the input was valid', async () => {
      const result = await validate(7, [greaterThan(5)]);
      expect(result.passed()).toBe(true);
    });

    it('should return true if the input was invalid', async () => {
      const result = await validate(3, [greaterThan(5)]);
      expect(result.passed()).toBe(false);
    });
  });

  describe('failed()', () => {
    it('should return true if the input was invalid', async () => {
      const result = await validate(3, [greaterThan(5)]);
      expect(result.failed()).toBe(true);
    });

    it('should return true if the input was valid', async () => {
      const result = await validate(7, [greaterThan(5)]);
      expect(result.failed()).toBe(false);
    });
  });

  describe('throwIfFailed()', () => {
    it('should throw if the input was invalid', async () => {
      const result = await validate(3, [greaterThan(5)]);
      expect(result.throwIfFailed.bind(result)).toThrowError();
    });

    it('should not throw if the input was valid', async () => {
      const result = await validate(7, [greaterThan(5)]);
      expect(result.throwIfFailed.bind(result)).not.toThrowError();
    });

    it.skip('should throw an error that contains errors', () => {

    });
  });

  describe('flattened()', () => {
    it('should return an array of all validation messages in order', async () => {
      const result = await validate(3, [greaterThan(5), number(), string()]);
      const messages = result.flattened();
      expect(messages).toHaveLength(2);
      expect(messages[0]).toMatch(/must be greater than/);
      expect(messages[1]).toMatch(/must be a string/);
    });

    it('should return an empty array if there are not validation messages', async () => {
      const result = await validate(7, [greaterThan(5), number()]);
      expect(result.flattened()).toEqual([]);
    });
  });

  describe('first()', () => {
    it('should return the first error', async () => {
      const result = await validate(3, [greaterThan(5), number(), string()]);
      expect(result.first()).toMatch(/must be greater than/);
    });

    it('should return undefined if there were no errors', async () => {
      const result = await validate(7, [greaterThan(5), number()]);
      expect(result.first()).toBe(undefined);
    });
  });
});
