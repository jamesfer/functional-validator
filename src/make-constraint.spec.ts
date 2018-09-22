import { ConstraintOptions, InternalConstraint, makeConstraint } from './make-constraint';

const params = { setting: true };
const message = 'Default error message';
const fakeValue = 'value';
const fakeOptions: ConstraintOptions = { name: 'name' };

/**
 * Runs an internal constraint with fake data.
 */
function run(constraint: InternalConstraint) {
  return constraint(fakeValue, fakeOptions);
}

describe('makeConstraint', () => {
  it('should return a function', () => {
    const ruleA = makeConstraint({ message, constraint: () => true });
    expect(ruleA).toBeInstanceOf(Function);
  });

  it('should run the constraint', () => {
    const constraint = jest.fn();
    run(makeConstraint({ message, constraint }));
    expect(constraint).toHaveBeenCalledWith(fakeValue, fakeOptions, undefined);
  });

  it('should run the constraint with params', () => {
    const constraint = jest.fn();
    run(makeConstraint({ message, constraint, params }));
    expect(constraint).toHaveBeenCalledWith(fakeValue, fakeOptions, params);
  });

  it('should return undefined when the rule returns true', () => {
    const result = run(makeConstraint({ message, constraint: () => true }));
    expect(result).toBe(undefined);
  });

  it('should not run the message function when the rule returns true', () => {
    const messageFn = jest.fn();
    const result = run(makeConstraint({ message: messageFn, constraint: () => true }));
    expect(result).toBe(undefined);
    expect(messageFn).not.toBeCalled();
  });

  it('should return the message string when the rule returns false', () => {
    const result = run(makeConstraint({ message, constraint: () => false }));
    expect(result).toBe(message);
  });

  it('should run the message function when the rule returns false', () => {
    const messageFn = jest.fn(() => message);
    const result = run(makeConstraint({ message: messageFn, constraint: () => false }));
    expect(result).toBe(message);
    expect(messageFn).toBeCalledWith(fakeValue, fakeOptions, undefined);
  });

  it('should run the message function with params when the rule returns false', () => {
    const messageFn = jest.fn(() => message);
    const result = run(makeConstraint({ params, message: messageFn, constraint: () => false }));
    expect(result).toBe(message);
    expect(messageFn).toBeCalledWith(fakeValue, fakeOptions, params);
  });
});
