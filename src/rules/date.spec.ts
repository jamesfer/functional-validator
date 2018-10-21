import { validate } from '../validate';
import { after, before, dateFormat } from './date';

describe('date', () => {
  describe('dateFormat', () => {
    const test = (value: any, format: string) => validate(value, [dateFormat(format)]).passed();

    it('should pass null and undefined', () => {
      expect(test(null, 'yy-MM-dd')).toBe(true);
      expect(test(undefined, 'yy-MM-dd')).toBe(true);
    });

    it('should accept dates that match the format', () => {
      expect(test('31-12-21', 'dd-MM-yy')).toBe(true);
      expect(test('01-01-00', 'dd-MM-yy')).toBe(true);
    });

    it('should fail dates that don\'t match the format', () => {
      expect(test('32-12-21', 'dd-MM-yy')).toBe(false);
      expect(test('01-01', 'dd-MM-yy')).toBe(false);
    });
  });

  describe('before', () => {
    const test = (value: any, date: Date | string, format: string) => (
      validate(value, [before(date, format)]).passed()
    );

    it('should pass null and undefined', () => {
      expect(test(null, '01-01-00', 'dd-MM-yy')).toBe(true);
      expect(test(undefined, '01-01-00', 'dd-MM-yy')).toBe(true);
    });

    it('should accept dates before the given one', () => {
      expect(test('01-05-00', '01-06-00', 'dd-MM-yy')).toBe(true);
      expect(test('01-01-99', '01-06-00', 'dd-MM-yy')).toBe(true);
    });

    it('should reject dates after the given one', () => {
      expect(test('01-07-00', '01-06-00', 'dd-MM-yy')).toBe(false);
      expect(test('01-01-01', '01-06-00', 'dd-MM-yy')).toBe(false);
    });

    it('should reject dates that are the same', () => {
      expect(test('01-06-00', '01-06-00', 'dd-MM-yy')).toBe(false);
    });

    it('should accept a date instance as the compare date', () => {
      // Note: months in date constructor are 0-based
      expect(test('01-05-00', new Date(2000, 5, 1), 'dd-MM-yy')).toBe(true);
      expect(test('01-01-99', new Date(2000, 5, 1), 'dd-MM-yy')).toBe(true);
    });
  });

  describe('after', () => {
    const test = (value: any, date: Date | string, format: string) => (
      validate(value, [after(date, format)]).passed()
    );

    it('should pass null and undefined', () => {
      expect(test(null, '01-01-00', 'dd-MM-yy')).toBe(true);
      expect(test(undefined, '01-01-00', 'dd-MM-yy')).toBe(true);
    });

    it('should accept dates after the given one', () => {
      expect(test('01-07-00', '01-06-00', 'dd-MM-yy')).toBe(true);
      expect(test('01-01-01', '01-06-00', 'dd-MM-yy')).toBe(true);
    });

    it('should reject dates before the given one', () => {
      expect(test('01-05-00', '01-06-00', 'dd-MM-yy')).toBe(false);
      expect(test('01-01-99', '01-06-00', 'dd-MM-yy')).toBe(false);
    });

    it('should reject dates that are the same', () => {
      expect(test('01-06-00', '01-06-00', 'dd-MM-yy')).toBe(false);
    });

    it('should accept a date instance as the compare date', () => {
      // Note: months in date constructor are 0-based
      expect(test('01-07-00', new Date(2000, 5, 1), 'dd-MM-yy')).toBe(true);
      expect(test('01-01-01', new Date(2000, 5, 1), 'dd-MM-yy')).toBe(true);
    });
  });
});
