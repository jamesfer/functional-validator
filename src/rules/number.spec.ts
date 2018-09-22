import {
  finite,
  greaterEqualTo,
  greaterThan,
  integer,
  lessEqualTo,
  lessThan,
  number,
} from './number';
import { validate } from '../validate';

describe('number', () => {
  it('should pass a number', () => {
    const result = validate(10.5, [number()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail not a number', () => {
    ['1', false, new Date(), {}].forEach((value) => {
      const result = validate(value, [number()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass NaN and Infinity', () => {
    [NaN, Infinity].forEach((value) => {
      const result = validate(value, [number()]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [number()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('integer', () => {
  it('should pass an integer', () => {
    const result = validate(10, [integer()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a float', () => {
    const result = validate(10.5, [integer()]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [integer()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('finite', () => {
  it('should pass a number', () => {
    const result = validate(12.5, [finite()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail NaN and Infinity', () => {
    [NaN, Infinity].forEach((value) => {
      const result = validate(value, [finite()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [finite()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('greaterThan', () => {
  it('should pass a number greater than the given one', () => {
    const result = validate(20, [greaterThan(10)]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a number less than the given one', () => {
    [5, 10].forEach((value) => {
      const result = validate(value, [greaterThan(10)]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [greaterThan(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('greaterEqualTo', () => {
  it('should pass a number greater or equal to the given one', () => {
    [20, 10].forEach((value) => {
      const result = validate(value, [greaterEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should fail a number less than the given one', () => {
    const result = validate(5, [greaterEqualTo(10)]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [greaterEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('lessThan', () => {
  it('should pass a number less than the given one', () => {
    const result = validate(5, [lessThan(10)]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a number greater than the given one', () => {
    [20, 10].forEach((value) => {
      const result = validate(value, [lessThan(10)]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [lessThan(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('lessEqualTo', () => {
  it('should pass a number less or equal to the given one', () => {
    [5, 10].forEach((value) => {
      const result = validate(value, [lessEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should fail a number greater than the given one', () => {
    const result = validate(20, [lessEqualTo(10)]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', () => {
    [null, undefined].forEach((value) => {
      const result = validate(value, [lessEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});
