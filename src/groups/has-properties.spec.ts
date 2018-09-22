import { validate } from '../validate';
import { hasProperties } from './has-properties';
import { greaterThan, required, string } from '../rules';
import { assertType, returns } from '../type-assertions';
import { hasElements } from './has-elements';
import { mapValues, Dictionary } from 'lodash';

describe('object', () => {
  const requiredString = [required(), string()];

  it('should return messages in order', () => {
    const test = { firstName: 1 };
    const rules = { firstName: [string(), greaterThan(2)] };
    const result = validate(test, hasProperties(rules));
    const messages = result.flattened();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatch(/must be a string/);
    expect(messages[1]).toMatch(/must be greater than/);
  });

  it('should not return properties that have passed validation', () => {
    const test = { firstName: 'tim' };
    const rules = { firstName: requiredString, lastName: requiredString };
    const result = validate(test, hasProperties(rules)).all();
    if (result) {
      expect(result.firstName).toBe(undefined);
      expect(result.hasOwnProperty('firstName')).toBe(false);
      expect('firstName' in result).toBe(false);
    }
  });

  it('should retain the shape of the input in the message object', () => {
    const test = { firstName: 'tim' };
    const rules = { firstName: requiredString, lastName: requiredString };
    const result = validate(test, hasProperties(rules)).all();
    if (result) {
      assertType<string[] | undefined>(result.firstName);
      assertType<typeof result.firstName>(returns<string[] | undefined>());

      assertType<string[] | undefined>(result.lastName);
      assertType<typeof result.lastName>(returns<string[] | undefined>());
    }
  });

  it('should retain the shape of child objects of the input in the message object', () => {
    const test = { parent: { firstName: 'tim' } };
    const result = validate(test, hasProperties({
      parent: hasProperties({ firstName: requiredString }),
    })).all();

    if (result) {
      assertType<{ parent?: { firstName?: string[] } }>(result);
      assertType<typeof result>(returns<{ parent?: { firstName?: string[] } }>());

      const parent = result.parent;
      if (parent) {
        assertType<{ firstName?: string[] }>(parent);
        assertType<typeof parent>(returns<{ firstName?: string[] }>());

        const firstName = parent.firstName;
        assertType<string[] | undefined>(firstName);
        assertType<typeof firstName>(returns<string[] | undefined>());
      }
    }
  });

  it('should work', () => {
    const result = validate(
      { firstName: 'tim' },
      hasProperties({
        firstName: [required()],
        lastName: [required()],
      }),
    );
    expect(result.passed()).toBe(false);

    const messages = result.flattened();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/required/);
  });

  it('should correctly pass the key option', () => {
    const constraint = jest.fn(() => undefined);
    const parent: Dictionary<number> = { a: 1, b: 2 };
    validate(parent, hasProperties(mapValues(parent, () => constraint)));
    Object.keys(parent).forEach((key, index) => {
      const options = expect.objectContaining({ key });
      expect(constraint).nthCalledWith(index + 1, parent[key], options);
    });
  });

  it('should correctly pass the key path option', () => {
    const constraint = jest.fn(() => undefined);
    const parent: Dictionary<number> = { a: 1, b: 2 };
    validate(parent, hasProperties(mapValues(parent, () => constraint)));
    Object.keys(parent).forEach((key, index) => {
      const options = expect.objectContaining({ keyPath: [key] });
      expect(constraint).nthCalledWith(index + 1, parent[key], options);
    });
  });

  it('should correctly pass the key path option when nested', () => {
    const constraint = jest.fn(() => undefined);
    const child: Dictionary<number> = { a: 1, b: 2 };
    const parent: Dictionary<Dictionary<number>> = { c: child, d: child };
    const childConstraints = hasProperties(mapValues(child, () => constraint));
    validate(parent, hasProperties(mapValues(parent, () => childConstraints)));
    Object.keys(parent).forEach((parentKey, parentIndex) => {
      Object.keys(child).forEach((childKey, childIndex) => {
        const index = parentIndex * Object.keys(child).length + childIndex;
        const options = expect.objectContaining({ keyPath: [parentKey, childKey] });
        expect(constraint).nthCalledWith(index + 1, parent[parentKey][childKey], options);
      });
    });
  });

  it('should correctly pass the parent option', () => {
    const constraint = jest.fn(() => undefined);
    const parent: Dictionary<number> = { a: 1, b: 2 };
    validate(parent, hasProperties(mapValues(parent, () => constraint)));
    Object.keys(parent).forEach((key, index) => {
      const options = expect.objectContaining({ parent });
      expect(constraint).nthCalledWith(index + 1, parent[key], options);
    });
  });
});
