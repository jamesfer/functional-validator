import pMapSeries from 'p-map-series';
import { ConstraintOptions, GroupConstraint, InternalConstraint } from './make-constraint';
import { ValidationResult } from './validation-result';
import { castPromise } from './utils';

// Input into any validator function or validator group.
// Each key can be a constraint array, or a validator group function
export type ObjectValidatorMap<T> = {
  [K in keyof T]: InternalConstraint[] | GroupConstraint<any>;
};

// The output of a validator function given an input object of T.
// For each key of T, if it was a validator group, the value should be the return value of that
// group. Otherwise, it is an array of strings.
export type ObjectMessageMap<T/* extends ObjectValidatorMap*/> = {
  [K in keyof T]?: T[K] extends GroupConstraint<infer U> ? U : string[];
};

export type ValidationResultMessages<T = any> = string[] | T;

export type ValidateOptions = {
  rootKey?: string;
};

export function runConstraints<T>(
  value: any,
  constraints: InternalConstraint[] | GroupConstraint<T>,
  options: ConstraintOptions,
): Promise<T | undefined> {
  if (!Array.isArray(constraints)) {
    return castPromise(constraints(value, options));
  }

  const messagesM = pMapSeries(constraints, constraint => constraint(value, options))
    .then(results => results.filter(result => result !== undefined) as string[])
    .then(messages => messages.length > 0 ? messages : undefined);
  // We need to cast messages here because typescript expects this function to return T
  return messagesM as Promise<any>;
}

/* tslint:disable:max-line-length */
export function validate<T>(value: any, constraintGroup: GroupConstraint<T>, options?: ValidateOptions): Promise<ValidationResult<T>>;
export function validate<T = string[]>(value: any, constraints: InternalConstraint[], options?: ValidateOptions): Promise<ValidationResult<T>>;
/* tslint:enable:max-line-length */
export function validate<T>(
  value: any,
  constraints: InternalConstraint[] | GroupConstraint<T>,
  options: ValidateOptions = {},
): Promise<ValidationResult<T>> {
  const constraintOptions: ConstraintOptions = {
    key: options.rootKey == null ? 'value' : options.rootKey,
    keyPath: [],
    root: value,
    parent: undefined,
  };

  return runConstraints<T>(value, constraints, constraintOptions)
    .then(results => new ValidationResult<T>(results));
}
