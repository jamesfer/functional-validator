import { validate } from './validate';
import { greaterThan, string } from './rules';

// I'm not sure what tests should be here as all the functionality is covered elsewhere
// Maybe just the options.
describe.skip('validate', () => {
  describe('array of constraints', () => {
    it('should validate correct input', () => {
      const result = validate(7, [greaterThan(5)]);
      expect(result.passed());
      expect(result.flattened()).toEqual([]);
    });

    it('should validate incorrect input', () => {
      const result = validate(3, [greaterThan(5)]);
      expect(result.failed());

      const messages = result.flattened();
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatch(/must be greater than/);
    });

    it('should return messages in order', () => {
      const result = validate(3, [string(), greaterThan(5)]);

      expect(result.failed());

      const messages = result.flattened();
      expect(messages).toHaveLength(2);
      expect(messages[0]).toMatch(/must be a string/);
      expect(messages[1]).toMatch(/must be greater than/);
    });
  });
});
