import {
  RuleMessage,
  makeConstraint,
  Constraint,
  ConstraintOptions,
} from '../make-constraint';

const requiredConstraint: Constraint = value => value != null;
export function required(message: RuleMessage = 'Value is required') {
  return makeConstraint({ message, constraint: requiredConstraint });
}

const notNullConstraint: Constraint = value => value !== null;
export function notNull(message: RuleMessage = 'Value must not be null') {
  return makeConstraint({ message, constraint: notNullConstraint });
}

const definedConstraint: Constraint = value => value !== undefined;
export function defined(message: RuleMessage = 'Value must not be undefined') {
  return makeConstraint({ message, constraint: definedConstraint });
}
