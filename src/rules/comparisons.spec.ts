import { validate } from '../validate';
import { conformsTo, equals, equalTo, oneOf } from './comparisons';
import { hasProperties } from '../groups';
import { Constraint } from '../make-constraint';

describe('comparisons', () => {
  describe('equals', () => {
    const test = (value: any, expected: any) => validate(value, [equals(expected)]).passed();

    it('should pass null and undefined', () => {
      expect(test(null, 123)).toBe(true);
      expect(test(undefined, 123)).toBe(true);
    });

    it('should accept any value that is exactly equal to the expected value', () => {
      expect(test('hello', 'hello')).toBe(true);
      const obj = { a: 1 };
      expect(test(obj, obj)).toBe(true);
    });

    it('should reject any values that are not identical', () => {
      expect(test('hello', 'world')).toBe(false);
      expect(test({ a: 1 }, { a: 1 })).toBe(false);
      expect(test('1', 1)).toBe(false);
    });
  });

  describe('equalTo', () => {
    const test = (value: any) => validate(value, hasProperties({
      confirmPassword: [equalTo('password')],
    })).passed();

    it('should pass null and undefined', () => {
      expect(test({ password: '123', confirmPassword: null })).toBe(true);
      expect(test({ password: '123', confirmPassword: undefined })).toBe(true);
      expect(test({ password: '123' })).toBe(true);
    });

    it('should pass when values match', () => {
      expect(test({ password: '123', confirmPassword: '123' })).toBe(true);
      const obj = { a: 1 };
      expect(test({ password: obj, confirmPassword: obj })).toBe(true);
    });

    it('should fail when values don\'t match', () => {
      expect(test({ password: '123', confirmPassword: 'hello' })).toBe(false);
      expect(test({ password: 123, confirmPassword: '123' })).toBe(false);
      expect(test({ password: { a: 1 }, confirmPassword: { a: 1 } })).toBe(false);
      expect(test({ confirmPassword: '123' })).toBe(false);
    });
  });

  describe('oneOf', () => {
    const obj = { a: 1 };
    const test = (value: any) => validate(value, [oneOf([1, 'a', obj])]).passed();

    it('should pass values that in the expected list', () => {
      expect(test(1)).toBe(true);
      expect(test('a')).toBe(true);
      expect(test(obj)).toBe(true);
    });

    it('should pass null and undefined', () => {
      expect(test(null)).toBe(true);
      expect(test(undefined)).toBe(true);
    });

    it('should reject any values that are not identical', () => {
      expect(test('1')).toBe(false);
      expect(test({ a: 1 })).toBe(false);
    });
  });

  describe('conformsTo', () => {
    const equals5: Constraint = value => value === 5;
    const test = (value: any, constraint = equals5) => validate(value, [
      conformsTo(constraint, 'Value must equal 5'),
    ]).passed();

    it('should pass null and undefined', () => {
      expect(test(null)).toBe(true);
      expect(test(undefined)).toBe(true);
    });

    it('should call the given constraint', () => {
      const constraint = jest.fn(equals5);
      test(5, constraint);
      expect(constraint).toBeCalledWith(5, expect.anything(), undefined);
    });

    it('should fail when invalid values are tested', () => {
      expect(test(3)).toBe(false);
      expect(test('5')).toBe(false);
      expect(test(new Date())).toBe(false);
    });
  });
});
