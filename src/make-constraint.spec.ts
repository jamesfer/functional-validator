import { ConstraintOptions, InternalConstraint, makeConstraint } from './make-constraint';
import { castPromise } from './utils';

const params = { setting: true };
const message = 'Default error message';
const fakeValue = 'value';
const fakeOptions: ConstraintOptions = {
  key: 'name',
  keyPath: ['name'],
  parent: {},
  root: {},
};

/**
 * Runs an internal constraint with fake data.
 */
function run(constraint: InternalConstraint): Promise<string | undefined> {
  return castPromise(constraint(fakeValue, fakeOptions));
}

describe('makeConstraint', () => {
  it('should return a function', async () => {
    const ruleA = makeConstraint({ message, constraint: () => true });
    expect(ruleA).toBeInstanceOf(Function);
  });

  it('should run the constraint', async () => {
    const constraint = jest.fn();
    await run(makeConstraint({ message, constraint }));
    expect(constraint).toHaveBeenCalledWith(fakeValue, fakeOptions, undefined);
  });

  it('should run the constraint with params', async () => {
    const constraint = jest.fn();
    await run(makeConstraint({ message, constraint, params }));
    expect(constraint).toHaveBeenCalledWith(fakeValue, fakeOptions, params);
  });

  it('should return undefined when the rule returns true', async () => {
    const result = await run(makeConstraint({ message, constraint: () => true }));
    expect(result).toBe(undefined);
  });

  it('should not run the message function when the rule returns true', async () => {
    const messageFn = jest.fn();
    const result = await run(makeConstraint({ message: messageFn, constraint: () => true }));
    expect(result).toBe(undefined);
    expect(messageFn).not.toBeCalled();
  });

  it('should return the message string when the rule returns false', async () => {
    const result = await run(makeConstraint({ message, constraint: () => false }));
    expect(result).toBe(message);
  });

  it('should run the message function when the rule returns false', async () => {
    const messageFn = jest.fn(() => message);
    const result = await run(makeConstraint({ message: messageFn, constraint: () => false }));
    expect(result).toBe(message);
    expect(messageFn).toBeCalledWith(fakeValue, fakeOptions, undefined);
  });

  it('should run the message function with params when the rule returns false', async () => {
    const messageFn = jest.fn(() => message);
    const constraint = makeConstraint({ params, message: messageFn, constraint: () => false });
    const result = await run(constraint);
    expect(result).toBe(message);
    expect(messageFn).toBeCalledWith(fakeValue, fakeOptions, params);
  });
});
