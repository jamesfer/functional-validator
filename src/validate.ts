import { ConstraintOptions, GroupConstraint, InternalConstraint } from './make-constraint';
import { ValidationResult } from './validation-result';

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

export function runConstraints<T = string[]>(
  value: any,
  constraints: InternalConstraint[] | GroupConstraint<T>,
  options: ConstraintOptions,
): T | undefined {
  if (constraints instanceof Array) {
    const messages = [];
    for (const constraint of constraints) {
      const result = constraint(value, options);
      if (result !== undefined) {
        messages.push(result);
      }
    }
    return messages.length ? messages : undefined as any;
  }
  return constraints(value, options);
}


/* tslint:disable:max-line-length */
export function validate<T>(value: any, constraintGroup: GroupConstraint<T>, options?: ValidateOptions): ValidationResult<T>;
export function validate<T = string[]>(value: any, constraints: InternalConstraint[], options?: ValidateOptions): ValidationResult<T>;
/* tslint:enable:max-line-length */
export function validate<T>(
  value: any,
  constraints: InternalConstraint[] | GroupConstraint<T>,
  options: ValidateOptions = {},
): ValidationResult<T> {
  const constraintOptions: ConstraintOptions = {
    key: options.rootKey == null ? 'value' : options.rootKey,
    keyPath: [],
    root: value,
    parent: undefined,
  };
  return new ValidationResult<T>(runConstraints<T>(value, constraints, constraintOptions));
}
