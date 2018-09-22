import { isFunction } from 'lodash';

/**
 * A rule message function is a way to create dynamic messages based on the user's input.
 */
export type RuleMessageFn<P = void> = (value: any, options: ConstraintOptions, params: P) => string;

/**
 * A rule's message can be a simple string, or a function that accepts the extra options that
 * the validator passed to it.
 */
export type RuleMessage<P = void> = string | RuleMessageFn<P>;

/**
 * The options that are passed to a constraint when it is evaluated against some data.
 */
export interface ConstraintOptions {
  key: string;
  keyPath: string[];
  parent: any;
  root: any;
}

/**
 * The options that can be passed to the make constraint function.
 */
export interface GlobalOptions<P = void> {
  message?: RuleMessage<P>;
}

/**
 * A constraint is a single check run against the data to confirm that it is valid.
 */
export type Constraint<P = void> = (value: any, options: ConstraintOptions, params: P) => boolean;

/**
 * Validation function that returns multiple messages
 */
export type GroupConstraint<T> = (value: any, options: ConstraintOptions) => T | undefined;

/**
 * An internal constraint the function that is actually run by the validator. It usually wraps a
 * constraint and handles evaluating the message function.
 */
export type InternalConstraint = GroupConstraint<string>;

/**
 * Evaluates a message function to produce a string.
 */
function produceMessage<P>(
  message: RuleMessage<P> | undefined,
  value: any,
  options: ConstraintOptions,
  params: P,
): string | undefined {
  return isFunction(message) ? message(value, options, params) : message;
}

/**
 * Constructs an internal constraint function. This is used by rules to produce a function that can
 * be run by the validator.
 */
/* tslint:disable max-line-length */
export function makeConstraint(options: { message: RuleMessage<undefined>, constraint: Constraint<undefined> }): InternalConstraint;
export function makeConstraint<P>(options: { message: RuleMessage<P>, constraint: Constraint<P>, params: P }): InternalConstraint;
/* tslint:enable max-line-length */
export function makeConstraint<P>({ message, constraint, params }: {
  message: RuleMessage<P>,
  constraint: Constraint<P>,
  params?: P,
}): InternalConstraint {
  return (value, constraintOptions) => {
    return !constraint(value, constraintOptions, params as P)
      ? produceMessage(message, value, constraintOptions, params as P)
      : undefined;
  };
}
