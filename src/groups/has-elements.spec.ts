import { maxLength, string } from '../rules';
import { validate } from '../validate';
import { hasElements } from './has-elements';
import pMapSeries = require('p-map-series');

const rules = [string(), maxLength(10)];

function validateEach(values: any, constraints = rules) {
  return pMapSeries(values, async value => (await validate(value, constraints)).all());
}

describe('hasElements', () => {
  it('should pass null and undefined', async () => {
    expect((await validate(null, hasElements(rules))).passed()).toBe(true);
    expect((await validate(undefined, hasElements(rules))).passed()).toBe(true);
  });

  it('should return an array of results', async () => {
    const values = [1, 2];
    const result = await validate(values, hasElements(rules));
    const expectedMessages = await validateEach(values);
    expect(result.all()).toEqual(expectedMessages);
  });

  it('should validate each object individually', async () => {
    const values = ['hello', 5, 'world'];
    const result = await validate(values, hasElements(rules));
    const expectedMessages = await validateEach(values);
    expect(result.all()).toEqual(expectedMessages);
  });

  it('should work on all array like objects', async () => {
    const string = 'hello';
    let result = await validate(string, hasElements(rules));
    expect(result.all()).toEqual(await validateEach(Array.from(string)));

    const object = { 1: 'h', 2: 'i', length: 2 };
    result = await validate(object, hasElements(rules));
    expect(result.all()).toEqual(await validateEach(Array.from(object)));
  });

  it('should correctly pass the key option', async () => {
    const constraint = jest.fn(() => undefined);
    const parent = ['a', 'b', 'c'];
    await validate(parent, hasElements([constraint]));
    parent.forEach((value, index) => {
      const options = expect.objectContaining({ key: `${index}` });
      expect(constraint).nthCalledWith(index + 1, value, options);
    });
  });

  it('should correctly pass the key path option', async () => {
    const constraint = jest.fn(() => undefined);
    const parent = ['a', 'b', 'c'];
    await validate(parent, hasElements([constraint]));
    parent.forEach((value, index) => {
      const options = expect.objectContaining({ keyPath: [`${index}`] });
      expect(constraint).nthCalledWith(index + 1, value, options);
    });
  });

  it('should correctly pass the key path option when nested', async () => {
    const constraint = jest.fn(() => undefined);
    const child = ['a', 'b', 'c'];
    const parent = [child, child, child];
    await validate(parent, hasElements(hasElements([constraint])));
    parent.forEach((_, parentIndex) => {
      child.forEach((value, childIndex) => {
        const index = parentIndex * child.length + childIndex;
        const options = expect.objectContaining({ keyPath: [`${parentIndex}`, `${childIndex}`] });
        expect(constraint).nthCalledWith(index + 1, value, options);
      });
    });
  });

  it('should correctly pass the parent option', async () => {
    const constraint = jest.fn(() => undefined);
    const parent = ['a', 'b', 'c'];
    await validate(parent, hasElements([constraint]));
    parent.forEach((value, index) => {
      const options = expect.objectContaining({ parent });
      expect(constraint).nthCalledWith(index + 1, value, options);
    });
  });
});
