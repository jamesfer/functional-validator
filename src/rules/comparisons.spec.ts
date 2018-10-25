import { validate } from '../validate';
import { conformsTo, equals, equalTo, oneOf } from './comparisons';
import { hasProperties } from '../groups';
import { Constraint } from '../make-constraint';

describe('comparisons', () => {
  describe('equals', () => {
    const test = async (value: any, expected: any) => (
      (await validate(value, [equals(expected)])).passed()
    );

    it('should pass null and undefined', async () => {
      expect(await test(null, 123)).toBe(true);
      expect(await test(undefined, 123)).toBe(true);
    });

    it('should accept any value that is exactly equal to the expected value', async () => {
      expect(await test('hello', 'hello')).toBe(true);
      const obj = { a: 1 };
      expect(await test(obj, obj)).toBe(true);
    });

    it('should reject any values that are not identical', async () => {
      expect(await test('hello', 'world')).toBe(false);
      expect(await test({ a: 1 }, { a: 1 })).toBe(false);
      expect(await test('1', 1)).toBe(false);
    });
  });

  describe('equalTo', async () => {
    const test = async (value: any) => (
      (await validate(value, hasProperties({ confirmPassword: [equalTo('password')] }))).passed()
    );

    it('should pass null and undefined', async () => {
      expect(await test({ password: '123', confirmPassword: null })).toBe(true);
      expect(await test({ password: '123', confirmPassword: undefined })).toBe(true);
      expect(await test({ password: '123' })).toBe(true);
    });

    it('should pass when values match', async () => {
      expect(await test({ password: '123', confirmPassword: '123' })).toBe(true);
      const obj = { a: 1 };
      expect(await test({ password: obj, confirmPassword: obj })).toBe(true);
    });

    it('should fail when values don\'t match', async () => {
      expect(await test({ password: '123', confirmPassword: 'hello' })).toBe(false);
      expect(await test({ password: 123, confirmPassword: '123' })).toBe(false);
      expect(await test({ password: { a: 1 }, confirmPassword: { a: 1 } })).toBe(false);
      expect(await test({ confirmPassword: '123' })).toBe(false);
    });
  });

  describe('oneOf', () => {
    const obj = { a: 1 };
    const test = async (value: any) => (await validate(value, [oneOf([1, 'a', obj])])).passed();

    it('should pass values that in the expected list', async () => {
      expect(await test(1)).toBe(true);
      expect(await test('a')).toBe(true);
      expect(await test(obj)).toBe(true);
    });

    it('should pass null and undefined', async () => {
      expect(await test(null)).toBe(true);
      expect(await test(undefined)).toBe(true);
    });

    it('should reject any values that are not identical', async () => {
      expect(await test('1')).toBe(false);
      expect(await test({ a: 1 })).toBe(false);
    });
  });

  describe('conformsTo', () => {
    const equals5: Constraint = value => value === 5;
    const test = async (value: any, constraint = equals5) => (
      (await validate(value, [conformsTo(constraint, 'Value must equal 5')])).passed()
    );

    it('should pass null and undefined', async () => {
      expect(await test(null)).toBe(true);
      expect(await test(undefined)).toBe(true);
    });

    it('should call the given constraint', async () => {
      const constraint = jest.fn(equals5);
      await test(5, constraint);
      expect(constraint).toBeCalledWith(5, expect.anything(), undefined);
    });

    it('should fail when invalid values are tested', async () => {
      expect(await test(3)).toBe(false);
      expect(await test('5')).toBe(false);
      expect(await test(new Date())).toBe(false);
    });
  });
});
