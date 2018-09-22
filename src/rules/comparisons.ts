import { Constraint, makeConstraint, RuleMessage, ConstraintOptions } from '../make-constraint';

export type EqualsParams = { expected: any };
const equalsMessage: RuleMessage<EqualsParams>
  = (value, options, { expected }) => `Value must be equal to ${expected}`;
const equalsConstraint: Constraint<EqualsParams>
  = (value, options, { expected }) => value == null || value === expected;
export function equals(expected: any, message: RuleMessage<EqualsParams> = equalsMessage) {
  return makeConstraint({ message, constraint: equalsConstraint, params: { expected } });
}

export type EqualToParams = { key: string };
const equalToMessage: RuleMessage<EqualToParams>
  = (value, options, { key }) => `Value must be the same as ${key}`;
const equalToConstraint: Constraint<EqualToParams>
  = (value, options, { key }) => value == null || value === options.parent[key];
export function equalTo(key: string, message: RuleMessage<EqualToParams> = equalToMessage) {
  return makeConstraint({ message, constraint: equalToConstraint, params: { key } });
}

export type OneOfParams = { items: any };
const oneOfMessage: RuleMessage<OneOfParams>
  = (value, options, { items }) => `Value must be one of ${items.join(', ')}`;
const oneOfConstraint: Constraint<OneOfParams>
  = (value, options, { items }) => value == null || items.includes(value);
export function oneOf(items: any[], message: RuleMessage<OneOfParams> = oneOfMessage) {
  return makeConstraint({ message, constraint: oneOfConstraint, params: { items } });
}

export type ConformsToParams = { conformFn: Constraint };
const conformsToConstraint: Constraint<ConformsToParams>
  = (value, options, params) => value == null || params.conformFn(value, options, undefined);
export function conformsTo(conformFn: Constraint, message: RuleMessage<any>) {
  return makeConstraint({ message, constraint: conformsToConstraint, params: { conformFn } });
}
