import pMapSeries from 'p-map-series';
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
  it('should pass a number', async () => {
    const result = await validate(10.5, [number()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail not a number', async () => {
    await pMapSeries(['1', false, new Date(), {}], async (value) => {
      const result = await validate(value, [number()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass NaN and Infinity', async () => {
    await pMapSeries([NaN, Infinity], async (value) => {
      const result = await validate(value, [number()]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [number()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('integer', () => {
  it('should pass an integer', async () => {
    const result = await validate(10, [integer()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a float', async () => {
    const result = await validate(10.5, [integer()]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [integer()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('finite', () => {
  it('should pass a number', async () => {
    const result = await validate(12.5, [finite()]);
    expect(result.passed()).toBe(true);
  });

  it('should fail NaN and Infinity', async () => {
    await pMapSeries([NaN, Infinity], async (value) => {
      const result = await validate(value, [finite()]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [finite()]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('greaterThan', () => {
  it('should pass a number greater than the given one', async () => {
    const result = await validate(20, [greaterThan(10)]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a number less than the given one', async () => {
    await pMapSeries([5, 10], async (value) => {
      const result = await validate(value, [greaterThan(10)]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [greaterThan(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('greaterEqualTo', () => {
  it('should pass a number greater or equal to the given one', async () => {
    await pMapSeries([20, 10], async (value) => {
      const result = await validate(value, [greaterEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should fail a number less than the given one', async () => {
    const result = await validate(5, [greaterEqualTo(10)]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [greaterEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('lessThan', () => {
  it('should pass a number less than the given one', async () => {
    const result = await validate(5, [lessThan(10)]);
    expect(result.passed()).toBe(true);
  });

  it('should fail a number greater than the given one', async () => {
    await pMapSeries([20, 10], async (value) => {
      const result = await validate(value, [lessThan(10)]);
      expect(result.passed()).toBe(false);
    });
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [lessThan(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});

describe('lessEqualTo', () => {
  it('should pass a number less or equal to the given one', async () => {
    await pMapSeries([5, 10], async (value) => {
      const result = await validate(value, [lessEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });

  it('should fail a number greater than the given one', async () => {
    const result = await validate(20, [lessEqualTo(10)]);
    expect(result.passed()).toBe(false);
  });

  it('should pass null and undefined', async () => {
    await pMapSeries([null, undefined], async (value) => {
      const result = await validate(value, [lessEqualTo(10)]);
      expect(result.passed()).toBe(true);
    });
  });
});
